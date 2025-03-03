"use client";

import { useState } from "react";
import { Citation } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { EMPTY_CITATION_MESSAGE } from "@/configuration/ui";

export function CitationCircle({
  number,
  citation,
}: {
  number: number;
  citation: Citation;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Check if source_url is valid and remove '.md' if it exists
  const stripMdExtension = (url: string) => {
    return url.endsWith(".md") ? url.slice(0, -3) : url;
  };

  // Modify URL if it starts with 'Chapter'
  const modifyUrl = (url: string) => {
    const strippedUrl = stripMdExtension(url);
    if (strippedUrl.startsWith("Chapter")) {
      return "NC General Statutes " + strippedUrl.replace(/_/g, " ");
    }
    return strippedUrl;
  };

  const hasSourceUrl = citation.source_url.trim() !== "";
  const hasSourceDescription = citation.source_description.trim() !== "";
  const hasText = citation.text && citation.text.trim() !== "";

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger>
        <div
          className="bg-gray-50 rounded-full px-2 py-0.5 hover:cursor-pointer hover:scale-105 inline-block"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{number}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="bg-white p-2 rounded-md shadow-sm flex flex-col justify-center border-[1px] border-gray-200">
          <p className="text-blue-500 text-sm">{modifyUrl(citation.source_url)}</p>
          {expanded && hasText && (
            <p className="mt-2 text-gray-700 text-sm">{citation.text}</p>
          )}
          {!hasText && expanded && <p className="text-gray-500 text-sm">{EMPTY_CITATION_MESSAGE}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
