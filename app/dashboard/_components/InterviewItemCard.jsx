"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import { useState } from "react";

export default function InterviewItemCard({ interview }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  const formattedDate = interview?.createdAt
    ? new Date(interview.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  const handleCardClick = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      className="group cursor-pointer flex flex-col justify-between
      border border-gray-200 bg-white rounded-2xl shadow-sm p-5 h-[180px]
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300
      focus:ring-2 ring-indigo-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={24}
            height={24}
            className={`transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-900 text-sm leading-tight 
          group-hover:text-indigo-600 transition-colors">
            {interview?.jsonPosition || "Role not specified"}
          </h2>
          <p className="text-xs text-gray-500">
            {interview?.jsonExperience
              ? `${interview.jsonExperience} yrs exp`
              : "Experience missing"}
          </p>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 mt-3">📅 {formattedDate}</p>

      {/* Action Buttons */}
      <div
        className="flex gap-3 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}`)
          }
        >
          Start
        </Button>

        <Button
          size="sm"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
          }
        >
          Feedback
        </Button>
      </div>
    </div>
  );
}
