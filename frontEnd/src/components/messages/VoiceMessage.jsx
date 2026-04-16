import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

function VoiceMessage({ voiceUrl, duration, isOwnMessage }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(duration || 0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener("loadedmetadata", () => {
                if (audio.duration && isFinite(audio.duration)) {
                    setAudioDuration(audio.duration);
                }
            });
        }
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * audioDuration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="flex items-center gap-3 min-w-[180px] max-w-[220px]">
            <audio
                ref={audioRef}
                src={voiceUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className={`btn btn-circle btn-sm ${
                    isOwnMessage 
                        ? "bg-white/20 hover:bg-white/30 border-white/30" 
                        : "btn-primary"
                }`}
            >
                {isPlaying ? (
                    <Pause size={16} className={isOwnMessage ? "text-white" : ""} />
                ) : (
                    <Play size={16} className={`${isOwnMessage ? "text-white" : ""} ml-0.5`} />
                )}
            </button>

            {/* Progress Bar & Duration */}
            <div className="flex-1">
                {/* Waveform-style progress bar */}
                <div
                    onClick={handleSeek}
                    className="relative w-full h-8 cursor-pointer flex items-center gap-[2px]"
                >
                    {/* Waveform bars */}
                    {Array.from({ length: 20 }).map((_, i) => {
                        const barProgress = (i / 20) * 100;
                        const isActive = barProgress <= progress;
                        const heights = [40, 70, 50, 90, 60, 80, 45, 95, 55, 75, 65, 85, 50, 70, 60, 80, 45, 90, 55, 70];
                        return (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                    isActive
                                        ? isOwnMessage
                                            ? "bg-white"
                                            : "bg-primary"
                                        : isOwnMessage
                                            ? "bg-white/30"
                                            : "bg-base-300"
                                }`}
                                style={{ height: `${heights[i]}%` }}
                            />
                        );
                    })}
                </div>

                {/* Time display */}
                <div className={`text-xs mt-0.5 ${isOwnMessage ? "text-white/70" : "opacity-70"}`}>
                    {formatTime(currentTime)} / {formatTime(audioDuration)}
                </div>
            </div>
        </div>
    );
}

export default VoiceMessage;
