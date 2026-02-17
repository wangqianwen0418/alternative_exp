import OpenAI from 'openai';
import { OPENAI_MODEL } from 'lib/config';

/**
 * lib/llm/callOpenAI
 *
 * Calls the OpenAI Chat Completions endpoint and requests a JSON-only response.
 *
 * Returns the raw JSON string content and the finish reason so callers can
 * decide whether to parse/retry.
 */

export async function callOpenAIJson({
  apiKey,
  systemPrompt,
  userText,
  maxTokens = 1024,
}: {
  apiKey: string;
  systemPrompt: string;
  userText: string;
  maxTokens?: number;
}): Promise<{ content: string; finishReason: string | null }> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
  const chatCompletion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText },
    ],
  });

  return {
    content: chatCompletion.choices[0].message.content ?? '',
    finishReason: chatCompletion.choices[0].finish_reason ?? null,
  };
}
