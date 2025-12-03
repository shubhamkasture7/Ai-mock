// components/ShadowLoader.js
export default function ShadowLoader() {
  return (
    <div
      className="border border-gray-200 bg-white rounded-2xl shadow-sm p-5 h-[180px]
                 flex flex-col justify-between animate-pulse"
    >
      {/* Top Avatar + Text */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-2 w-20 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Date */}
      <div className="mt-3 h-2 w-24 bg-gray-200 rounded" />

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <div className="h-9 w-1/2 bg-gray-200 rounded-lg" />
        <div className="h-9 w-1/2 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
