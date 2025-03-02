import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { AIProviders, Chat, Intention } from "@/types";
import { IntentionModule } from "@/modules/intention";
import { ResponseModule } from "@/modules/response";
import { PINECONE_INDEX_NAME } from "@/configuration/pinecone";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

// Get API keys
const pineconeApiKey = process.env.PINECONE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const fireworksApiKey = process.env.FIREWORKS_API_KEY;

// Check if API keys are set
if (!pineconeApiKey) {
  throw new Error("❌ PINECONE_API_KEY is not set. Check your .env file.");
}
if (!openaiApiKey) {
  throw new Error("❌ OPENAI_API_KEY is not set. Check your .env file.");
}

// Initialize Pinecone
console.log("🔍 Initializing Pinecone Client...");

const pineconeClient = new Pinecone({
  apiKey: pineconeApiKey,
});

if (!PINECONE_INDEX_NAME) {
  throw new Error("❌ PINECONE_INDEX_NAME is not set. Check your .env file.");
}

console.log("✅ Pinecone API Key and Index Name are set:", PINECONE_INDEX_NAME);

const pineconeIndex = pineconeClient.Index(PINECONE_INDEX_NAME);
console.log("📡 Pinecone Index Initialized:", pineconeIndex);

// Initialize AI Providers
const openaiClient = new OpenAI({
  apiKey: openaiApiKey,
});
const anthropicClient = new Anthropic({
  apiKey: anthropicApiKey,
});
const fireworksClient = new OpenAI({
  baseURL: "https://api.fireworks.ai/inference/v1",
  apiKey: fireworksApiKey,
});

const providers: AIProviders = {
  openai: openaiClient,
  anthropic: anthropicClient,
  fireworks: fireworksClient,
};

async function determineIntention(chat: Chat): Promise<Intention> {
  return await IntentionModule.detectIntention({
    chat: chat,
    openai: providers.openai,
  });
}

export async function POST(req: Request) {
  try {
    const { chat } = await req.json();
    console.log("💬 Received chat request:", JSON.stringify(chat, null, 2));

    const intention: Intention = await determineIntention(chat);
    console.log("🤖 Determined intention:", intention.type);

    if (intention.type === "question") {
      console.log("🔍 Searching for relevant chunks...");
      return ResponseModule.respondToQuestion(chat, providers, pineconeIndex);
    } else if (intention.type === "hostile_message") {
      console.log("⚠️ Handling hostile message...");
      return ResponseModule.respondToHostileMessage(chat, providers);
    } else {
      console.log("🎲 Handling random message...");
      return ResponseModule.respondToRandomMessage(chat, providers);
    }
  } catch (error) {
    console.error("❌ Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
