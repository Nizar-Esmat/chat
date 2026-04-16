import MessageActionsDropdown from "./MessageActionsDropdown";
import DeletedMessage from "./DeletedMessage";
import MessageContent from "./MessageContent";
import MessageFooter from "./MessageFooter";

function MessageBubble({ message, isOwnMessage, onEdit, onDelete }) {
    const isVoiceMessage = !!message.voiceUrl;
    
    const bubbleStyles = `relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        isOwnMessage
            ? "bg-linear-to-r from-cyan-500 to-sky-500 text-white border-cyan-300/40"
            : "bg-slate-800/90 text-slate-100 border-slate-600/40"
        } ${message.isDeleted ? "opacity-60" : ""}`;

    return (
        <div className={bubbleStyles}>
            {isOwnMessage && !message.isDeleted && (
                <div className="absolute -top-3 -right-3">
                    <MessageActionsDropdown 
                        onEdit={isVoiceMessage ? null : onEdit} 
                        onDelete={onDelete} 
                    />
                </div>
            )}

            {message.isDeleted ? (
                <DeletedMessage
                    isOwnMessage={isOwnMessage}
                    deletedAt={message.deletedAt}
                />
            ) : (
                <>
                    <MessageContent 
                        text={message.text} 
                        image={message.imageUrl} 
                        voiceUrl={message.voiceUrl}
                        voiceDuration={message.voiceDuration}
                        isOwnMessage={isOwnMessage}
                    />
                    <MessageFooter
                        isEdited={message.isEdited}
                        editedAt={message.editedAt}
                        createdAt={message.createdAt}
                        isDeleted={message.isDeleted}
                    />
                </>
            )}
        </div>
    );
}

export default MessageBubble;
