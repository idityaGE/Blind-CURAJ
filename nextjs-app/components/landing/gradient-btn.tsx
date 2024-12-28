'use client';
import React from 'react';
import { MessageSquareDotIcon } from 'lucide-react';
import { Liquid } from '@/components/liquid-gradient/liquid-gradient';

const COLORS = {
  color1: '#FCE205',
  color2: '#FF5733',
  color3: '#C70039',
  color4: '#900C3F',
  color5: '#581845',
  color6: '#FFC300',
  color7: '#DAF7A6',
  color8: '#FF6F61',
  color9: '#FF9F1C',
  color10: '#00B4D8',
  color11: '#6A0572',
  color12: '#EF476F',
  color13: '#FFD166',
  color14: '#06D6A0',
  color15: '#118AB2',
  color16: '#073B4C',
  color17: '#D62828',
};


const GitHubButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center relative w-44 h-[2.7em] mx-auto group dark:bg-black bg-white border-white border-2 rounded-lg hover:scale-110 transform transition-transform duration-300 ease-in-out">
      {/* Blur effect container */}
      <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]" />
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Liquid isHovered={false} colors={COLORS} />
        </div>
      </div>

      {/* Background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128]  filter blur-[7.3px]" />

      {/* Main button content */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-black" />
        <Liquid isHovered={false} colors={COLORS} />
        <span className="absolute inset-0 rounded-lg border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter blur-[4px]" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-lg filter blur-[15px] bg-[#006]" />
      </div>

      {/* Button interaction layer */}
      <button
        className="absolute inset-0 rounded-lg bg-transparent cursor-pointer"
        aria-label="Get Started"
        type="button"
        onClick={onClick}
      >
        <span className="flex items-center justify-between px-4 gap-2 rounded-lg group-hover:text-yellow-400 text-white text-xl font-semibold tracking-wide whitespace-nowrap">
          <MessageSquareDotIcon className="w-6 h-6 flex-shrink-0" />
          <span>CONNECT</span>
        </span>
      </button>
    </div>
  );
};

export default GitHubButton;