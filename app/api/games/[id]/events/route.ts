import { createRedisSubscriber } from "@/app/lib/redis";
import { getGameEventsChannel } from "@/app/lib/redisGame";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const encoder = new TextEncoder();

function toSseMessage(event: string, data: string, id?: string) {
  const chunks = [
    id ? `id: ${id}\n` : "",
    "retry: 3000\n",
    `event: ${event}\n`,
    `data: ${data}\n\n`,
  ];

  return encoder.encode(chunks.join(""));
}

export async function GET(request: Request, context: RouteContext) {
  const { id: gameId } = await context.params;
  const subscriber = createRedisSubscriber();
  const channel = getGameEventsChannel(gameId);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let eventId = 0;
      let isClosed = false;

      const cleanup = async () => {
        if (isClosed) return;
        isClosed = true;

        clearInterval(heartbeat);
        subscriber.removeAllListeners("message");
        await subscriber.unsubscribe(channel);
        subscriber.disconnect();
        
        try {
          controller.close();
        } catch {
          // Controller already closed
        }
      };

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, 15000);

      try {
        await subscriber.subscribe(channel);

        subscriber.on("message", (_channel, message) => {
          eventId += 1;
          try {
            controller.enqueue(
              toSseMessage("gameUpdate", message, `${Date.now()}-${eventId}`),
            );
          } catch {
            cleanup();
          }
        });
      } catch {
        await cleanup();
        controller.error(new Error("Failed to initialize game event stream"));
        return;
      }

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
