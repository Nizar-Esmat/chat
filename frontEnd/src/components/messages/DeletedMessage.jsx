import { Trash2 } from "lucide-react";

function DeletedMessage({ isOwnMessage, deletedAt }) {
  return (
    <div className="flex items-center gap-2 text-sm italic opacity-75">
      <Trash2 className="h-4 w-4" />
      <span>This message was deleted</span>
      {deletedAt && (
        <span className="text-xs">
          · {new Date(deletedAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}

export default DeletedMessage;
