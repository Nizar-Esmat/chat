import { useState } from "react";
import { X } from "lucide-react";

function MessageImage({ src, alt = "Shared" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="rounded-xl h-48 w-full object-cover mb-2 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsFullscreen(true)}
      />

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default MessageImage;
