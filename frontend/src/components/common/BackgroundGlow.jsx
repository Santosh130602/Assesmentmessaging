import React from 'react';

const BackgroundGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-[#06f988]/6 rounded-full blur-[130px]" />
    <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-[#06f988]/4 rounded-full blur-[130px]" />
    <div className="absolute inset-0 dot-bg bg-dot-md opacity-[0.04]" />
  </div>
);

export default BackgroundGlow;
