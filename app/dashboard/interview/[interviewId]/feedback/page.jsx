"use client";
import { UserAnswer } from '@/utils/schema';
import { db } from '@/utils/db';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Award, CheckCircle2, AlertCircle, Lightbulb, Home, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = async () => {
        if (!params || !params.interviewId) {
            console.error("No interviewId found in params");
            return;
        }

        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);
        console.log(result);
        setFeedbackList(result);
    };

    // Calculate overall rating
    const calculateOverallRating = () => {
        if (feedbackList.length === 0) return 0;
        const totalRating = feedbackList.reduce((sum, item) => sum + (item.rating || 0), 0);
        return (totalRating / feedbackList.length).toFixed(1);
    };

    const overallRating = calculateOverallRating();

    // Rating color based on score
    const getRatingColor = (rating) => {
        if (rating >= 8) return 'text-green-600 bg-green-50 border-green-200';
        if (rating >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (rating >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getOverallRatingColor = (rating) => {
        if (rating >= 8) return 'from-green-500 to-emerald-600';
        if (rating >= 6) return 'from-yellow-500 to-orange-500';
        if (rating >= 4) return 'from-orange-500 to-red-500';
        return 'from-red-500 to-rose-600';
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
            <div className='max-w-5xl mx-auto p-6 md:p-10'>
                {feedbackList?.length === 0 ? (
                    // Empty State
                    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
                        <div className='bg-white rounded-full p-6 shadow-lg mb-6'>
                            <AlertCircle className='w-16 h-16 text-gray-400' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-700 mb-2'>
                            No Interview Feedback Found
                        </h2>
                        <p className='text-gray-500 mb-8 max-w-md'>
                            It looks like you haven't completed any interviews yet. Start practicing to get personalized feedback!
                        </p>
                        <Button 
                            onClick={() => router.replace('/dashboard')}
                            size="lg"
                            className="gap-2"
                        >
                            <Home className='w-4 h-4' />
                            Back to Dashboard
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Header Section with Overall Score */}
                        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100'>
                            <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                                <div className='flex-1 text-center md:text-left'>
                                    <div className='flex items-center gap-3 justify-center md:justify-start mb-3'>
                                        <div className='bg-green-100 p-2 rounded-full'>
                                            <Award className='w-8 h-8 text-green-600' />
                                        </div>
                                        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
                                            Congratulations! 🎉
                                        </h1>
                                    </div>
                                    <p className='text-lg text-gray-600 mb-2'>
                                        You've completed your interview session
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Review your performance and identify areas for improvement
                                    </p>
                                </div>

                                {/* Overall Rating Card */}
                                <div className='flex-shrink-0'>
                                    <div className={`bg-gradient-to-br ${getOverallRatingColor(overallRating)} rounded-2xl p-6 text-white shadow-lg min-w-[160px]`}>
                                        <div className='text-center'>
                                            <p className='text-sm font-medium opacity-90 mb-1'>Overall Rating</p>
                                            <div className='text-5xl font-bold mb-1'>
                                                {overallRating}
                                            </div>
                                            <p className='text-xs opacity-80'>out of 10</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200'>
                                <div className='flex items-center gap-3 bg-blue-50 rounded-lg p-4'>
                                    <div className='bg-blue-100 p-2 rounded-lg'>
                                        <TrendingUp className='w-5 h-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-0.5'>Total Questions</p>
                                        <p className='text-2xl font-bold text-gray-800'>{feedbackList.length}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 bg-green-50 rounded-lg p-4'>
                                    <div className='bg-green-100 p-2 rounded-lg'>
                                        <CheckCircle2 className='w-5 h-5 text-green-600' />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-0.5'>Strong Answers</p>
                                        <p className='text-2xl font-bold text-gray-800'>
                                            {feedbackList.filter(item => item.rating >= 7).length}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 bg-purple-50 rounded-lg p-4'>
                                    <div className='bg-purple-100 p-2 rounded-lg'>
                                        <Lightbulb className='w-5 h-5 text-purple-600' />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600 mb-0.5'>Needs Improvement</p>
                                        <p className='text-2xl font-bold text-gray-800'>
                                            {feedbackList.filter(item => item.rating < 7).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6'>
                            <p className='text-sm text-blue-800'>
                                <strong>💡 Review Guide:</strong> Expand each question below to see your answer, the correct answer, and personalized feedback for improvement.
                            </p>
                        </div>

                        {/* Question Feedback List */}
                        <div className='space-y-4'>
                            {feedbackList.map((item, index) => (
                                <Collapsible key={index}>
                                    <div className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                                        <CollapsibleTrigger className='w-full p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors duration-200'>
                                            <div className='flex items-start gap-4 flex-1 text-left'>
                                                <div className='flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mt-1'>
                                                    {index + 1}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-semibold text-gray-800 text-base md:text-lg mb-2 leading-snug'>
                                                        {item.question}
                                                    </h3>
                                                    <div className='flex items-center gap-2'>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRatingColor(item.rating)}`}>
                                                            <Award className='w-3.5 h-3.5' />
                                                            {item.rating}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronsUpDown className='w-5 h-5 text-gray-400 flex-shrink-0 mt-2' />
                                        </CollapsibleTrigger>

                                        <CollapsibleContent>
                                            <div className='p-5 pt-0 space-y-4'>
                                                {/* Your Answer */}
                                                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <div className='bg-red-100 p-1.5 rounded'>
                                                            <AlertCircle className='w-4 h-4 text-red-600' />
                                                        </div>
                                                        <h4 className='font-semibold text-red-900 text-sm'>Your Answer</h4>
                                                    </div>
                                                    <p className='text-sm text-red-800 leading-relaxed'>
                                                        {item.userAns}
                                                    </p>
                                                </div>

                                                {/* Correct Answer */}
                                                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <div className='bg-green-100 p-1.5 rounded'>
                                                            <CheckCircle2 className='w-4 h-4 text-green-600' />
                                                        </div>
                                                        <h4 className='font-semibold text-green-900 text-sm'>Correct Answer</h4>
                                                    </div>
                                                    <p className='text-sm text-green-800 leading-relaxed'>
                                                        {item.correctAns}
                                                    </p>
                                                </div>

                                                {/* Feedback */}
                                                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <div className='bg-blue-100 p-1.5 rounded'>
                                                            <Lightbulb className='w-4 h-4 text-blue-600' />
                                                        </div>
                                                        <h4 className='font-semibold text-blue-900 text-sm'>Feedback for Improvement</h4>
                                                    </div>
                                                    <p className='text-sm text-blue-800 leading-relaxed'>
                                                        {item.feedback}
                                                    </p>
                                                </div>
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            ))}
                        </div>

                        {/* Action Button */}
                        <div className='mt-8 flex justify-center'>
                            <Button 
                                onClick={() => router.replace('/dashboard')}
                                size="lg"
                                className="gap-2 px-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Home className='w-4 h-4' />
                                Back to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Feedback;