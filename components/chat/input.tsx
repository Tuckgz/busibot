"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ChatFooter from "@/components/chat/footer";

interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
}

export default function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px"; // Limit to 5 lines (approx. 150px)
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight; // Auto-scroll to bottom
    }
  }, [input]);

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  return (
    <div
      className="z-10 flex flex-col justify-center items-center fixed bottom-0 w-full p-5 bg-[#D1B29D] shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base transition-all duration-300"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      <div className="max-w-screen-lg w-full">
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className={`flex-0 flex w-full p-1 border rounded-full shadow-sm transition-all duration-300 bg-[#FCF1E0] ${
              isFocused ? "ring-2 ring-[#A8D8A4] ring-offset-2" : "border-[#8B5E3C]"
            }`}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <textarea
                      {...field}
                      ref={textareaRef}
                      onChange={handleInputChange}
                      value={input}
                      className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none overflow-y-auto rounded-l-full rounded-r-full w-full max-h-[150px] leading-6"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Type your message here..."
                      rows={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
              disabled={input.trim() === "" || isLoading}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </form>
        </Form>
      </div>
      <ChatFooter />
    </div>
  );
}
