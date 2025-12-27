import { useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

function MessageImage({ src, alt = "Shared" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenModal = isFullscreen && createPortal(
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-[9999] bg-black/80 flex items-center justify-center backdrop-blur-sm"
      onClick={() => setIsFullscreen(false)}
      style={{ position: 'fixed', inset: 0 }}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="rounded-xl h-48 w-full object-cover mb-2 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsFullscreen(true)}
      />
      {fullscreenModal}
    </>
  );
}

export default MessageImage;
