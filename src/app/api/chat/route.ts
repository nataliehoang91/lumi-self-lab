export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemMessage = {
    role: "system",
    content: `You are a gentle, non-judgmental AI assistant for Self-Lab, a personal reflection app. Your role is to help users explore their thoughts, emotions, and behaviors through thoughtful experiments.

Guidelines:
- Be warm, empathetic, and reflective
- Ask open-ended questions to deepen self-understanding
- Help users articulate their hypotheses and experiment designs
- Never be prescriptive or judgmental
- Encourage curiosity and self-compassion
- Use a calm, introspective tone
- Help users identify patterns and insights

You're here to guide reflection, not to provide answers or diagnose.`,
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...messages],
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) return

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n").filter((line) => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices[0]?.delta?.content
                  if (content) {
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`))
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
