import { useRef, useEffect, useState } from "react";
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
    <div
      className="w-9 h-9 flex items-center justify-center rounded-full border-2"
      style={{ borderColor: "#8BC493" }} // Light forest green border
    >
      <Image src="/ai-logo.png" alt={AI_NAME} width={36} height={36} />
    </div>
  );
}

type CopyButtonProps = {
  text: string;
  onCopy: () => void;
  baseBackground: string;
  hoverBackground: string;
  textColor: string;
  alignRight?: boolean;
};

function CopyButton({
  text,
  onCopy,
  baseBackground,
  hoverBackground,
  textColor,
  alignRight = false,
}: CopyButtonProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy();
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`absolute bottom-1 ${alignRight ? "right-1" : "left-1"} p-1 rounded transition-colors duration-200`}
      style={{ backgroundColor: baseBackground, color: textColor }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = hoverBackground)
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = baseBackground)
      }
    >
      <Clipboard size={16} />
    </button>
  );
}

function UserMessage({ message }: { message: DisplayMessage }) {
  const [flash, setFlash] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const triggerFlash = () => {
    setFlash(true);
    setShowOverlay(true);
    setTimeout(() => setFlash(false), 50);
    setTimeout(() => setShowOverlay(false), 1000);
  };

  const normalBg = "#FCFCB8";
  const flashBg = "#FFFFD1";
  const normalText = "hsl(30, 50%, 30%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 py-1 justify-end"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative pl-10 pr-3 py-1 rounded-2xl max-w-[60%] shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ backgroundColor: flash ? flashBg : normalBg, color: normalText }}
      >
        {message.content}
        <CopyButton
          text={message.content}
          onCopy={triggerFlash}
          baseBackground={normalBg}
          hoverBackground={"#E0E08C"}
          textColor={normalText}
          alignRight={false} // Keep on the left
        />
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span style={{ fontSize: "1rem", fontWeight: "normal", color: "hsl(30, 50%, 50%)" }}>
              Copied to Clipboard
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function AssistantMessage({ message }: { message: DisplayMessage }) {
  const [flash, setFlash] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const triggerFlash = () => {
    setFlash(true);
    setShowOverlay(true);
    setTimeout(() => setFlash(false), 50);
    setTimeout(() => setShowOverlay(false), 1000);
  };

  const normalBg = "#fcf1e0"; // Soft pastel yellow
  const flashBg = "#fffce8"; // Lighter flash color
  const normalText = "hsl(30, 50%, 30%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 py-1 justify-start gap-[5px]"
    >
      <div className="w-9 flex items-end">{<AILogo />}</div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative pl-10 pr-3 py-1 rounded-2xl max-w-[60%] shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ backgroundColor: flash ? flashBg : normalBg, color: normalText }}
      >
        <Formatting message={message} />
        <CopyButton
          text={message.content}
          onCopy={triggerFlash}
          baseBackground={normalBg}
          hoverBackground={"#e0d9c0"}
          textColor={normalText}
          alignRight={true} // Move to the right
        />
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span style={{ fontSize: "1rem", fontWeight: "normal", color: "hsl(30, 50%, 50%)" }}>
              Copied to Clipboard
            </span>
          </motion.div>
        )}
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

export default function ChatMessages({
  messages,
  indicatorState,
}: {
  messages: DisplayMessage[];
  indicatorState: LoadingIndicator[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      hasMounted.current = true;
    }
  }, [messages, indicatorState]);

  const showLoading =
    indicatorState.length > 0 &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 p-1 gap-3"
    >
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
