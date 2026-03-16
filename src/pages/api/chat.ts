import { NextApiRequest, NextApiResponse } from "next";

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const HALO_BASE_URL = process.env.HALO_BASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { message, scenario, haloKey } = req.body;
 
  if (!haloKey) {
    return res.status(400).json({
      error: "Missing Halo API key",
    });
  }
 
  if (!message || !scenario) {
    return res.status(400).json({
      error: "Missing payload",
    });
  }

  try {
    // ------------------------
    // 1. GAME MODEL RESPONSE
    // ------------------------

    const aiResponse = await fetch(`${HALO_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${haloKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "Answer confidently in one sentence.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const aiData: ChatCompletionResponse = await aiResponse.json();

    const aiAnswer = aiData.choices?.[0]?.message?.content || "";

    // ------------------------
    // 2. JUDGE MODEL
    // ------------------------

    const judgePrompt = `
      Evaluate whether the AI response hallucinated.
      Evaluate if the user has asked a question related to the scenario mentioned below.
      Evaluate if the AI response is correct for the question and scenario mentioned below.
      Correctnes of the answer is based on the training data of the model.
      If the AI does not know the answer, it can make up an answer, this is called hallucination. The more the AI hallucinates, the more wrong its answer is.
      The more the AI says it does not know the answer, the less it hallucinates.
      This is called Expected Calibration Error (ECE). ECE is the difference between the confidence of the AI in its answer and the correctness of the answer. A well-calibrated model has low ECE.
      Based on the above criteria, give a hallucination score between 0 to 100, where 0 is not hallucinatory at all and 100 is extremely hallucinatory. Also give a short reason for the score.
      It should be based on the following criteria:

      If the user question is not related to the scenario, give a score of 0-20, because the AI cannot hallucinate on questions that are not related to the scenario.
      If the user question is related to the scenario, then evaluate the correctness of the AI answer based on the training data of the model and give a score based on the following criteria:

      - 0-20: Mostly accurate, with little to no hallucination. The AI anwers a perfect answer to the scenario.
      - 21-50: Some inaccuracies or minor hallucinations, but the core answer is mostly correct. The AI answers a partially correct answer to the scenario.
      - 51-80: Noticeable hallucinations that significantly impact the correctness of the answer. The AI answers a mostly wrong answer to the scenario.
      - 81-100: Highly hallucinatory, with little to no basis in reality. The AI answers a completely wrong answer to the scenario.

      Question:
        ${scenario.question}

      Correct Answer:
        ${scenario.correctAnswer}

      Message from Player:
        ${message}

      AI Response:
        ${aiAnswer}

      Return JSON only:

        {
          "hallucination_score": number (0-100),
          "reason": "short explanation"
        }
    `;

    const judgeResponse = await fetch(`${HALO_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${haloKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "You are an AI evaluation system.",
          },
          {
            role: "user",
            content: judgePrompt,
          },
        ],
      }),
    });

    const judgeData: ChatCompletionResponse = await judgeResponse.json();

    const judgeText = judgeData.choices?.[0]?.message?.content || "{}";

    let judge;

    try {
      judge = JSON.parse(judgeText);
    } catch {
      judge = {
        hallucination_score: 50,
        reason: "Judge output parsing failed",
      };
    }

    const score = judge.hallucination_score;

    return res.json({
      aiAnswer,
      hallucination: score,
      score,
      reason: judge.reason,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to reach Halo API",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
