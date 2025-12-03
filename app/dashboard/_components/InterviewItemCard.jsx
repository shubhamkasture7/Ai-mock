"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/logo.svg";

export default function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  const onFeedbackClick = () => {
    router.push(`/dashboard/interview/${interview.mockId}/feedback`);
  };

  const formattedDate = interview?.createdAt
    ? new Date(interview?.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  return (
    <div className="flex flex-col border border-gray-200 bg-white rounded-2xl shadow-md p-5 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
          <Image src={logo} alt="logo" width={26} height={26} />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg leading-tight">
            {interview?.jsonPosition || "Not provided"}
          </h2>
          <p className="text-xs text-gray-500">
            {interview?.jsonExperience
              ? `${interview.jsonExperience} years`
              : "Experience not added"}
          </p>
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500">📅 {formattedDate}</p>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
          onClick={onStart}
        >
          Start Interview
        </Button>

        <Button
          size="sm"
          onClick={onFeedbackClick}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Feedback
        </Button>
      </div>
    </div>
  );
}
