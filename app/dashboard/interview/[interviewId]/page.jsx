"use client";

import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../utils/db';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [interviewData, setInterviewData] = useState({}); // <-- empty object

    useEffect(() => {
        if (params?.interviewId) {
            GetInterviewDetails();
        }
    }, [params?.interviewId]); // include dependency

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (result && result.length > 0) {
                setInterviewData(result[0]);
            }
        } catch (err) {
            console.error('Error fetching interview details:', err);
        }
    };

    return (
        <div className='my-10 px-6'>
            <h2 className='font-bold text-3xl mb-12 text-gray-800'>Let's get started</h2>

            <div className='flex flex-col justify-center items-center w-full max-w-6xl'>
                <div className='flex flex-col md:flex-row items-start justify-between w-full gap-6'>

                    {/* Left Side */}
                    <div className='flex flex-col items-start justify-start flex-grow w-full md:w-1/2'>
                        <div className='p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-6 w-full'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                                <strong>Job Role / Position: </strong> {interviewData?.jsonPosition || 'Loading...'}
                            </h2>
                            <h2 className='text-lg text-gray-700 mb-4'>
                                <strong className='text-gray-900'>Job Description: </strong> {interviewData?.jsonDesc || 'Loading...'}
                            </h2>
                            <h2 className='text-lg text-gray-700'>
                                <strong className='text-gray-900'>Experience Required: </strong> {interviewData?.jsonExperience || 'Loading...'}
                            </h2>
                        </div>

                        <div className='p-6 border rounded-lg border-yellow-300 bg-yellow-50 mt-3'>
                            <h2 className='flex mb-4 gap-2 items-center text-yellow-500 text-lg'>
                                <Lightbulb /><strong>Information</strong>
                            </h2>
                            <p className='text-yellow-700'>
                                {process.env.NEXT_PUBLIC_INFORMATION || 'No information available'}
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className='flex flex-col items-center justify-center w-full md:w-1/2'>
                        {webCamEnabled ? (
                            <Webcam
                                mirrored
                                style={{ height: 300, width: 300, borderRadius: '10px', objectFit: 'cover' }}
                                className='shadow-lg'
                            />
                        ) : (
                            <>
                                <WebcamIcon className='h-72 w-full my-6 p-20 bg-gray-100 text-gray-600 rounded-lg border-2 border-gray-300 shadow-md' />
                                <Button
                                    onClick={() => setWebCamEnabled(true)}
                                    className="mt-2 bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 rounded-md shadow-md w-full"
                                >
                                    Enable Web-Cam and Microphone
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-end items-end mx-11 mt-6'>
                <Link href={`/dashboard/interview/${params.interviewId}/start`}>
                    <Button variant='ghost' className='border-gray-300 bg-gray-200 px-10'>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
