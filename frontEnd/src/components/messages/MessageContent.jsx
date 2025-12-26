import MessageImage from "./MessageImage";

function MessageContent({ text, image }) {
  return (
    <>
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
