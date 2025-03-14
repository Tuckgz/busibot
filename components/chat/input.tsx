"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  const form = useForm({
    defaultValues: { message: "" },
  });

  const handleEnterPress = () => {
    const formElement = document.getElementById("chat-form") as HTMLFormElement;
    if (formElement) formElement.requestSubmit(); // Manually trigger form submission
  };

  return (
    <>
      <div
        className="z-10 flex flex-col justify-center items-center fixed bottom-0 w-full p-5 bg-[#D1B29D] shadow-[0_-10px_15px_-2px_rgba(255,255,255,1)] text-base transition-all duration-300"
        style={{ animation: "fadeIn 0.5s ease-out" }}
      >
        <div className="max-w-screen-lg w-full">
          <Form {...form}>
            <form
              id="chat-form"
              onSubmit={(e) => {
                handleSubmit(e);
                const textarea = document.querySelector("textarea");
                if (textarea) textarea.style.height = "40px"; // Reset height after submission
              }}
              className={`flex-0 flex w-full p-1 border rounded-lg shadow-sm transition-all duration-300 ${
                isFocused ? "ring-2 ring-[#A8D8A4] ring-offset-2" : "border-[#8B5E3C]"
              }`}
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleInputChange}
                        value={input}
                        onEnterPress={handleEnterPress} // Custom handler for Enter key
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#FCF1E0] rounded-lg"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type your message here..."
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
    </>
  );
}
