import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

function MessageActionsDropdown({ onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleEdit = () => {
        setIsOpen(false);
        onEdit?.();
    };

    const handleDelete = () => {
        setIsOpen(false);
        onDelete?.();
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={handleToggle}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
            >
                <span className="sr-only">Open actions</span>
                <MoreVertical className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-xl bg-slate-900/95 py-1 shadow-xl ring-1 ring-slate-700/60 backdrop-blur">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-slate-100 hover:bg-slate-800/80"
                        >
                            <Edit2 className="h-3 w-3" />
                            Edit
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/15"
                    >
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default MessageActionsDropdown;
