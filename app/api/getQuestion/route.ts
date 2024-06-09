import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract the 'task' query parameter from the request
  const { searchParams } = new URL(request.url);
  const task = searchParams.get('task');

  // If the 'task' parameter is not provided, return a 400 response
  if (!task) {
    return NextResponse.json({ error: 'Task query parameter is required' }, { status: 400 });
  }

  try {
    // Make a request to the FastAPI endpoint
    const response = await fetch(`https://insights.observer/get_task_data/?task=${task}`);

    // If the FastAPI response is not OK, return an error
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch task data from FastAPI' }, { status: response.status });
    }

    // Parse the JSON response from FastAPI
    const data = await response.json();

    // Return the data from FastAPI as the response
    return NextResponse.json(data);

  } catch (error) {
    // Handle any errors that occurred during the fetch
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
