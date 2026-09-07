import React from 'react'

const Field = ({ label, extra, children }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-500 block">{label}</label>
        {extra}
      </div>
      {children}
    </div>
  );
}

export default Field;


