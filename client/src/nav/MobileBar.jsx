import React, { useState, useEffect } from "react";
import { Home, Video, CalendarDays, Bell, Calendar, Plus, LucideCircleQuestionMark, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "content", label: "Content", icon: Video, path: "content" },
  { id: "book", label: "Book", icon: CalendarDays, path: "pricing" },
  { id: "FAQ", label: "FAQ", icon: LucideCircleQuestionMark, path: "questions" },
  { id: 'bookings', label: 'Bookings', mobileLabel: 'Bookings', icon: Calendar, path: 'bookings', requiresAdmin: true },
  { id: 'messages', label: 'Messages', mobileLabel: 'Messages', icon: Bell, path: 'messages', requiresAdmin: true },
];

const MobileBar = ({ isAdmin, onLogout }) => {
  const [active, setActive] = useState("home");
  const [unreadCount, setUnreadCount] = useState(0);

  const visibleItems = NAV_ITEMS.filter((item) => !item.requiresAdmin || isAdmin);

  useEffect(() => {
    const updateUnreadCount = () => {
      const count = localStorage.getItem('unreadMessagesCount');
      setUnreadCount(parseInt(count || '0'));
    };
    updateUnreadCount();
    window.addEventListener('unreadMessagesUpdated', updateUnreadCount);
    return () => window.removeEventListener('unreadMessagesUpdated', updateUnreadCount);
  }, []);

  return (
    <>
      {isAdmin && (
        <>
          <div className="relative">
            <Link to="messages" className="md:hidden bg-white/40 shadow-sm backdrop-blur-[1px] w-13 h-13 grid place-items-center rounded-full fixed top-1 right-3">
              <Bell size={30} className="text-slate-800" />
            </Link>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-3 w-3 h-3 bg-emerald-500 rounded-full" />
            )}
          </div>
          <Link to="edit" className="md:hidden bg-[#0080ff] backdrop-blur-[20px] w-15 h-15 grid place-items-center rounded-full fixed bottom-[100px] right-3">
            <Plus size={30} className="text-white" />
          </Link>
        </>
      )}

      {!isAdmin && (
        <div className="fixed bottom-[100px] right-3 md:hidden">
          <Link to="/wanangwahappy" className="bg-black text-white rounded-full p-3 shadow-md flex items-center gap-2">
          </Link>
        </div>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={onLogout}
          className="fixed bottom-[100px] right-3 md:hidden bg-slate-900 text-white rounded-full p-3 shadow-md"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      )}

      <div className="z-111 relative sm:flex md:hidden w-[100vw] bg-white">
        <ul className="flex w-full justify-between list-none p-[0_4px] m-[0] bg-white/50 backdrop-blur-[10px]">
          {visibleItems.map(({ id, label, path, icon: Icon }) => {
            const isActive = active === id;
            const color = isActive ? '#000000' : '#656565';

            return (
              <li key={id} style={{ flex: '1 1 0', minWidth: 0 }}>
                <Link
                  to={path}
                  onClick={() => setActive(id)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 2px 12px',
                    cursor: 'pointer',
                    color,
                    transition: 'color 0.2s ease',
                  }}
                >
                  <Icon size={24} strokeWidth={1.8} color={color} />
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: isActive ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default MobileBar;