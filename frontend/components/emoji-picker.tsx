"use client";

import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { EmojiClickData } from 'emoji-picker-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EmojiPickerComponent = ({ onChange, disabled }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  if (disabled) {
    return <Smile className="text-zinc-300 dark:text-zinc-600" />;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker
          theme={resolvedTheme as Theme}
          onEmojiClick={(emojiData: EmojiClickData) => onChange(emojiData.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};