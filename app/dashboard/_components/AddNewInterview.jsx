"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiModel";
import { LoaderCircle, Sparkles, ClipboardList } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const questionCount =
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 8;

    const prompt = `
You are an experienced technical interviewer.

Generate EXACTLY ${questionCount} realistic interview questions and answers
for the following candidate:

Role: ${jobPosition}
Experience: ${jobExperience} years
Tech Stack: ${jobDescription}

Rules:
1️⃣ Respond ONLY with a VALID JSON array. No markdown, no comments.
2️⃣ Each item must be:
{
  "question": "...",
  "answer": "..."
}
3️⃣ First question MUST be:
"Introduce yourself" / "Tell me about yourself as a ${jobPosition}"
4️⃣ Cover mix of:
- Technical questions (based on tech stack)
- Experience-based questions
- Behavioral questions (max 30%)
5️⃣ Answers should be concise and realistic.
`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();

      let jsonText = null;

      // Try extracting JSON safely
      const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1].trim();
      } else {
        const arrayMatch = responseText.match(/\[[\s\S]*\]/);
        jsonText = arrayMatch ? arrayMatch[0].trim() : responseText.trim();
      }

      let jsonData;
      try {
        jsonData = JSON.parse(jsonText);
      } catch (err) {
        console.error("JSON Parse Error: ", jsonText);
        alert("AI failed to generate valid interview data. Try again!");
        setLoading(false);
        return;
      }

      const inserted = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(jsonData),
          jsonPosition: jobPosition,
          jsonDesc: jobDescription,
          jsonExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (inserted?.[0]?.mockId) {
        setOpenDialog(false);
        setJobPosition("");
        setJobDescription("");
        setJobExperience("");
        router.push(`/dashboard/interview/${inserted[0].mockId}`);
      }
    } catch (err) {
      console.error("Error creating interview:", err);
      alert("Something went wrong. Try again!");
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenDialog(true)}
        className="w-full max-w-md mx-auto mt-4 rounded-2xl border border-dashed border-indigo-300
                   bg-white/70 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md
                   flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            Start a New Mock Interview
          </h3>
          <p className="text-xs text-gray-600">
            AI will generate job-specific realistic questions for you.
          </p>
        </div>
      </button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1.4fr]">
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white p-6">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  AI-Powered Mock Interview
                </DialogTitle>
                <p className="text-sm text-indigo-100 mt-2">
                  Give us your role & skills → We make interview for you!
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-6">
              <DialogHeader>
                <DialogDescription className="text-xs text-gray-500">
                  Provide interview details
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-medium">Job Role</label>
                  <Input
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Tech Stack / Skills
                  </label>
                  <Textarea
                    required
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button disabled={loading} className="bg-indigo-600 text-white">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" size={16} />
                        Generating...
                      </>
                    ) : (
                      "Generate Interview"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
