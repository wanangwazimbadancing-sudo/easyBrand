import { Crown, Rocket, TrendingUp } from "lucide-react";

export const MESSAGES = [
  {
    id: 1, name: 'John Banda', email: 'johnbanda@email.com', time: '10:30 AM', date: 'May 20, 2024 · 10:30 AM',
    preview: 'I would like more information about your Growth plan.', unread: true,
    body: "Hello Happy Zimba team,\n\nI would like more information about your Growth plan and how it can help my brand grow on TikTok.\n\nLooking forward to hearing from you.\n\nBest regards,\nJohn",
  },
  {
    id: 2, name: 'Mary Phiri', email: 'maryphiri@email.com', time: 'Yesterday', date: 'May 19, 2024 · 4:12 PM',
    preview: "Hi, I'm interested in your Elite plan. Please get back to me.", unread: true,
    body: "Hi there,\n\nI'm interested in your Elite plan. Could you send over more details on pricing and what's included?\n\nPlease get back to me when you can.\n\nThanks,\nMary",
  },
  {
    id: 3, name: 'Peter Mwale', email: 'petermwale@email.com', time: 'May 18', date: 'May 18, 2024 · 9:05 AM',
    preview: 'Do you offer content creation services as well?', unread: false,
    body: "Hello,\n\nDo you offer content creation services as well, or is it purely strategy and management?\n\nThanks,\nPeter",
  },
  {
    id: 4, name: 'Tione Lungu', email: 'tionelungu@email.com', time: 'May 18', date: 'May 18, 2024 · 8:47 AM',
    preview: 'I have a question regarding bookings.', unread: false, 
    body: "Hi,\n\nI have a question regarding bookings — can I reschedule after I've confirmed a slot?\n\nBest,\nTione",
  },
  {
    id: 5, name: 'Alick Kamau', email: 'alickkamau@email.com', time: 'May 17', date: 'May 17, 2024 · 6:30 PM',
    preview: 'Looking forward to hearing back.', unread: false, 
    body: "Hello team,\n\nJust following up on my earlier note. Looking forward to hearing back.\n\nAlick",
  },
];

export const BOOKINGS = [
  { id: 1, name: 'John Banda', email: 'johnbanda@email.com', plan: 'Growth Plan', icon: TrendingUp, billing: 'Monthly', price: '$59',  date: 'May 20, 2024' },
  { id: 2, name: 'Mary Phiri', email: 'maryphiri@email.com', plan: 'Elite Plan', icon: Crown, billing: 'Yearly', price: '$990',  date: 'May 19, 2024' },
  { id: 3, name: 'Peter Mwale', email: 'petermwale@email.com', plan: 'Starter Plan', icon: Rocket, billing: 'Monthly', price: '$29',  date: 'May 19, 2024' },
  { id: 4, name: 'Tione Lungu', email: 'tionelungu@email.com', plan: 'Growth Plan', icon: TrendingUp, billing: 'Yearly', price: '$590',  date: 'May 18, 2024' },
  { id: 5, name: 'Alick Kamau', email: 'alickkamau@email.com', plan: 'Elite Plan', icon: Crown, billing: 'Monthly', price: '$99',  date: 'May 17, 2024' },
];

export const INITIAL_PLANS = [
  {
    id: 'starter', name: 'Starter Plan', tagline: 'Find your footing', icon: Rocket, iconBg: 'bg-sky-100', iconColor: 'text-sky-500',
    monthly: '29', yearly: '290', save: '17%',
    description: 'Perfect for beginners who want to establish their presence and access essential resources.',
    features: ['Access to core resources', 'Community support', 'Email updates'],
  },
  {
    id: 'growth', name: 'Growth Plan', tagline: 'Build real momentum', icon: TrendingUp, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500',
    monthly: '59', yearly: '590', save: '17%',
    description: 'For creators ready to grow their audience with hands-on strategy and regular check-ins.',
    features: ['Everything in Starter', 'Monthly strategy calls', 'Priority email support', 'Growth analytics'],
  },
  {
    id: 'elite', name: 'Elite Plan', tagline: 'Go all in', icon: Crown, iconBg: 'bg-amber-100', iconColor: 'text-amber-500',
    monthly: '99', yearly: '990', save: '17%',
    description: 'Full-service partnership for brands who want a dedicated team behind every post.',
    features: ['Everything in Growth', 'Dedicated account manager', 'Content creation services', 'Weekly reporting'],
  },
];



export const INITIAL_VIDEOS = [
  { id: 1, title: 'Client Success Story: John Banda', url: 'https://tiktok.com/@happyzimba/video/7281234567' },
  { id: 2, title: 'Behind the Scenes: Content Shoot', url: 'https://youtube.com/watch?v=abc123' },
  { id: 3, title: 'How We Grow Your Brand on TikTok', url: 'https://tiktok.com/@happyzimba/video/7281234999' },
];


export const INITIAL_CONTACT = {
  email: 'hello@happyzimba.com',
  phone: '+265 991 234 567',
  whatsapp: '+265 991 234 567',
  address: 'Area 3, Lilongwe, Malawi',
  instagram: 'instagram.com/happyzimba',
  facebook: 'facebook.com/happyzimba',
  twitter: 'x.com/happyzimba',
};

export const INITIAL_FAQS = [
  { id: 1, question: 'How quickly can I expect a reply?', answer: 'We usually respond within 24 hours on business days.' },
  { id: 2, question: 'Can I switch plans later?', answer: 'Yes, you can upgrade or downgrade at any time from your account.' },
  { id: 3, question: 'Do you offer refunds?', answer: 'We offer a 7-day refund window on new subscriptions.' },
];

export   const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm caret-transparent focus:outline-none focus:ring-2 focus:ring-violet-200';
