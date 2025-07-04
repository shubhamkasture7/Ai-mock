import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import './QuestionIndex.css';

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  if (!Array.isArray(mockInterviewQuestion)) {
    return null;
  }

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      if (window.recognition?.running) {
        setTimeout(() => {
          window.recognition.stop();
        }, 0);
      }

      const speech = new SpeechSynthesisUtterance(text);
      speech.onend = () => {
        if (window.recognition) {
          setTimeout(() => {
            window.recognition.start();
          }, 0);
        }
      };
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser doesn’t support text-to-speech.');
    }
  };

  return (
    <div className="mt-10 p-6 border rounded-xl bg-white shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mockInterviewQuestion.map((question, index) => (
          <div
            key={index}
            className={`py-2 px-4 rounded-lg text-sm font-medium text-center shadow transition duration-200 transform hover:scale-105 cursor-pointer ${
              activeQuestionIndex === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Question # {index + 1}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-5 mt-12 rounded-lg shadow-sm">
        <h2 className="flex items-center gap-2 text-yellow-700 font-semibold text-md mb-2">
          <Lightbulb />
          Tip
        </h2>
        <p className="text-sm text-yellow-800">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            'Think clearly and answer with confidence.'}
        </p>
      </div>
    </div>
  );
}

export default QuestionSection;
