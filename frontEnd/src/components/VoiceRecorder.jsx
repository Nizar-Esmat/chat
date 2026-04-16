import { useEffect } from "react";
import { Mic, Send, Trash2, Pause, Play } from "lucide-react";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

function VoiceRecorder({ onSend, disabled, onStateChange }) {
    const {
        isRecording,
        isPaused,
        audioBlob,
        duration,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        cancelRecording,
        getBase64,
        reset
    } = useVoiceRecorder();

    // Notify parent of state changes
    useEffect(() => {
        onStateChange?.(isRecording || !!audioBlob);
    }, [isRecording, audioBlob, onStateChange]);

    const handleSend = async () => {
        // If still recording, stop first
        if (isRecording) {
            stopRecording();
            // Small delay to let the blob be created
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const base64Audio = await getBase64();
        if (base64Audio) {
            onSend({ voiceUrl: base64Audio, voiceDuration: duration });
            reset();
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Waveform component
    const Waveform = ({ animated = false }) => (
        <div className="flex gap-[2px] items-center flex-1 justify-evenly h-6">
            {Array.from({ length: 40 }).map((_, i) => (
                <div
                    key={i}
                    className={`w-1 bg-cyan-500 rounded-full flex-1 max-w-1 transition-all ${animated && !isPaused ? 'animate-pulse' : ''}`}
                    style={{
                        height: animated && !isPaused ? `${Math.random() * 20 + 6}px` : '8px',
                        animationDelay: `${i * 50}ms`,
                        opacity: 0.5 + Math.random() * 0.5
                    }}
                />
            ))}
        </div>
    );

    // Show UI when recording or has preview
    if (isRecording || audioBlob) {
        return (
            <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2 flex-1">
                {/* Cancel button */}
                <button
                    onClick={cancelRecording}
                    className="btn btn-circle btn-xs btn-error"
                    type="button"
                >
                    <Trash2 size={14} />
                </button>

                {/* Recording indicator (only while recording) */}
                {isRecording && (
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                )}

                {/* Waveform */}
                <div className="flex items-center gap-2 flex-1">
                    <Waveform animated={isRecording} />
                    <span className="text-xs text-slate-300 ml-2 min-w-[40px] shrink-0">
                        {formatDuration(duration)}
                    </span>
                </div>

                {/* Pause/Resume button (only while recording) */}
                {isRecording && (
                    <button
                        onClick={isPaused ? resumeRecording : pauseRecording}
                        className="btn btn-circle btn-sm btn-warning"
                        type="button"
                    >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    </button>
                )}

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled}
                    className="btn btn-circle btn-sm btn-primary"
                    type="button"
                >
                    <Send size={16} />
                </button>
            </div>
        );
    }

    // Default: Start recording button
    return (
        <button
            onClick={startRecording}
            className="bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 py-2 transition-all"
            type="button"
            title="Click to record"
        >
            <Mic size={20} />
        </button>
    );
}

export default VoiceRecorder;
