import MessageImage from "./MessageImage";
import VoiceMessage from "./VoiceMessage";

function MessageContent({ text, image, voiceUrl, voiceDuration, isOwnMessage }) {
  return (
    <>
      {voiceUrl && (
        <VoiceMessage 
          voiceUrl={voiceUrl} 
          duration={voiceDuration} 
          isOwnMessage={isOwnMessage}
        />
      )}
      {image && <MessageImage src={image} />}
      {text && (
        <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {text}
        </p>
      )}
    </>
  );
}

export default MessageContent;
