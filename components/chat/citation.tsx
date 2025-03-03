"use client";

import { useState } from "react";
import { Citation } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";
import { EMPTY_CITATION_MESSAGE } from "@/configuration/ui";

export function CitationCircle({
  number,
  citation,
}: {
  number: number;
  citation: Citation;
}) {
  const [open, setOpen] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Check if source_url is valid and remove '.md' if it exists
  const stripMdExtension = (url: string) => {
    return url.endsWith(".md") ? url.slice(0, -3) : url;
  };

  // Additional check to modify the URL if it starts with 'Chapter'
  const modifyUrl = (url: string) => {
    // Remove '.md' extension
    const strippedUrl = stripMdExtension(url);

    // If the URL starts with "Chapter", replace "_" with " " and prepend "NC General Statutes "
    if (strippedUrl.startsWith("Chapter")) {
      const modifiedUrl = "NC General Statutes " + strippedUrl.replace(/_/g, " ");
      return modifiedUrl;
    }

    return strippedUrl;
  };

  const hasSourceUrl = isValidUrl(citation.source_url) || true;
  const hasSourceDescription = citation.source_description.trim() !== "";

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger>
        <div
          className="bg-gray-50 rounded-full px-2 py-0.5 hover:cursor-pointer hover:scale-105 inline-block"
          onClick={() => setOpen(true)}
        >
          <span>{number}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="bg-white p-2 rounded-md shadow-sm flex flex-col justify-center border-[1px] border-gray-200">
          <p>
            {hasSourceUrl && (
              <Link
                href={citation.source_url}
                target="_blank"
                className="text-blue-500 hover:underline text-sm"
              >
                {/* Display the modified URL */}
                {modifyUrl(citation.source_url)}
              </Link>
            )}
            {!hasSourceUrl && citation.source_description}
            {!hasSourceUrl && !hasSourceDescription && EMPTY_CITATION_MESSAGE}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
