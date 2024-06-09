"use client";

// React essentials
import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";

// Next.js theme hook for managing dark/light mode
import { useTheme } from "next-themes";

// Monaco editor imports for code editor functionality
import Editor, { OnMount, BeforeMount } from "@monaco-editor/react";
import { useMonaco } from "@monaco-editor/react";
import { editor as monacoEditor } from "monaco-editor";

// Custom hooks and components for handling AI completions and UI elements
import { useCompletion } from "ai/react";
import { CompletionFormatter } from "@/components/editor/completion-formatter";
import { GenerateInstructions } from "@/components/editor/prompt";
import { CircularSpinner } from "../circular-spinner";

interface TextEditorProps {
  language: "javascript" | "typescript" | "python" | "java" | "c" | "sql";
  cacheSize?: number;
  refreshInterval?: number;
  onSubmit?: (code: string) => void;
}

// Custom hook to manage the editor state and provide access to the editor instance
const useEditor = () => {
  const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);

  const getValue = useCallback(() => {
    console.log(editor?.getValue());
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
    editor.updateOptions({ fontSize: 12 });
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

export default TextEditor;