function MessageFooter({ isEdited, editedAt, createdAt, isDeleted }) {
  if (isDeleted) return null;

  return (
    <div className="mt-2 flex items-center justify-end gap-2">
      {isEdited && (
        <span className="text-[10px] opacity-70 italic flex items-center gap-1">
          edited
          {editedAt && (
            <span>
              · {new Date(editedAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </span>
      )}
      <p className="text-[11px] opacity-80">
        {new Date(createdAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export default MessageFooter;
