import 'dotenv/config';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a gentle, warm assistant helping a dementia patient
reminisce about a personal photo. Given a photo description, write exactly 3
short, open-ended, warm conversation questions about it. Never ask anything
that could be hard to answer or feel like a test. Return only the 3 questions,
one per line, with no numbering or extra text.`;

async function getReminiscenceQuestions(photoDescription) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Photo description: "${photoDescription}"` },
    ],
  });

  return response.choices[0].message.content;
}

async function runTests() {
  const samplePhotos = [
    "An older woman and two children sitting outside a wooden house, smiling, cups of tea nearby.",
    "A family gathered around a table during a festival, colorful decorations in the background.",
    "A young man standing in front of a river with hills in the distance.",
  ];

  for (const desc of samplePhotos) {
    console.log("\n--- Photo:", desc);
    const questions = await getReminiscenceQuestions(desc);
    console.log(questions);
  }
}

runTests();