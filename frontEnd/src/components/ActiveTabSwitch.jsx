import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-2 p-3 bg-slate-800/30 mx-2 rounded-lg">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
          activeTab === "chats" 
            ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10" 
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
          activeTab === "contacts" 
            ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10" 
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
