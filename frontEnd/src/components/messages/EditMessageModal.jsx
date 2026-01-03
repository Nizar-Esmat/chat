import { useState } from "react";
import { X, Check, Image as ImageIcon } from "lucide-react";

function EditMessageModal({ message, onSave, onCancel }) {
    const [editedText, setEditedText] = useState(message.text || "");
    const [imagePreview, setImagePreview] = useState(message.imageUrl || null);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (editedText.trim() || imagePreview) {
            const updateData = { text: editedText };
            if (imageFile) {
                updateData.imageUrl = imagePreview;
            }
            onSave(updateData);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-100">Edit Message</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {imagePreview && (
                    <div className="relative mb-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    </div>
                )}

                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full bg-slate-700 text-slate-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={4}
                    maxLength={1000}
                    placeholder="Type a message..."
                    autoFocus={!imagePreview}
                />

                <div className="flex items-center justify-between mt-4">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                            <ImageIcon className="h-4 w-4" />
                            {imagePreview ? "Change Image" : "Add Image"}
                        </div>
                    </label>
                    
                    <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                        <button
                            onClick={handleSave}
                            disabled={!editedText.trim() && !imagePreview}
                            className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditMessageModal;
