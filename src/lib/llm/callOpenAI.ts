import OpenAI from 'openai';
import { OPENAI_MODEL } from 'lib/config';

/**
 * lib/llm/callOpenAI
 *
 * Calls the OpenAI Responses API and requests a JSON-only response.
 *
 * Returns the raw JSON string content and a status indicator so callers can
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

  const jsonGuard =
    'This is a reminder to return only valid JSON (a single JSON object). Do not include markdown, code fences, extra text, etc.';

  const inputText = userText.toLowerCase().includes('json')
    ? userText
    : `${userText}\n\n(${jsonGuard})`;

  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    instructions: systemPrompt,
    input: [
      {
        role: 'user',
        content: [{ type: 'input_text', text: inputText }],
      },
    ],
    text: {
      format: { type: 'json_object' },
    },
    max_output_tokens: maxTokens,
  });

  const content = (response.output_text ?? '').trim();

  const finishReason =
    response.status === 'completed'
      ? 'stop'
      : response.status === 'incomplete'
        ? 'length'
        : null;

  return { content, finishReason };
}
