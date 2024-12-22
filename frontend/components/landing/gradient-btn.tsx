'use client';
import React from 'react';
import { MessageSquareDotIcon } from 'lucide-react';
import { Liquid } from '@/components/liquid-gradient/liquid-gradient';

const COLORS = {
  color1: '#E3F2FD',
  color2: '#BBDEFB',
  color3: '#90CAF9',
  color4: '#64B5F6',
  color5: '#42A5F5',
  color6: '#2196F3',
  color7: '#1E88E5',
  color8: '#1976D2',
  color9: '#1565C0',
  color10: '#0D47A1',
  color11: '#82B1FF',
  color12: '#448AFF',
  color13: '#2979FF',
  color14: '#2962FF',
  color15: '#0039CB',
  color16: '#002FA7',
  color17: '#001F8C',
};

const GitHubButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center relative w-44 h-[2.7em] mx-auto group dark:bg-black bg-white dark:border-white border-black border-2 rounded-lg">
      {/* Blur effect container */}
      <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
        <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]" />
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Liquid isHovered={false} colors={COLORS} />
        </div>
      </div>

      {/* Background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128] filter blur-[7.3px]" />

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