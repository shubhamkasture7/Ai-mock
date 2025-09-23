"use client"
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { Button } from '@/components/ui/button'; // Ensure the Button component is correctly imported
import React from 'react';
import logo from '../../../public/logo.svg'

function InterviewItemCard({ interview }) {
  const router = useRouter(); // Initialize useRouter

  // Function to handle navigation
  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onFeedbackClick = () =>{
    router.push('/dashboard/interview/'+interview.mockId+'/feedback')
  }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <img src={logo} alt="" />
      <h2 className='font-bold text-primary'>{interview?.jsonPosition || 'No position provided'}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jsonExperience + ' years of experience' || 'No experience available'}</h2>
      <h2 className='text-xs text-gray-500'>Created At: {interview?.createdAt || 'Not specified'}</h2>
      
      {/* Button Container */}
      <div className='flex mt-4'> {/* Flexbox container */}
        <Button 
          size='sm' 
          variant='outline'   
          onClick={onStart} 
          className='flex-1 mr-2' // Flex-1 for equal width and margin right for spacing
        >
          Start
        </Button>
        <Button 
          size='sm' 
          className='flex-1 text-white'
          onClick ={onFeedbackClick} // Flex-1 for equal width
        >
          Feedback
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
