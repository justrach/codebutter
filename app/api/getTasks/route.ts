import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Groq from 'groq-sdk';

const groq = new Groq();

 const getGroqChatCompletion = async (text: string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Convert the following text to HTML. Do not return anything else.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    model: 'llama3-70b-8192',
    temperature: 0,
    max_tokens: 4098,
    top_p: 1,
    stop: null,
    stream: false,
  });
};

// export const getGroqChatCompletion2 = async (text: string) => {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: 'system',
//         content:
//           "Ensure that there are no extra /n's in the text below, do not return anything else other than a properly formatted html text.",
//       },
//       {
//         role: 'user',
//         content: text,
//       },
//     ],
//     model: 'llama3-70b-8192',
//     temperature: 0,
//     max_tokens: 4098,
//     top_p: 1,
//     stop: null,
//     stream: false,
//   });
// };

interface TaskData {
  task: number;
  question: string;
  data: {
    inputs: string[];
    outputs: string[];
  };
}

// Function to clean up extra newline characters using regex
const removeExtraNewlines = (html: string): string => {
    return html
      .replace(/(\n\s*)+/g, '\n') // Replace multiple newlines (with optional spaces) with a single newline
      .replace(/^\s+|\s+$/g, '')  // Trim leading and trailing whitespace
      .replace(/\n/g, ' ')        // Replace single newlines with spaces for inline HTML elements
      .replace(/\s{2,}/g, ' ');   // Replace multiple spaces with a single space
  };
  

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const task = searchParams.get('task');

  if (!task) {
    return NextResponse.json({ error: 'Task query parameter is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://insights.observer/get_task_data/?task=${task}`);
    if (response.status !== 200) {
      return NextResponse.json({ error: 'Failed to fetch task data from FastAPI' }, { status: response.status });
    }

    const data: TaskData = response.data;

    // Validate the structure of the data
    if (
      typeof data.task !== 'number' ||
      typeof data.question !== 'string' ||
      typeof data.data !== 'object' ||
      !Array.isArray(data.data.inputs) ||
      !Array.isArray(data.data.outputs)
    ) {
      return NextResponse.json({ error: 'Invalid data structure received from FastAPI' }, { status: 400 });
    }

    // Convert the question to HTML using Groq
    const markdownResponse = await getGroqChatCompletion(data.question);
    const markdownQuestion = markdownResponse.choices[0].message.content;

    // // Further process the HTML to ensure no extra newlines
    // const finalMarkdownResponse = await getGroqChatCompletion2(markdownQuestion!);
    // const finalMarkdownQuestion = finalMarkdownResponse.choices[0].message.content;

    // Clean up the HTML by removing extra newlines
    const cleanedHtml = removeExtraNewlines(markdownQuestion!);

    // Update the question to HTML format
    const updatedData: TaskData = {
      ...data,
      question: cleanedHtml,
    };

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
