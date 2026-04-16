
import { useState, useRef, useEffect, useCallback } from "react";

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [duration, setDuration] = useState(0);
    
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: true, noiseSuppression: true } 
            });
            
            streamRef.current = stream;
            
            // Try different mime types for better compatibility
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                mimeType = 'audio/ogg';
            }
            
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current.mimeType });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }, []);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            clearInterval(timerRef.current);
        }
    }, [isRecording, isPaused]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
    }, [isRecording, isPaused]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            clearInterval(timerRef.current);
        }
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            streamRef.current?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsPaused(false);
            clearInterval(timerRef.current);
        }
        setAudioBlob(null);
        setDuration(0);
    }, [isRecording]);

    const getBase64 = useCallback(() => {
        return new Promise((resolve) => {
            const processBlob = (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    let base64 = reader.result;
                    // Clean the base64 - remove codecs info that Cloudinary doesn't support
                    // Convert data:audio/webm;codecs=opus;base64, to data:audio/webm;base64,
                    base64 = base64.replace(/;codecs=[^;,]+/, '');
                    resolve(base64);
                };
            };

            if (!audioBlob && chunksRef.current.length > 0) {
                // Still recording - create blob from chunks
                const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: mimeType });
                processBlob(blob);
            } else if (audioBlob) {
                processBlob(audioBlob);
            } else {
                resolve(null);
            }
        });
    }, [audioBlob]);

    const reset = useCallback(() => {
        setAudioBlob(null);
        setDuration(0);
        chunksRef.current = [];
    }, []);

    return {
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
    };
}
