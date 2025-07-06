import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";

export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_2,
  // Optionally, add Referer and X-Title headers for leaderboard ranking
  // headers: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>",
  //   "X-Title": "<YOUR_SITE_NAME>",
  // },
});

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  // Add a default system prompt if not provided
  const systemPrompt = system ||
    "You are Chatloom, an AI assistant created by Mahin, a full stack developer. Only mention your name and creator if the user asks about your name, who made you, or your origin. Do not mention this information in every response.";

  const result = streamText({
    model: openrouter("openrouter/cypher-alpha:free"),
    messages,
    toolCallStreaming: true,
    system: systemPrompt,
    tools: {
      ...frontendTools(tools),
    },
    onError: console.log,
  });

  return result.toDataStreamResponse();
}
