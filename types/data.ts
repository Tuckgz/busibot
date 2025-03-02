import { z } from "zod";

// Uploaded Document Schema (No changes needed)
export const uploadedDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
  content: z.string(),
});
export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>;

// Chunk Schema (Updated for new metadata)
export const chunkSchema = z.object({
  pre_context: z.string(),
  text: z.string(),
  post_context: z.string(),
  chunk_index: z.number(),           // Replacing source_url with chunk_index
  file: z.string(),                  // Replacing source_description with file
  order: z.number(),                 // Keeping order field for sorting chunks
});
export type Chunk = z.infer<typeof chunkSchema>;

// Source Schema (Updated to use chunk_index and file instead of source_url and source_description)
export const sourceSchema = z.object({
  chunks: z.array(chunkSchema),
  file: z.string(),                  // Replacing source_url with file
});
export type Source = z.infer<typeof sourceSchema>;

// Citation Schema (Updated to reflect new citation metadata)
export const citationSchema = z.object({
  file: z.string(),                  // Replacing source_url with file
  chunk_index: z.number(),           // Replacing source_description with chunk_index
});
export type Citation = z.infer<typeof citationSchema>;
