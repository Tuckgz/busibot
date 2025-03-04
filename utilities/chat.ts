import { HYDE_MODEL, HYDE_TEMPERATURE } from "@/configuration/models";
import { QUESTION_RESPONSE_TOP_K } from "@/configuration/pinecone";
import {
  HYDE_PROMPT,
  RESPOND_TO_QUESTION_SYSTEM_PROMPT,
} from "@/configuration/prompts";
import {
  Chat,
  Chunk,
  chunkSchema,
  Citation,
  citationSchema,
  CoreMessage,
  DisplayMessage,
  Source,
} from "@/types";
import OpenAI from "openai";

// Strips citations from messages (removes [X] references)
export function stripMessagesOfCitations(
  messages: DisplayMessage[]
): DisplayMessage[] {
  return messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/\[\d+\]/g, ""),
  }));
}

// Converts display messages to core message format
export function convertToCoreMessages(
  messages: DisplayMessage[]
): CoreMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

// Adds a system message to the list of core messages
export function addSystemMessage(
  messages: CoreMessage[],
  systemMessage: string
): CoreMessage[] {
  return [{ role: "system", content: systemMessage }, ...messages];
}

// Embeds hypothetical data using OpenAI
export async function embedHypotheticalData(
  value: string,
  openai: OpenAI
): Promise<{ embedding: number[] }> {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: value,
    });

    return { embedding: embedding.data[0].embedding };
  } catch (error) {
    throw new Error("Error embedding hypothetical data");
  }
}

// Hypothetical Document Embedding (HyDe)
export async function generateHypotheticalData(
  chat: Chat,
  openai: OpenAI
): Promise<string> {
  try {
    console.log(
      "Generating hypothetical data...",
      HYDE_MODEL,
      HYDE_TEMPERATURE,
      HYDE_PROMPT(chat)
    );
    const response = await openai.chat.completions.create({
      model: HYDE_MODEL,
      temperature: HYDE_TEMPERATURE,
      messages: await convertToCoreMessages([
        {
          role: "system",
          content: HYDE_PROMPT(chat),
          citations: [],
        },
      ]),
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error generating hypothetical data:", error);
    throw new Error("Error generating hypothetical data");
  }
}

// Searches Pinecone for chunks based on embedding
export async function searchForChunksUsingEmbedding(
  embedding: number[],
  pineconeIndex: any
): Promise<Chunk[]> {
  try {
    const { matches } = await pineconeIndex.query({
      vector: embedding,
      topK: QUESTION_RESPONSE_TOP_K,
      includeMetadata: true,
    });

    return matches.map((match: any) =>
      chunkSchema.parse({
        text: match.metadata?.text ?? "",
        chunk_index: match.metadata?.chunk_index ?? 0,  // Adjusted for new metadata
        file: match.metadata?.file ?? "",  // Adjusted for new metadata
      })
    );
  } catch (error) {
    throw new Error(
      "Error searching for chunks using embedding. Double check Pinecone index name and API key."
    );
  }
}

// Aggregates chunks into sources (now using `file` and `chunk_index` instead of `source_url` and `source_description`)
export function aggregateSources(chunks: Chunk[]): Source[] {
  const sourceMap = new Map<string, Source>();

  chunks.forEach((chunk) => {
    if (!sourceMap.has(chunk.file)) {
      sourceMap.set(chunk.file, {
        chunks: [],
        file: chunk.file, // Using file as source
      });
    }
    sourceMap.get(chunk.file)!.chunks.push(chunk);
  });

  return Array.from(sourceMap.values());
}

// Sorts chunks in a source by their `order` field
export function sortChunksInSourceByOrder(source: Source): Source {
  source.chunks.sort((a, b) => a.order - b.order);
  return source;
}

// Retrieves the sources from chunks
export function getSourcesFromChunks(chunks: Chunk[]): Source[] {
  const sources = aggregateSources(chunks);
  return sources.map((source) => sortChunksInSourceByOrder(source));
}

// Builds the context from ordered chunks for citation
export function buildContextFromOrderedChunks(
  chunks: Chunk[],
  citationNumber: number
): string {
  let context = "";
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    context += chunk.text + ` [${citationNumber}] `; // Using chunk_index in the citation
    if (
      i === chunks.length - 1 ||
      chunk.post_context !== chunks[i + 1].pre_context
    ) {
      context += chunk.post_context;
    }
    if (i < chunks.length - 1) {
      context += "\n\n";
    }
  }
  return context.trim();
}

// Retrieves context from a source, including citation details
export function getContextFromSource(
  source: Source,
  citationNumber: number
): string {
  return `
    <excerpt>
    Source Citation: [${citationNumber}]
    Excerpt from file: ${source.file}, chunk index: ${citationNumber}:
    ${buildContextFromOrderedChunks(source.chunks, citationNumber)}
    </excerpt>
  `;
}

// Retrieves context from multiple sources
export function getContextFromSources(sources: Source[]): string {
  return sources
    .map((source, index) => getContextFromSource(source, index + 1))
    .join("\n\n\n");
}

// Builds the prompt from context (to be used in the system prompt)
export function buildPromptFromContext(context: string): string {
  return RESPOND_TO_QUESTION_SYSTEM_PROMPT(context);
}

// Retrieves citations from chunks using file and chunk_index
export function getCitationsFromChunks(chunks: Chunk[]): Citation[] {
  return chunks.map((chunk) =>
    citationSchema.parse({
      source_url: chunk.source_url,
      source_description: chunk.source_description,
      text: chunk.text.substring(0, 100),

      file: chunk.file,  // Use file for citation
      chunk_index: chunk.chunk_index,  // Use chunk index for citation

    })
  );
}
