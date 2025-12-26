import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageActionsDropdown from "./MessageActionsDropdown";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  console.log("messages" , messages)

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isOwnMessage = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
                      isOwnMessage
                        ? "bg-linear-to-r from-cyan-500 to-sky-500 text-white border-cyan-300/40"
                        : "bg-slate-800/90 text-slate-100 border-slate-600/40"
                    }`}
                  >
                    {isOwnMessage && (
                      <div className="absolute -top-3 -right-3">
                        <MessageActionsDropdown
                          onEdit={() => console.log("Edit message", msg._id)}
                          onDelete={() => console.log("Delete message", msg._id)}
                        />
                      </div>
                    )}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-xl h-48 w-full object-cover mb-2"
                      />
                    )}
                    {msg.text && (
                      <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {msg.text}
                      </p>
                    )}
                    <p className="mt-2 text-[11px] opacity-80 flex justify-end">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })} 
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
