// test-case-result.tsx
type TestCaseResultProps = {
    result: {
      testCase: string;
      passed: boolean;
    };
  };
  
  export function TestCaseResult({ result }: TestCaseResultProps) {
    return (
      <div className="flex items-center justify-between rounded-md bg-zinc-900 p-4">
        <div className="text-sm font-medium text-white">{result.testCase}</div>
        <div
          className={`text-sm ${
            result.passed ? "text-green-500" : "text-red-500"
          }`}
        >
          {result.passed ? "Passed" : "Failed"}
        </div>
      </div>
    );
  }