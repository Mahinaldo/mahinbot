import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";

export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY!,
  // Optionally, add Referer and X-Title headers for leaderboard ranking
  // headers: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>",
  //   "X-Title": "<YOUR_SITE_NAME>",
  // },
});

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: openrouter("openrouter/cypher-alpha:free"),
    messages,
    toolCallStreaming: true,
    system,
    tools: {
      ...frontendTools(tools),
    },
    onError: console.log,
  });

  return result.toDataStreamResponse();
}
