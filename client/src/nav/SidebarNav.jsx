import {Calendar,Plus,Home,Video,PanelLeft,CalendarDays,CircleQuestionMarkIcon, Bell,Contact,LogOut,} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import img from ".././assets/logo.png";
import { Link } from "react-router-dom";

const PLATFORM_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'content', label: 'Content', icon: Video, path: 'content' },
  { id: 'book', label: 'Book', icon: CalendarDays, path: 'pricing' },
  { id: 'FAQ', label: 'FAQ', icon: CircleQuestionMarkIcon, path: 'questions' },
  { id: 'edit', label: 'Edit Content', icon: Plus, path: 'edit', requiresAdmin: true },
  { id: 'bookings', label: 'Bookings', mobileLabel: 'Bookings', icon: Calendar, path: 'bookings', requiresAdmin: true },
  { id: 'messages', label: 'Messages', mobileLabel: 'Messages', icon: Bell, path: 'messages', requiresAdmin: true },
];

const SideBar = ({ isAdmin, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('home');
  const [unreadCount, setUnreadCount] = useState(0);

  const visibleItems = PLATFORM_ITEMS.filter((item) => !item.requiresAdmin || isAdmin);

  useEffect(() => {
    const updateUnreadCount = () => {
      const count = localStorage.getItem('unreadMessagesCount');
      setUnreadCount(parseInt(count || '0'));
    };
    updateUnreadCount();
    window.addEventListener('unreadMessagesUpdated', updateUnreadCount);
    return () => window.removeEventListener('unreadMessagesUpdated', updateUnreadCount);
  }, []);

  const NavRow = ({ item }) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    const activeClasses = 'bg-slate-100 text-black';
    const inactiveClasses = 'text-slate-600 hover:bg-slate-50';

    return (
      <Link
        to={item.path}
        title={collapsed ? item.label : undefined}
        onClick={() => setActive(item.id)}
        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-sm ${
          collapsed ? 'justify-center' : ''
        } ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && (item.badge || (item.id === 'messages' && unreadCount > 0)) && (
          <span className={`ml-auto text-[11px] font-sm px-1.5 py-0.5 rounded-full ${
            isActive ? 'bg-violet-500 text-white' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {item.id === 'messages' ? unreadCount : item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      id="sidebar"
      className={`z-111 relative hidden md:flex bg-white border-slate-200 border flex-col justify-between transition-all duration-300 ease-in-out h-[100dvh] overflow-y-auto ${
        collapsed ? 'w-15' : 'w-52'
      }`}
    >
      <div className="px-3 pt-5">
        <div className={`flex items-center px-2 mb-5 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <img src={img} alt="Logo" className="w-8 h-8 shrink-0" />
              <Link to="/" className="cursor-pointer font-semibold truncate text-slate-900">Happy Zimba Brands</Link>
            </div>
          )}
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((c) => !c)}
            className="w-8 h-8 flex items-center justify-center text-slate-400"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavRow key={item.id} item={item} />
          ))}
        </nav>
      </div>

      <div className="p-3">
        <div className="h-px mb-3 bg-slate-100" />
        {isAdmin && (
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Logout'}
          </button>
        ) }

        <Link to="contact" className="mt-3 block">
          <div className={`flex items-center gap-2.5 rounded-2xl border p-2.5 border-slate-100 ${collapsed ? 'justify-center border-transparent' : ''}`}>
            <Contact size={20} className="text-slate-700 shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-slate-900">Contact</p>
                <p className="text-xs truncate text-slate-400">Happyzimba@gmail.com</p>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default SideBar;