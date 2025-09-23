"use client"
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './AddNewInterview.css';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger as it's not needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false); // Dialog state
    const [jobPosition, setJobPosition] = useState()
    const [jobDescription, setJobDescription] = useState()
    const [jobExperience, setJobExperience] = useState()
    const [loading, setLoading] = useState(false)
    const [jsonResponse, setJsonResponse] = useState([])
    const {user} = useUser();
    const router = useRouter();

    const onSubmit = async(e) => {
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition, jobDescription, jobExperience)

        const InputPrompt = 'Job position: ' + jobPosition + ', Job Description: ' + jobDescription + ', Years of Experience: ' + jobExperience + ', Depend on job position, job description and years of experience give us'+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + 'questions and answers in JSON format, Give us question and answer fields on JSON';

        const result = await chatSession.sendMessage(InputPrompt);

        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');

        // console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp); 
    
if(MockJsonResp){

            const resp = await db.insert(MockInterview)
            .values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResp,
                jsonPosition: jobPosition,       // Map jobPosition to jsonPosition
                jsonDesc: jobDescription,        // Map jobDescription to jsonDesc
                jsonExperience: jobExperience,   // Map jobExperience to jsonExperience
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            }).returning({mockId: MockInterview.mockId});
        

        console.log("inserted id", resp)

        if(resp){
            setOpenDialog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
        

    }
    else{
        console.log('error')
    }

        setLoading(false)

    }

    return (
        <div>
            {/* Button to trigger the dialog */}
            <div
                className='mt-4 px-6 py-2 bg-[#0A1730] text-white font-medium rounded-lg 
                         hover:bg-[#132544] transition-colors duration-200 cursor-pointer'
                onClick={() => setOpenDialog(true)} // Open dialog on click
            >
                <h2 className='text-lg text-center'>Create Interview</h2>
            </div>

            {/* Dialog component */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}> {/* Manage the dialog state */}
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell Us More about your Job Interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>


                                <h2>
                                    Add Details About your Job position/role , Job description and years of experience
                                </h2>

                                <div className='mt-7 my-3'>
                                    <label >Job Role/Job Position</label>
                                    <Input placeholder='ex full stack developer' required
                                        onChange={(event) => setJobPosition(event.target.value)}
                                    />
                                </div>
                                <div className='my-3'>
                                    <label >Job Description/ Tech Stack (In Short)</label>
                                    <Textarea placeholder='ex React, Angular, MySql, Node js' required
                                        onChange={(event) => setJobDescription(event.target.value)}
                                    />
                                </div>

                                <div className=' my-3'>
                                    <label >Years of Experience</label>
                                    <Input placeholder=' 5' type='number' required max='50'
                                        onChange={(event) => setJobExperience(event.target.value)}
                                    />
                                </div>

                                <div className='flex gap-5 justify-end mt-4'>
                                    {/* Cancel Button */}
                                    <Button
                                        type='button'
                                        className='!outline-none !border-none !bg-gray-400 !text-white'
                                        onClick={() => setOpenDialog(false)} // Close dialog on cancel
                                    >
                                        Cancel
                                    </Button>

                                    {/* Start Interview Button */}
                                    <Button type='submit' disable ={loading} className='bg-primary text-white'>
                                        {
                                            loading ?
                                            <>
                                            <LoaderCircle className='animate-spin'/> 'Generating from AI' </>: ' Start Interview'
                                        }
                                        
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
