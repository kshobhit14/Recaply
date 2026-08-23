/*const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeTranscript(transcript) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const prompt = `Analyze the meeting transcript below.

Return ONLY valid JSON with this exact shape:
{
  "summary": "short paragraph",
  "keyPoints": ["point 1", "point 2"],
  "decisions": ["decision 1"],
  "actionItems": [
    {"task": "task", "assignee": "person or Unassigned", "deadline": "deadline or Not specified"}
  ]
}

Rules:
- Do not invent facts.
- Keep the summary concise and action-oriented.
- Extract explicit decisions.
- Extract tasks, owners, and deadlines only when stated.
- If a value is not stated, use "Not specified".

Transcript:
${transcript}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a precise meeting intelligence assistant." },
      { role: "user", content: prompt }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { summarizeTranscript };*/
/*async function summarizeTranscript(transcript) {
  return {
    summary:
      "The team discussed project development progress and agreed to complete frontend integration and testing before the final review.",

    keyPoints: [
      "Backend API development is nearly complete",
      "Frontend integration is the next major task",
      "The project will undergo a final review before submission"
    ],

    decisions: [
      "Frontend integration should be completed by Friday",
      "The team will conduct a final project review before submission"
    ],

    actionItems: [
      {
        task: "Complete backend testing",
        assignee: "John",
        deadline: "Not specified"
      },
      {
        task: "Prepare project documentation",
        assignee: "Sarah",
        deadline: "Friday"
      },
      {
        task: "Review the final project",
        assignee: "Unassigned",
        deadline: "Not specified"
      }
    ]
  };
}

module.exports = { summarizeTranscript };*/


async function summarizeTranscript(transcript) {
  if (!transcript || !transcript.trim()) {
    throw new Error("Transcript is empty");
  }

  const prompt = `Analyze the meeting transcript below.

Return ONLY valid JSON with this exact shape:
{
  "summary": "short paragraph",
  "keyPoints": ["point 1", "point 2"],
  "decisions": ["decision 1"],
  "actionItems": [
    {
      "task": "task",
      "assignee": "person or Unassigned",
      "deadline": "deadline or Not specified"
    }
  ]
}

Rules:
- Do not invent facts.
- Keep the summary concise and action-oriented.
- Extract explicit decisions.
- Extract tasks, owners, and deadlines only when stated.
- If a value is not stated, use "Not specified".

Transcript:
${transcript}`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3.2:3b",
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Ollama returned an empty response");
  }

  try {
    return JSON.parse(data.response);
  } catch (error) {
    console.error("Invalid JSON from Ollama:", data.response);
    throw new Error("Ollama returned invalid JSON");
  }
}

module.exports = { summarizeTranscript };