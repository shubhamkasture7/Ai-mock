"use client";

import React, { useEffect, useState, useRef } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, WebcamIcon, SkipForward } from "lucide-react";
import Webcam from "react-webcam";
import { toast } from "@/hooks/use-toast";
import { chatSession } from "@/utils/GeminiModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { and, eq } from "drizzle-orm";

function RecordAnswerSection({
  activeQuestionIndex,
  mockInterviewQuestion,
  interviewData,
  onNextQuestion,
}) {
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const lastSpeechTimeRef = useRef(null);
  // 🔧 FIX 1: Store the accumulated transcript separately to avoid loss
  const accumulatedTranscriptRef = useRef("");

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
    useLegacyResults: false,
  });

  /** 🔹 Build the current transcript from results + interim */
  const buildCurrentTranscript = () => {
    const pieces = [
      ...results.map((r) => r.transcript),
      typeof interimResult === "string" ? interimResult : "",
    ];
    return pieces
      .filter(Boolean)
      .join(" ")
      .trim();
  };

  /** 🔧 FIX 2: Update both preview AND ref whenever speech changes */
  useEffect(() => {
    const current = buildCurrentTranscript();
    if (current.length > 0) {
      lastSpeechTimeRef.current = Date.now();
      accumulatedTranscriptRef.current = current; // Store in ref
      setPreviewAnswers((prev) => ({
        ...prev,
        [activeQuestionIndex]: current,
      }));
    }
  }, [results, interimResult, activeQuestionIndex]);

  /** 🔹 When question changes: reset state and stop recognition */
  useEffect(() => {
    setAutoSubmitted(false);
    lastSpeechTimeRef.current = null;
    accumulatedTranscriptRef.current = ""; // Reset ref
    setResults([]);
    setPreviewAnswers((prev) => ({
      ...prev,
      [activeQuestionIndex]: "",
    }));

    if (isRecording && typeof stopSpeechToText === "function") {
      try {
        stopSpeechToText();
      } catch (e) {
        console.warn("Error stopping recognition on question change:", e);
      }
    }
  }, [activeQuestionIndex]);

  /** 🔹 Cleanup on unmount: stop recognition if still running */
  useEffect(() => {
    return () => {
      if (isRecording && typeof stopSpeechToText === "function") {
        try {
          stopSpeechToText();
        } catch (e) {
          console.warn("Error stopping recognition on unmount:", e);
        }
      }
    };
  }, []);

  /** 🔧 FIX 3: Improved silence detection with proper logging */
  useEffect(() => {
    if (!isRecording || loading || autoSubmitted) return;

    const intervalId = setInterval(() => {
      const last = lastSpeechTimeRef.current;
      if (!last) return;

      const idleMs = Date.now() - last;
      
      // Log for debugging
      if (idleMs > 5000) {
        console.log(`⏱️ Silence detected: ${Math.floor(idleMs / 1000)}s`);
      }

      if (idleMs >= 10000) {
        console.log("🛑 10 seconds reached - auto-saving...");
        setAutoSubmitted(true);
        handleStopAndSave(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRecording, loading, autoSubmitted]);

  /** 🔧 FIX 4: Improved stop and save with better transcript capture */
  const handleStopAndSave = async (auto = false) => {
    console.log("🔴 handleStopAndSave called, auto:", auto);
    
    // 1) Stop recognition if running
    if (isRecording && typeof stopSpeechToText === "function") {
      try {
        stopSpeechToText();
      } catch (e) {
        console.warn("Speech stop error:", e);
      }
    }

    // 2) Give Web Speech API a moment to flush final result
    await new Promise((res) => setTimeout(res, 1000)); // Increased from 800ms

    // 3) Build final answer from multiple sources (most reliable first)
    let finalAnswer = 
      accumulatedTranscriptRef.current || // Try ref first
      buildCurrentTranscript() || // Then try building from results
      previewAnswers[activeQuestionIndex] || // Finally try preview cache
      "";

    console.log("📝 Final answer sources:", {
      fromRef: accumulatedTranscriptRef.current?.substring(0, 50),
      fromBuild: buildCurrentTranscript()?.substring(0, 50),
      fromPreview: previewAnswers[activeQuestionIndex]?.substring(0, 50),
      finalLength: finalAnswer.length
    });

    if (!finalAnswer || finalAnswer.trim().length < 10) {
      if (!auto) {
        toast({
          title: "Answer too short",
          description:
            "Please speak a bit more so we can properly evaluate your answer.",
          variant: "destructive",
        });
      } else {
        console.warn("Auto-save skipped: answer too short");
      }
      return;
    }

    // 4) Save to DB (insert/update)
    const saveSuccess = await updateUserAnswerInDb(finalAnswer);

    // 5) Only proceed if save was successful
    if (!saveSuccess) {
      console.error("Save failed, not proceeding");
      return;
    }

    // 6) Clear recognition buffers for next question
    setResults([]);
    lastSpeechTimeRef.current = null;
    accumulatedTranscriptRef.current = "";
    
    // Keep the final answer in preview for this question
    setPreviewAnswers((prev) => ({
      ...prev,
      [activeQuestionIndex]: finalAnswer,
    }));

    // 7) Auto-next only in auto mode
    if (auto && typeof onNextQuestion === "function") {
      console.log("⏭️ Moving to next question...");
      setTimeout(() => {
        onNextQuestion();
      }, 500);
    }
  };

  const handleRecordButton = async () => {
    if (isRecording) {
      // Manual stop → save but don't auto-next
      await handleStopAndSave(false);
    } else {
      // Start recording
      setAutoSubmitted(false);
      setResults([]);
      accumulatedTranscriptRef.current = ""; // Reset ref
      lastSpeechTimeRef.current = Date.now();
      if (typeof startSpeechToText === "function") {
        try {
          startSpeechToText();
          console.log("🎤 Recording started");
        } catch (e) {
          console.warn("Speech start error:", e);
          toast({
            title: "Microphone Error",
            description: "Could not start recording. Please check your microphone permissions.",
            variant: "destructive",
          });
        }
      }
    }
  };

  /** 🔧 FIX 5: Return success status from updateUserAnswerInDb */
  const updateUserAnswerInDb = async (userAnswer) => {
    setLoading(true);

    const currentQ = mockInterviewQuestion[activeQuestionIndex];

    const feedbackPrompt = `
You are an interview evaluator.

Question: ${currentQ?.question}
User Answer: ${userAnswer}

Give a JSON response ONLY in this format (no extra text):

{
  "rating": 1-10,
  "feedback": "short constructive feedback in 1-2 sentences"
}
`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const text = await result.response.text();

      const cleanJson = text.replace(/```json|```/g, "").trim();
      const JsonFeedbackResp = JSON.parse(cleanJson);

      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const mockIdRef = interviewData?.mockId;
      const questionText = currentQ?.question;

      // Check if an answer already exists → overwrite
      const existing = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, mockIdRef),
            eq(UserAnswer.question, questionText),
            eq(UserAnswer.userEmail, userEmail)
          )
        );

      if (existing && existing.length > 0) {
        await db
          .update(UserAnswer)
          .set({
            userAns: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
            correctAns: currentQ?.answer,
            createdAt: moment().format("YYYY-MM-DD"),
          })
          .where(eq(UserAnswer.id, existing[0].id));
      } else {
        await db.insert(UserAnswer).values({
          mockIdRef,
          question: questionText,
          correctAns: currentQ?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail,
          createdAt: moment().format("YYYY-MM-DD"),
        });
      }

      toast({
        title: "Answer saved",
        description:
          existing && existing.length > 0
            ? "Your previous answer was updated successfully."
            : "Your response and AI feedback have been stored successfully.",
      });
      
      console.log("✅ Answer saved successfully");
      return true; // Return success
    } catch (error) {
      console.error("Error updating answer:", error);
      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive",
      });
      return false; // Return failure
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <p className="text-red-500 text-sm mt-4">
        Web Speech API is not available in this browser 🤷‍ Try using Chrome on
        desktop.
      </p>
    );
  }

  // Live transcript preview for UI only
  const preview =
    previewAnswers[activeQuestionIndex] ||
    accumulatedTranscriptRef.current ||
    (typeof interimResult === "string" ? interimResult : "");

  return (
    <div className="flex flex-col items-center my-4 rounded-xl p-6 bg-white shadow-sm border border-gray-200">
      {/* Webcam / Avatar area */}
      <div className="flex flex-col items-center">
        {isWebcamEnabled ? (
          <Webcam
            audio={false}
            height={260}
            width={260}
            mirrored
            className="rounded-xl shadow-md border border-gray-200 object-cover"
            videoConstraints={{ facingMode: "user" }}
          />
        ) : (
          <div className="flex items-center justify-center rounded-xl shadow-inner bg-gray-100 border border-dashed border-gray-300 h-64 w-64">
            <WebcamIcon size={48} className="text-gray-500" />
          </div>
        )}

        <Button
          onClick={() => setIsWebcamEnabled((prev) => !prev)}
          variant="outline"
          className="mt-3 flex items-center gap-2 text-xs sm:text-sm"
        >
          <WebcamIcon className="w-4 h-4" />
          {isWebcamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </Button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
        <Button
          disabled={loading}
          onClick={handleRecordButton}
          variant={isRecording ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4" />
              Stop & Save
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Recording
            </>
          )}
        </Button>

        {typeof onNextQuestion === "function" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-xs sm:text-sm"
            onClick={() => {
              setAutoSubmitted(false);
              setResults([]);
              lastSpeechTimeRef.current = null;
              accumulatedTranscriptRef.current = "";
              onNextQuestion();
            }}
          >
            <SkipForward className="w-4 h-4" />
            Skip to Next
          </Button>
        )}
      </div>

      {/* 🔧 FIX 6: Show recording status */}
      {isRecording && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          Recording in progress...
        </div>
      )}

      {/* Transcript Preview */}
      {preview && (
        <div className="mt-5 w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs sm:text-sm text-gray-800">
          <div className="font-semibold text-gray-700 mb-1 text-xs">
            Live Transcript
          </div>
          <p className="leading-relaxed">{preview}</p>
          <p className="mt-2 text-[11px] text-gray-500">
            {isRecording 
              ? "Pause for 10 seconds after finishing your answer, and we'll save it automatically and move to the next question."
              : "Your answer has been captured. Click 'Stop & Save' or continue to the next question."}
          </p>
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
