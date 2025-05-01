"use client";
import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import { toast } from '@/hooks/use-toast';
import { chatSession } from '@/utils/GeminiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';

function RecordAnswerSection({ activeQuestionIndex, mockInterviewQuestion, interviewData }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    const fullTranscript = results.map(r => r.transcript).join(' ') + ' ' + interimResult;
    if (fullTranscript.trim().length > 1) {
      setUserAnswers((prev) => ({
        ...prev,
        [activeQuestionIndex]: fullTranscript,
      }));
    }
  }, [results, interimResult, activeQuestionIndex]);

  useEffect(() => {
    if (!isRecording && userAnswers[activeQuestionIndex]?.length > 10) {
      UpdateUserAnswerInDb();
    }
  }, [isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      if (typeof stopSpeechToText === 'function') {
        stopSpeechToText();
      } else {
        console.warn('stopSpeechToText is not a function');
      }

      if (userAnswers[activeQuestionIndex]?.length < 10) {
        toast({
          title: 'Error',
          description: 'Your answer is too short. Please record again.',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (typeof startSpeechToText === 'function') {
        startSpeechToText();
      } else {
        console.warn('startSpeechToText is not a function');
      }
    }
  };

  const UpdateUserAnswerInDb = async () => {
    setLoading(true);
    const userAnswer = userAnswers[activeQuestionIndex];

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Please give a rating and short feedback in JSON format with fields 'rating' and 'feedback'.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const text = await result.response.text();
      const cleanJson = text.replace(/```json|```/g, '');
      const JsonFeedbackResp = JSON.parse(cleanJson);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });

      if (resp) {
        toast({
          title: 'Success',
          description: 'Your answer has been saved successfully.',
          variant: 'success',
        });
        setUserAnswers((prev) => ({ ...prev, [activeQuestionIndex]: '' }));
        setResults([]);
      }
    } catch (error) {
      console.error('Error updating answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your answer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className="flex flex-col justify-center items-center my-0 rounded-lg p-5 mt-15 relative">
      {isWebcamEnabled ? (
        <Webcam
          audio={false}
          height={500}
          width={300}
          mirrored={true}
          className='rounded-lg shadow-lg'
          videoConstraints={{ facingMode: "user" }}
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg shadow-lg bg-gray-200" style={{ height: 300, width: 300 }}>
          <WebcamIcon size={48} className="text-gray-600" />
        </div>
      )}

      <Button
        disabled={loading}
        onClick={StartStopRecording}
        variant='outline'
        className='my-10'
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>
            <StopCircle /> Stop Recording
          </h2>
        ) : 'Record answer'}
      </Button>

      <Button onClick={() => setIsWebcamEnabled((prev) => !prev)} variant='outline' className='my-4 flex items-center gap-2'>
        {isWebcamEnabled ? (
          <h2>Disable Webcam</h2>
        ) : (
          <>
            <WebcamIcon />
            <h2>Enable Webcam</h2>
          </>
        )}
      </Button>

      {(userAnswers[activeQuestionIndex] || interimResult) && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full max-w-2xl text-sm text-gray-800">
          <strong>Your Answer:</strong> {userAnswers[activeQuestionIndex] || interimResult}
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;



// "use client";
// import useSpeechToText from 'react-hook-speech-to-text';
// import { Button } from '@/components/ui/button';
// import { Mic, StopCircle, WebcamIcon } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import Webcam from 'react-webcam';
// import { toast } from '@/hooks/use-toast';
// import { chatSession } from '@/utils/GeminiModel';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import { db } from '@/utils/db';
// import moment from 'moment';

// function RecordAnswerSection({ activeQuestionIndex, mockInterviewQuestion, interviewData }) {
//     const [userAnswers, setUserAnswers] = useState({});
//     const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
//     const { user } = useUser();
//     const [loading, setLoading] = useState(false);

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults,
//     } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     });

//     useEffect(() => {
//         if (!isRecording) return;

//         const fullTranscript = results.map(r => r.transcript).join(' ') + ' ' + interimResult;

//         if (fullTranscript.trim().length > 1) {
//             setUserAnswers((prev) => ({
//                 ...prev,
//                 [activeQuestionIndex]: fullTranscript,
//             }));
//         }
//     }, [results, interimResult, isRecording, activeQuestionIndex]);

//     useEffect(() => {
//         if (!isRecording && (userAnswers[activeQuestionIndex]?.length > 10)) {
//             UpdateUserAnswerInDb();
//         }
//     }, [userAnswers, isRecording, activeQuestionIndex]);

//     const StartStopRecording = async () => {
//         if (isRecording) {
//             stopSpeechToText();
//             if (userAnswers[activeQuestionIndex]?.length < 10) {
//                 setLoading(false);
//                 toast({
//                     title: 'Error',
//                     description: 'Your answer is too short. Please record again.',
//                     variant: 'destructive',
//                 });
//                 return;
//             }
//         } else {
//             startSpeechToText();
//         }
//     };

//     const UpdateUserAnswerInDb = async () => {
//         console.log(userAnswers[activeQuestionIndex]);

//         setLoading(true);
//         const userAnswer = userAnswers[activeQuestionIndex];
//         const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Depending on user answer for given question, please give us a rating for the answer. Give feedback and areas of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

//         const result = await chatSession.sendMessage(feedbackPrompt);
//         const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
//         console.log(mockJsonResp);

//         const JsonFeedbackResp = JSON.parse(mockJsonResp);

//         const resp = await db.insert(UserAnswer).values({
//             mockIdRef: interviewData?.mockId,
//             question: mockInterviewQuestion[activeQuestionIndex]?.question,
//             correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//             userAns: userAnswer,
//             feedback: JsonFeedbackResp?.feedback,
//             rating: JsonFeedbackResp?.rating,
//             userEmail: user?.primaryEmailAddress?.emailAddress,
//             createdAt: moment().format('DD-MM-yyyy')
//         });

//         if (resp) {
//             toast('User Answer Successfully');
//             setUserAnswers((prev) => ({ ...prev, [activeQuestionIndex]: '' }));
//             setResults([]);
//         }

//         setLoading(false);

//         toast({
//             title: 'Success',
//             description: 'Your answer has been saved successfully.',
//             variant: 'success',
//         });
//     };

//     return (
//         <div className="flex flex-col justify-center items-center my-0 rounded-lg p-5 mt-15 relative">
//             {isWebcamEnabled ? (
//                 <Webcam
//                     audio={false}
//                     height={500}
//                     width={300}
//                     mirrored={true}
//                     className='rounded-lg shadow-lg'
//                     videoConstraints={{
//                         facingMode: "user"
//                     }}
//                 />
//             ) : (
//                 <div className="flex items-center justify-center rounded-lg shadow-lg bg-gray-200" style={{ height: 300, width: 300 }}>
//                     <WebcamIcon size={48} className="text-gray-600" />
//                 </div>
//             )}

//             <Button
//                 disabled={loading}
//                 onClick={StartStopRecording}
//                 variant='outline'
//                 className='my-10'
//             >
//                 {isRecording ? (
//                     <h2 className='text-red-600 flex gap-2'>
//                         <StopCircle /> Stop Recording
//                     </h2>
//                 ) : 'Record answer'}
//             </Button>

//             <Button onClick={() => setIsWebcamEnabled((prev) => !prev)} variant='outline' className='my-10 flex items-center gap-2'>
//                 {isWebcamEnabled ? (
//                     <h2>Disable Webcam</h2>
//                 ) : (
//                     <>
//                         <WebcamIcon />
//                         <h2>Enable Webcam</h2>
//                     </>
//                 )}
//             </Button>

//             {(userAnswers[activeQuestionIndex] || interimResult) && (
//                 <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full max-w-2xl text-sm text-gray-800">
//                     <strong>Your Answer:</strong> {userAnswers[activeQuestionIndex] || interimResult}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default RecordAnswerSection;








































// ======================================================================================================================================


// =======================================================================================================================================


// "use client";
// import useSpeechToText from 'react-hook-speech-to-text';
// import { Button } from '@/components/ui/button';
// import { Mic, StopCircle, WebcamIcon } from 'lucide-react'; 
// import React, { useEffect, useState } from 'react';
// import Webcam from 'react-webcam'; 
// import { toast } from '@/hooks/use-toast'; 
// import { chatSession } from '@/utils/GeminiModel';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import { db } from '@/utils/db';
// import moment from 'moment';

// function RecordAnswerSection({ activeQuestionIndex, mockInterviewQuestion, interviewData }) {
//     const [userAnswers, setUserAnswers] = useState({}); // Object to hold answers for each question
//     const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
//     const { user } = useUser();
//     const [loading, setLoading] = useState(false);

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults,
//     } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//     });

//     useEffect(() => {
//         results.forEach((result) => {
//             setUserAnswers((prevAnswers) => ({
//                 ...prevAnswers,
//                 [activeQuestionIndex]: (prevAnswers[activeQuestionIndex] || '') + result?.transcript
//             }));
//         });
//     }, [results, activeQuestionIndex]);

//     useEffect(() => {
//         if (!isRecording && (userAnswers[activeQuestionIndex]?.length > 10)) {
//             UpdateUserAnswerInDb();
//         }
//     }, [userAnswers, isRecording, activeQuestionIndex]);

//     const StartStopRecording = async () => {
//         if (isRecording) {
//             stopSpeechToText();
//             if (userAnswers[activeQuestionIndex]?.length < 10) {
//                 setLoading(false);
//                 toast({
//                     title: 'Error',
//                     description: 'Your answer is too short. Please record again.',
//                     variant: 'destructive',
//                 });
//                 return; // Show error toast and exit
//             }
//         } else {
//             startSpeechToText();
//         }
//     }

//     const UpdateUserAnswerInDb = async () => {
//         console.log(userAnswers[activeQuestionIndex]); // Log the answer for the active question

//         setLoading(true);
//         const userAnswer = userAnswers[activeQuestionIndex]; // Get the specific answer for the active question
//         const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Depending on user answer for given question, please give us a rating for the answer. Give feedback and areas of improvement in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

//         const result = await chatSession.sendMessage(feedbackPrompt);
//         const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
//         console.log(mockJsonResp);

//         const JsonFeedbackResp = JSON.parse(mockJsonResp);

//         const resp = await db.insert(UserAnswer).values({
//             mockIdRef: interviewData?.mockId,
//             question: mockInterviewQuestion[activeQuestionIndex]?.question,
//             correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
//             userAns: userAnswer,
//             feedback: JsonFeedbackResp?.feedback,
//             rating: JsonFeedbackResp?.rating,
//             userEmail: user?.primaryEmailAddress?.emailAddress,
//             createdAt: moment().format('DD-MM-yyyy')
//         });

//         if (resp) {
//             toast('User Answer Successfully');
//             setUserAnswers((prev) => ({ ...prev, [activeQuestionIndex]: '' })); // Reset answer for the current question
//             setResults([]);
//         }

//         setLoading(false);
//         setResults([]);

//         toast({
//             title: 'Success',
//             description: 'Your answer has been saved successfully.',
//             variant: 'success',
//         });
//     }

//     return (
//         <div className="flex flex-col justify-center items-center my-0 rounded-lg p-5 mt-15 relative">
//             {isWebcamEnabled ? (
//                 <Webcam
//                     audio={false}
//                     height={500}
//                     width={300}
//                     mirrored={true}
//                     className='rounded-lg shadow-lg'
//                     videoConstraints={{
//                         facingMode: "user"
//                     }}
//                 />
//             ) : (
//                 <div className="flex items-center justify-center rounded-lg shadow-lg bg-gray-200" style={{ height: 300, width: 300 }}>
//                     <WebcamIcon size={48} className="text-gray-600" />
//                 </div>
//             )}

//             <Button
//                 disable={loading}
//                 onClick={StartStopRecording} variant='outline' className='my-10'>
//                 {isRecording ? (
//                     <h2 className='text-red-600 flex gap-2'>
//                         <StopCircle /> Stop Recording
//                     </h2>
//                 ) : 'Record answer'}
//             </Button>

//             <Button onClick={() => setIsWebcamEnabled((prev) => !prev)} variant='outline' className='my-10 flex items-center gap-2'>
//                 {isWebcamEnabled ? (
//                     <h2>Disable Webcam</h2>
//                 ) : (
//                     <>
//                         <WebcamIcon />
//                         <h2>Enable Webcam</h2>
//                     </>
//                 )}
//             </Button>
//         </div>
//     );
// }

// export default RecordAnswerSection;
