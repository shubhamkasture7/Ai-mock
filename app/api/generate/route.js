// app/api/generate/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the structure for a roadmap step
interface RoadmapStep {
  title: string;
  description: string;
}

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // --- 1. Generate Learning Roadmap with Gemini ---
    const prompt = `Create a detailed, step-by-step learning roadmap for the topic: "${topic}". 
    Format the output as a valid JSON object with a single key "roadmap".
    The "roadmap" key should contain an array of objects, where each object has a "title" and a "description" for a step in the learning path.
    Example: {"roadmap": [{"title": "Step 1: The Basics", "description": "Understand the core concepts."}]}`;
    
    const geminiResult = await model.generateContent(prompt);
    const geminiResponse = await geminiResult.response;
    const geminiText = geminiResponse.text().replace(/```json|```/g, '').trim(); // Clean up potential markdown
    
    let roadmap: RoadmapStep[] = [];
    try {
        roadmap = JSON.parse(geminiText).roadmap;
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", geminiText);
        return NextResponse.json({ error: "Failed to generate a valid roadmap." }, { status: 500 });
    }

    // --- 2. Fetch Related YouTube Videos ---
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const searchQuery = encodeURIComponent(`${topic} tutorial for beginners`);
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${youtubeApiKey}&type=video&maxResults=6`;

    const youtubeResponse = await fetch(youtubeUrl);
    if (!youtubeResponse.ok) {
        throw new Error('Failed to fetch YouTube videos');
    }
    const youtubeData = await youtubeResponse.json();
    
    const videos = youtubeData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    // --- 3. Return Combined Data ---
    return NextResponse.json({ roadmap, videos });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}