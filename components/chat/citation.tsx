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

  // Remove '.md' extension if it exists.
  const stripMdExtension = (url: string) => {
    return url.endsWith(".md") ? url.slice(0, -3) : url;
  };

  // Modify the display text for the URL if it starts with "Chapter".
  const modifyUrl = (url: string) => {
    const strippedUrl = stripMdExtension(url);
    if (strippedUrl.startsWith("Chapter")) {
      // Replace underscores with spaces.
      return "NC General Statutes " + strippedUrl.replace(/_/g, " ");
    }
    return strippedUrl;
  };

  // Create an actual URL for NC General Statutes if the chapter is provided.
  const getActualUrl = (url: string) => {
    const strippedUrl = stripMdExtension(url);
    if (strippedUrl.startsWith("Chapter")) {
      return `https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByChapter/${strippedUrl}.html`;
    }
    return strippedUrl;
  };

  // Compute the actual URL and then check its validity.
  const actual_url = getActualUrl(citation.source_url);
  const isActualUrlValid = isValidUrl(actual_url);

  const hasSourceDescription = citation.source_description.trim() !== "";

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger>
        <div
          className="bg-[#6B4F3E] text-[#D1B29D] rounded-full px-2 py-0.5 hover:cursor-pointer hover:scale-105 inline-block"
          onClick={() => setOpen(true)}
        >
          <span>{number}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="bg-[#dbcabf] p-2 rounded-md shadow-sm border border-[#6B4F3E] max-w-xs">
          {isActualUrlValid ? (
            <Link
              href={actual_url}
              target="_blank"
              className="text-[#8BC493] hover:underline text-sm"
            >
              {modifyUrl(citation.source_url)}
            </Link>
          ) : (
            <span className="text-sm text-[#6B4F3E]">
              {modifyUrl(citation.source_url)}
            </span>
          )}
          <div className="mt-1 text-xs text-[#6B4F3E] break-words">
            {citation.source_description || EMPTY_CITATION_MESSAGE}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
