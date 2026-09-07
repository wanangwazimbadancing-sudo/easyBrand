const PEOPLE = {
  'John Banda': { initials: 'JB', color: 'bg-violet-500' },
  'Mary Phiri': { initials: 'MP', color: 'bg-sky-400' },
  'Peter Mwale': { initials: 'PM', color: 'bg-pink-400' },
  'Tione Lungu': { initials: 'TL', color: 'bg-orange-300' },
  'Alick Kamau': { initials: 'AK', color: 'bg-amber-500' },
};

const colors = [
  'bg-violet-500',
  'bg-sky-400',
  'bg-pink-400',
  'bg-orange-300',
  'bg-amber-500',
  'bg-teal-400',
  'bg-emerald-500',
  'bg-rose-400',
  'bg-indigo-500',
  'bg-cyan-400',
];

const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ name, size = 'w-10 h-10' }) => {
  const p = PEOPLE[name] || { initials: name.slice(0, 2).toUpperCase(), color: getColorFromName(name) };
  return (
    <div className={`${size} ${p.color} rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
      {p.initials}
    </div>
  );
}

export default Avatar;