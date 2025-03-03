import { OWNER_NAME, AI_NAME } from "./identity";

export const INITIAL_MESSAGE: string = `Yo, I'm ${AI_NAME}, ${OWNER_NAME}'s AI Legal code sifter. Ask away!`;
export const DEFAULT_RESPONSE_MESSAGE: string = `Oof, I feel dizzy. Can you give me a sec? I need some water before I answer more questions.`;
export const WORD_CUTOFF: number = 8000; // Number of words until bot says it needs a break
export const WORD_BREAK_MESSAGE: string = `[WORD BREAK MESSAGE]`;
export const HISTORY_CONTEXT_LENGTH: number = 7; // Number of messages to use for context when generating a response
