"use client";

import { Button } from "@/components/ui/button";
import { EraserIcon } from "lucide-react";
import Image from "next/image";
import { CHAT_HEADER, CLEAR_BUTTON_TEXT } from "@/configuration/ui";
import { AI_NAME } from "@/configuration/identity";

export const AILogo = () => (
  <div className="w-12 h-12 relative">
    <Image src="/ai-logo.png" alt={AI_NAME} width={48} height={48} />
    {/* Accent dot in light forest green */}
    <div
      className="w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5"
      style={{ backgroundColor: "#8BC493" }} // Light forest green
    ></div>
  </div>
);

export default function ChatHeader({
  clearMessages,
}: {
  clearMessages: () => void;
}) {
  return (
    <div
      className="z-10 flex justify-center items-center fixed top-0 w-full p-5 shadow-[0_10px_15px_-3px_rgba(30,30,20,0.4)]"
      style={{
        backgroundColor: "hsl(30, 40%, 20%)", // Dark brown
        color: "hsl(30, 60%, 80%)", // Light brown text
      }}
    >
      <div className="flex w-full">
        <div className="flex-0 w-[100px]"></div>
        <div className="flex-1 flex justify-center items-center gap-2">
          <AILogo />
          <p>{CHAT_HEADER}</p>
        </div>
        <div className="flex-0 w-[100px] flex justify-end items-center">
          <Button
            onClick={clearMessages}
            className="gap-2 shadow-sm"
            variant="outline"
            size="sm"
            style={{
              color: "hsl(30, 40%, 20%)", // Dark brown text
              borderColor: "hsl(30, 40%, 30%)", // Slightly lighter brown border for better visibility
            }}
          >
            <EraserIcon className="w-4 h-4" />
            <span>{CLEAR_BUTTON_TEXT}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
