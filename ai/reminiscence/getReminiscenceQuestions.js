import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a gentle, warm assistant helping a dementia patient
reminisce about a personal photo. Given a photo description, write exactly 3
short, open-ended, warm conversation questions about it. Never ask anything
that could be hard to answer or feel like a test.
Respond ONLY with valid JSON in this exact shape, nothing else:
{"questions": ["...", "...", "..."]}`;

export async function getReminiscenceQuestions(photoDescription) {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Photo description: "${photoDescription}"` },
      ],
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    if (!Array.isArray(parsed.questions) || parsed.questions.length < 2) {
      throw new Error("Unexpected response shape from model");
    }
    return { questions: parsed.questions };
  } catch (error) {
    // matches Backend's Standard Error Shape — for "online but the AI call failed"
    return {
      success: false,
      error: { message: "Reminiscence service unavailable, please try again", field: null },
    };
  }
}