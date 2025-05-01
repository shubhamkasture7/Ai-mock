import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import './QuestionIndex.css';

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
          // Stop recognition if active
          if (window.recognition && window.recognition.running) {
            window.recognition.stop();
          }
      
          const speech = new SpeechSynthesisUtterance(text);
      
          // Resume recognition after TTS ends
          speech.onend = () => {
            if (window.recognition) {
              window.recognition.start();
            }
          };
      
          window.speechSynthesis.speak(speech);
        } else {
          alert('Sorry, your browser doesn’t support text-to-speech.');
        }
      };
      
  return (
    mockInterviewQuestion && (
      <div className='mt-10 my-10 p-5 border rounded-lg'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full'>
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`px-25 custom-padding rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index && 'bg-primary text-white'
              }`}
            >
              Question # {index + 1}
            </h2>
          ))}
        </div>

        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        />

        <div className="border rounded-lg p-5 mt-20 bg-blue-100">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionSection;
