import { useRef, useEffect } from "react";
import { DisplayMessage } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { Formatting } from "./formatting";
import { LoadingIndicator } from "@/types";
import Loading from "./loading";
import { AI_NAME } from "@/configuration/identity";
import { Clipboard } from "lucide-react";

function AILogo() {
  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-full border-2" style={{ borderColor: "#8BC493" }}>
      <Image src="/ai-logo.png" alt={AI_NAME} width={36} height={36} />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button onClick={copyToClipboard} className="ml-2 p-1 text-gray-500 hover:text-gray-700">
      <Clipboard size={16} />
    </button>
  );
}

function UserMessage({ message }: { message: DisplayMessage }) {
  return (
    <motion.div className="flex flex-1 py-1 justify-end">
      <motion.div className="px-3 py-1 rounded-2xl max-w-[60%] shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center" style={{ backgroundColor: "#FCFCB8", color: "hsl(30, 50%, 30%)" }}>
        {message.content}
        <CopyButton text={message.content} />
      </motion.div>
    </motion.div>
  );
}

function AssistantMessage({ message }: { message: DisplayMessage }) {
  return (
    <motion.div className="flex flex-1 py-1 justify-start gap-[5px]">
      <div className="w-9 flex items-end">{<AILogo />}</div>
      <motion.div className="px-3 py-1 rounded-2xl max-w-[60%] shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center" style={{ backgroundColor: "#fcf1e0", color: "hsl(30, 50%, 30%)" }}>
        <Formatting message={message} />
        <CopyButton text={message.content} />
      </motion.div>
    </motion.div>
  );
}

function EmptyMessages() {
  return (
    <div className="flex flex-col flex-1 p-1 gap-3 justify-center items-center">
      <p className="text-[#47331f]">Ask a question to start the conversation</p>
    </div>
  );
}

export default function ChatMessages({ messages, indicatorState }: { messages: DisplayMessage[]; indicatorState: LoadingIndicator[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      hasMounted.current = true;
    }
  }, [messages, indicatorState]);

  const showLoading = indicatorState.length > 0 && messages.length > 0 && messages[messages.length - 1].role === "user";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col flex-1 p-1 gap-3">
      <div className="h-[60px]"></div>
      {messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        messages.map((message, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            {message.role === "user" ? <UserMessage message={message} /> : <AssistantMessage message={message} />}
          </motion.div>
        ))
      )}
      {showLoading && <Loading indicatorState={indicatorState} />}
      <div ref={bottomRef} className="h-[225px]"></div>
    </motion.div>
  );
}
