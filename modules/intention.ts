import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { Chat, Intention, intentionSchema, IntentionType } from "@/types";
import { HISTORY_CONTEXT_LENGTH } from "@/configuration/chat";
import { INTENTION_PROMPT } from "@/configuration/prompts";
import { INTENTION_MODEL } from "@/configuration/models";

/**
 * IntentionModule is responsible for detecting intentions
 */
export class IntentionModule {
  static async detectIntention({
    chat,
    openai,
  }: {
    chat: Chat;
    openai: OpenAI;
  }): Promise<Intention> {
    // Get the last user message in lower case
    const lastUserMessage = chat.messages
      .filter((msg) => msg.role === "user")
      .at(-1)?.content.toLowerCase();

    // Define dataset-related keywords
    const datasetKeywords = [
      "training dataset",
      "training data",
      "where do you get your data",
      "sources of training",
      "what data was used to train",
    ];

    // If the last message contains any dataset keywords and does NOT include "citation",
    // classify it as a training dataset question.
    if (
      lastUserMessage &&
      datasetKeywords.some((kw) => lastUserMessage.includes(kw)) &&
      !lastUserMessage.includes("citation")
    ) {
      return { type: "training_dataset_question" };
    }

    // Fallback to determining intention based on the conversation history.
    const mostRecentMessages = chat.messages
      .slice(-HISTORY_CONTEXT_LENGTH)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const response = await openai.beta.chat.completions.parse({
      model: INTENTION_MODEL,
      messages: [
        { role: "system", content: INTENTION_PROMPT() },
        ...mostRecentMessages,
      ],
      response_format: zodResponseFormat(intentionSchema, "intention"),
    });

    if (!response.choices[0].message.parsed) {
      return { type: "random" as IntentionType };
    }
    return response.choices[0].message.parsed;
  }
}
