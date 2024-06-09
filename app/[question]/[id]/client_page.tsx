'use client';
import './App.css';
import { useState, useRef } from 'react';
import axios from 'axios';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { TestCaseResult } from './test_component';
import { Textarea } from '@/components/ui/TextArea';
import { motion } from 'framer-motion';

import { useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useTheme } from "next-themes";
import Editor, { OnMount, BeforeMount } from "@monaco-editor/react";
import { useMonaco } from "@monaco-editor/react";
import { editor as monacoEditor } from "monaco-editor";
import { useCompletion } from "ai/react";
import { CompletionFormatter } from "@/components/editor/completion-formatter";
import { GenerateInstructions } from "@/components/editor/prompt";
import { CircularSpinner } from '@/components/circular-spinner';
import { MdHome } from "react-icons/md";
import { GrLinkNext, GrLinkPrevious, GrTest } from "react-icons/gr";
import { useParams } from 'next/navigation';

interface TaskData {
  task: number;
  question: string;
  data: {
    inputs: string[];
    outputs: string[];
  };
}
interface TextEditorProps {
    language: "javascript" | "typescript" | "python" | "java" | "c" | "sql";
    cacheSize?: number;
    refreshInterval?: number;
    onSubmit?: (code: string) => void;
  }
const useEditor = () => {
  const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);

  const getValue = useCallback(() => {
    return editor?.getValue();
  }, [editor]);

  return { editor, setEditor, getValue };
};

const TextEditor = forwardRef<{ getValue: () => string | undefined }, TextEditorProps>(({
  language,
  cacheSize = 10,
  refreshInterval = 500,
  onSubmit,
}, ref) => {
  const monaco = useMonaco();
  const { editor, setEditor, getValue } = useEditor();

  const fetchSuggestionsIntervalRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const [cachedSuggestions, setCachedSuggestions] = useState<any[]>([]);
  const [currentLine, setCurrentLine] = useState(1);

  const { completion, stop, complete } = useCompletion({
    api: "/api/completion",
    body: {
      language: language,
    },
  });

  useImperativeHandle(ref, () => ({
    getValue,
  }), [getValue]);

  const debouncedSuggestions = useCallback(() => {
    const model = monaco?.editor.getModels()[0];

    if (!model || !model.getValue()) {
      setCachedSuggestions([]);
      return;
    }

    const position = editor!.getPosition();
    if (!position) return;

    const currentLine = model.getLineContent(position.lineNumber);
    const offset = model.getOffsetAt(position);
    const textBeforeCursor = model
      .getValue()
      .substring(0, offset - currentLine.length);
    const textBeforeCursorOnCurrentLine = currentLine.substring(
      0,
      position.column - 1,
    );

    if (!textBeforeCursor) return;

    const messages = [
      GenerateInstructions(language),
      {
        content: textBeforeCursor,
        role: "user",
        name: "TextBeforeCursor",
      },
      {
        content: textBeforeCursorOnCurrentLine,
        role: "user",
        name: "TextBeforeCursorOnCurrentLine",
      },
    ];

    complete("", {
      body: {
        messages,
      },
    })
      .then((newCompletion) => {
        if (newCompletion) {
          const newSuggestion = {
            insertText: newCompletion,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber:
                position.lineNumber + (newCompletion.match(/\n/g) || []).length,
              endColumn: position.column + newCompletion.length,
            },
          };

          setCachedSuggestions((prev) => [
            ...prev.slice(-cacheSize + 1),
            newSuggestion,
          ]);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [monaco, complete, setCachedSuggestions, language, cacheSize]);

  const startOrResetFetching = useCallback(() => {
    if (fetchSuggestionsIntervalRef.current === undefined) {
      debouncedSuggestions();

      fetchSuggestionsIntervalRef.current = setInterval(
        debouncedSuggestions,
        refreshInterval,
      ) as unknown as number;
    }

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (fetchSuggestionsIntervalRef.current !== undefined) {
        window.clearInterval(fetchSuggestionsIntervalRef.current);
        fetchSuggestionsIntervalRef.current = undefined;
      }
    }, refreshInterval * 2) as unknown as number;
  }, [debouncedSuggestions, refreshInterval]);

  useEffect(() => {
    return () => {
      window.clearInterval(fetchSuggestionsIntervalRef.current);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleEditorChange = useCallback(() => {
    startOrResetFetching();
  }, [startOrResetFetching]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditor(editor);
    editor.onDidChangeCursorPosition((event) => {
      setCurrentLine(event.position?.lineNumber || 1);
    });
    monaco.editor.setTheme("vs-dark-custom");
    editor.updateOptions({ fontSize: 16 });
    editor.updateOptions({ fontFamily: "JetBrains Mono" });
    editor.updateOptions({ lineNumbers: "on" });
    editor.updateOptions({ wordWrap: "on" });
    editor.updateOptions({ wordWrapColumn: 80 });
    editor.updateOptions({ scrollBeyondLastLine: false });
    editor.updateOptions({ minimap: { enabled: true } });
    editor.updateOptions({ cursorStyle: "line" });
    editor.updateOptions({
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
        useShadows: true,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 17,
        horizontalScrollbarSize: 17,
        arrowSize: 30,
      },
    });
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("vs-dark-custom", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#D4D4D4",
      },
    });
    monaco.editor.setTheme("vs-dark-custom");
  };

  useEffect(() => {
    if (!monaco) return;

    const provider = monaco.languages.registerInlineCompletionsProvider(
      language,
      {
        provideInlineCompletions: async (model, position) => {
          const suggestions = cachedSuggestions.filter((suggestion) =>
            suggestion.insertText.startsWith(
              model.getValueInRange(suggestion.range),
            ),
          );

          const localSuggestions = suggestions.filter(
            (suggestion) =>
              suggestion.range.startLineNumber == position.lineNumber &&
              suggestion.range.startColumn >= position.column - 3,
          );

          if (
            !/[a-zA-Z0-9\s]/.test(model.getValue().charAt(position.column - 2))
          ) {
            return {
              items: [],
            };
          }

          return {
            items: localSuggestions.map((suggestion) =>
              new CompletionFormatter(model, position).format(
                suggestion.insertText,
                suggestion.range,
              ),
            ),
          };
        },
        freeInlineCompletions: () => {},
      },
    );

    return () => provider.dispose();
  }, [monaco, completion, stop, cachedSuggestions, language]);

  return (
    <div className="p-2 bg-black text-white">
      <div className="flex mb-2">
        <div>Line {currentLine}{" | "}</div>
        <div>{" "} Python</div>
      </div>
      <Editor
        height="50vh"
        defaultLanguage={language}
        defaultValue="# Start typing..."
        loading={<CircularSpinner />}
        theme={useTheme().resolvedTheme === "dark" ? "vs-dark" : "vs"}
        options={{
          autoClosingBrackets: "never",
          autoClosingQuotes: "never",
          formatOnType: true,
          formatOnPaste: true,
          trimAutoWhitespace: true,
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

export default function QuestionPage({ taskData }: { taskData: TaskData }) {
  const params = useParams();
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<
    { testCase: string; passed: boolean }[] | null
  >(null);
  const [overallTestPassed, setOverallTestPassed] = useState<boolean | null>(
    null
  );
  const editorRef = useRef<{ getValue: () => string | undefined }>(null);
  const currentIndex = parseInt(params.id.toString());
  const previousQuestionIndex = currentIndex - 1;
  const nextQuestionIndex = currentIndex + 1;

  const handleSubmit = async (code: string, inputs: string, outputs: string) => {
    console.log('code is', code)
    try {
      const response = await axios.post("/api/submit", {
        source_code: code,
        language_id: 71, // Python 3
        stdin: inputs,
        expected_output: outputs,
      });

      setOutput(response.data.stdout || response.data.stderr || "No output");
      setTestResults(response.data.testResults);
      setOverallTestPassed(response.data.overallTestPassed);
    } catch (error) {
      if (error instanceof Error) {
        // setOutput("Error: " + error.message);
        setOutput(":( Code did not compile. Practice more.");
      } else {
        setOutput("An error occurred");
      }
    }
  };

  const handleTest = async (code: string, inputs: string, outputs: string) => {
    try {
      const response = await axios.post("/api/test", {
        source_code: code,
        language_id: 71, // Python 3
        stdin: inputs,
        expected_output: outputs,
      });

      setTestResults(response.data.testResults);
    } catch (error) {
      console.error('Error:', error);
      setTestResults(null);
    }
  };

  const handleEditorSubmit = () => {
    console.log('Editor submit button clicked');
    const code = editorRef.current?.getValue();
    if (!code) {
      console.error('Code is undefined');
      return;
    }
    const inputs = taskData.data.inputs[0]
    const outputs = taskData.data.outputs[0];
    handleSubmit(code, inputs, outputs);
  };

  const handleEditorTest = () => {
    console.log('Editor test button clicked');
    const code = editorRef.current?.getValue();
    if (!code) {
      console.error('Code is undefined');
      return;
    }
    const inputs = taskData.data.inputs[0];
    const outputs = taskData.data.outputs[0];
    handleTest(code, inputs, outputs);
  };

  return (
    <div className="grid min-h-screen animated-gradient w-full grid-cols-[1fr_2fr] gap-8 overflow-hidden p-8">
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-black p-6 shadow-md">
          <h3 className="mb-4 text-xl font-medium text-white">Problem</h3>
          <div className="prose prose-invert text-white max-h-96 overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: taskData.question }} />
          </div>
        </div>
        <div className="rounded-lg bg-black p-6 shadow-md">
          <h3 className="mb-4 text-xl font-medium text-white">Test Cases</h3>
          <div className="grid gap-4">
            {testResults ? (
              testResults.map((result, index) => (
                <TestCaseResult key={index} result={result} />
              ))
            ) : (
              <p className="text-white">No test results available</p>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-black p-6 shadow-md">
          <h3 className="mb-4 text-xl font-medium text-white">Notes</h3>
          <Textarea
            placeholder="Write your notes here..."
            className="h-24 resize-none rounded-md bg-zinc-900 p-2 text-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative rounded-sm overflow-guard bg-black shadow-md">
          <Card className="overflow-hidden">
            <motion.div layoutId="heroContainer">
              <TextEditor ref={editorRef} language="python" />
            </motion.div>
          </Card>
        </div>
        <div className="rounded-lg bg-black p-6 shadow-md flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-white">
                <MdHome className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex gap-4">
              <Button onClick={handleEditorSubmit} variant="ghost" size="icon" className="text-white">
                <PlayIcon className="h-5 w-5" />
                <span className="sr-only">Test</span>
              </Button>
            </div>
            <div className="flex gap-4">
              {previousQuestionIndex >= 0 && (
                <Link href={`/question/${previousQuestionIndex}`}>
                  <Button variant="ghost" size="icon" className="text-white">
                    <GrLinkPrevious className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {nextQuestionIndex >= 0 && (
                <Link href={`/question/${nextQuestionIndex}`}>
                  <Button variant="ghost" size="icon" className="text-white">
                    <GrLinkNext className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-medium text-white">Output</h2>
            <pre className="text-white">{output}</pre>
            {overallTestPassed !== null && (
              <p className="mt-4 text-white">
                Overall Test Result:{" "}
                {overallTestPassed ? (
                  <span className="text-green-500">Passed</span>
                ) : (
                  <span className="text-red-500">Failed</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components...
function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function TestTubeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
      <path d="M8.5 2h7" />
      <path d="M14.5 16h-5" />
    </svg>
  )
}

function UploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
