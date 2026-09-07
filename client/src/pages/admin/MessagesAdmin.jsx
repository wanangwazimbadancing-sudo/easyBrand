
import { useRef, useState,useEffect } from "react";
import { Reply,ArrowLeft, Bell} from "lucide-react";
import { MESSAGES } from "../../assets/mockdata";
import Avatar from "../../assets/avators";

import axios from "axios";

const MessagesPage = () => {
  const [selectedId, setSelectedId] = useState("");
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat' — only matters when narrow
  const [isWide, setIsWide] = useState(true);
  const containerRef = useRef(null);

  // Measure the panel's own width rather than the browser viewport, so the
  // side-by-side layout kicks in whenever there's actually room for it —
  // even if this dashboard is embedded in a narrower wrapper.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setIsWide(el.offsetWidth >= 1280);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

//----------------- FETCHING MESSAGES -----------------------

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await axios.get("https://easybrand.onrender.com/api/contact", {
        withCredentials: true,
      });

      setMessages(response.data.messages);
    } catch (error) {
      console.error(error);

      setError("Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Track unread count in localStorage
  useEffect(() => {
    const unreadCount = messages.filter((m) => m.unread).length;
    localStorage.setItem('unreadMessagesCount', unreadCount.toString());
    window.dispatchEvent(new Event('unreadMessagesUpdated'));
  }, [messages]);

  if (loading) {
    return  <div class="flex items-center justify-center h-screen">
  <div class="w-7 h-7 border-[2.5px] border-black/10 border-t-black/60 rounded-full animate-spin"></div>
</div>
  }

  if (error) {
    return <div class="flex items-center justify-center h-screen">{error}</div>;
  }

  // Helper function to format date as "Today", "Yesterday", or date
  const formatDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateLabel = formatDateLabel(msg.createdAt);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(msg);
    return acc;
  }, {});

  // Sort date groups (Today first, then Yesterday, then older dates)
  const dateOrder = ["Today", "Yesterday"];
  const sortedDateGroups = Object.keys(groupedMessages).sort((a, b) => {
    const aIndex = dateOrder.indexOf(a);
    const bIndex = dateOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return new Date(b) - new Date(a);
  });

  const selected = messages.find((m) => m._id === selectedId);
  const showList = isWide || mobileView === 'list';
  const showChat = isWide || mobileView === 'chat';

  const openChat = (id) => {
    setSelectedId(id);
    setMobileView('chat');
    setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, unread: false } : m)));
  };

  const backToList = () => setMobileView('list');

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-8">
      <div className={`${!isWide && mobileView === 'chat' ? 'hidden' : 'block'} mb-6`}>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all messages from your website.</p>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${isWide ? 'grid-cols-5' : ''}`}>
        {/* Conversation list */}
        <div
          className={`${showList ? 'flex' : 'hidden'} ${isWide ? 'col-span-2' : ''} flex-col bg-white rounded-xl border border-gray-100 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-hidden`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <p className="text-sm font-semibold text-gray-900">All Messages ({messages.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
      {messages.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No messages yet.</p>
      ) : (
        sortedDateGroups.map((dateLabel) => (
          <div key={dateLabel}>
            {/* Date separator */}
            <div className="flex items-center justify-center py-3 px-5">
              <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {dateLabel}
              </div>
            </div>
            {/* Messages for this date */}
            {groupedMessages[dateLabel].map((m) => (
              <button
                key={m._id}
                onClick={() => openChat(m._id)}
                className={`w-full text-left flex items-start gap-3 px-5 py-3.5 transition-colors ${
                  selectedId === m._id ? 'bg-violet-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <Avatar name={m.name} size="w-9 h-9" />
                  {m.unread && (
                    <Bell className="absolute -top-1 -right-1 w-4 h-4 text-orange-500 fill-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-2">
                      {new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.message}</p>
                </div>
              </button>
            ))}
          </div>
        ))
      )}
          </div>
        </div>

        {/* Chat view */}
        <div
          className={`${showChat ? 'flex' : 'hidden'} ${isWide ? 'col-span-3' : ''} flex-col bg-white rounded-xl border border-gray-100 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-hidden`}
        >
         
         
         
         
          {selected && (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 shrink-0">
                <button
                  onClick={backToList}
                  className={`${isWide ? 'hidden' : ''} -ml-1 p-1 text-gray-500 hover:text-gray-800 shrink-0`}
                  title="Back to messages"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={selected.name} size="w-9 h-9" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selected.name}</p>
                  <p className="text-xs text-gray-400 truncate">{selected.email}</p>
                </div>

              </div>

              {/* Chat body */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 bg-gray-50">
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[75%] bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{selected.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {(() => {
                        const msgDate = new Date(selected.createdAt);
                        const currentYear = new Date().getFullYear();
                        const msgYear = msgDate.getFullYear();
                        
                        return msgYear !== currentYear 
                          ? msgDate.toLocaleString("en-US", { 
                              month: "short", 
                              day: "numeric", 
                              year: "numeric",
                              hour: "2-digit", 
                              minute: "2-digit"
                            })
                          : msgDate.toLocaleString("en-US", { 
                              month: "short", 
                              day: "numeric", 
                              hour: "2-digit", 
                              minute: "2-digit"
                            });
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reply */}
              <div className="px-4 sm:px-5 py-3 border-t border-gray-100 shrink-0">
                <a        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}`} className="flex items-center justify-center text-gray-700 gap-2  rounded-lg w-30 h-10" title="Reply">
                  <Reply className="w-6 " />
                  <p className='text-[12px] '>reply</p>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default MessagesPage;