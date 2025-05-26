// pages/api/groq.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content:
    | string
    | Array<
        | { type: 'text'; text: string }
        | { type: 'image_url'; image_url: { url: string } }
      >;
};

// Initialize Groq SDK (server-side only)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '', // Don't use NEXT_PUBLIC_
});

// Mock technician database
const technicians: Record<
  string,
  { name: string; contact: string; rating: string; expertise: string }[]
> = {
  refrigerator: [
    {
      name: 'John Appliance Pro',
      contact: 'john@fixit.com',
      rating: '4.9',
      expertise: 'Refrigerators & Freezers',
    },
  ],
  washingmachine: [
    {
      name: 'Sarah Washer Expert',
      contact: 'sarah@fixit.com',
      rating: '4.8',
      expertise: 'Washing Machines & Dryers',
    },
  ],
  oven: [
    {
      name: 'Mike Oven Specialist',
      contact: 'mike@fixit.com',
      rating: '4.7',
      expertise: 'Ovens & Stoves',
    },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, image } = req.body;

  try {
    const response = await groqy(text, image);
    res.status(200).json({ message: response });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Groq processing function
async function groqy(userQuery: string, imageBase64?: string) {
  const userContent: GroqMessage['content'] = [];

  if (userQuery) userContent.push({ type: 'text', text: userQuery });

  if (imageBase64 && imageBase64.trim().length > 0) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  } else if (imageBase64) {
    console.error('Invalid image input: Base64 string is empty or corrupted.');
  }

  const messages: GroqMessage[] = imageBase64
    ? [{ role: 'user', content: userContent }]
    : [
        {
          role: 'system',
          content: `Analyze appliance issues from text and images. Follow this JSON format:
          {
            "applianceType": "...", 
            "problemDescription": "...",
            "possibleCauses": ["..."],
            "solutions": ["..."],
            "needsTechnician": boolean
          }`,
        },
        { role: 'user', content: userContent },
      ];

  const model = imageBase64 ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile';
  console.log('Using Groq model:', model);

  const response = await groq.chat.completions.create({
    messages: messages as any, // Skip type-checking due to SDK quirks
    model,
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1024,
  });

  console.log('Raw API Response:', JSON.stringify(response, null, 2));

  const parsed = parseResponse(response);
  return formatResponse(parsed);
}

// Helpers
function parseResponse(response: any) {
  try {
    const message = response?.choices?.[0]?.message?.content;
    if (!message) throw new Error('Empty response from API');
    return JSON.parse(message);
  } catch (e) {
    console.error('Failed to parse JSON response:', e, response);
    return { error: 'Failed to parse repair analysis. Please try again.' };
  }
}

function findTechnician(applianceType: string) {
  const category = applianceType.toLowerCase().replace(/\s+/g, '');
  return technicians[category]?.[0];
}

function formatResponse(response: any) {
  if (response.error) return `❌ Error: ${response.error}`;

  let formatted = `🔧 ${response.applianceType} Issue\n`;
  formatted += `📝 ${response.problemDescription}\n\n`;
  formatted +=
    'Possible Causes:\n' + response.possibleCauses.map((c: string) => `• ${c}`).join('\n');
  formatted +=
    '\n\nSuggested Fixes:\n' + response.solutions.map((s: string) => `✓ ${s}`).join('\n');

  if (response.needsTechnician) {
    formatted += '\n\n🚨 Professional Help Recommended';
    const technician = findTechnician(response.applianceType);
    if (technician) {
      formatted += `\n👨‍🔧 Contact: ${technician.name} (${technician.expertise}) - 📧 ${technician.contact} (⭐ ${technician.rating})`;
    }
  }

  return formatted;
}
