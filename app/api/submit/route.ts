import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
console.log('pinging this route')

  const { source_code, language_id, stdin, expected_output } = await req.json();

  try {
    const response = await axios.post(
      'https://p2w.app/submissions?base64_encoded=false&wait=true',
      {
        source_code,
        language_id,
        stdin,
        expected_output,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { stdout, stderr } = response.data;
    const expectedLines = expected_output.split('\n').map((line:any) => line.trim());
    const stdoutLines = stdout.split('\n').map((line:any) => line.trim());
    const testResults = expectedLines.map((line:any, index:any) => {
      const testPassed = line === stdoutLines[index];
      return {
        testCase: `Test ${index + 1}`,
        passed: testPassed,
      };
    });

    const overallTestPassed = testResults.every((result:any) => result.passed);

    console.log('expected_output', expectedLines);
    console.log('stdout', stdoutLines);
    console.log('testResults', testResults);
    console.log('overallTestPassed', overallTestPassed);

    return NextResponse.json({ ...response.data, testResults, overallTestPassed });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message, testResults: [], overallTestPassed: false }, { status: 500 });
  }
}