"use client";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript';
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  isDark?: boolean;
  placeholder?: string;
}

export default function CodeEditor({
  language,
  value,
  onChange,
  editable = true,
  isDark = false,
  placeholder
}: CodeEditorProps) {
  const extensions = {
    html: [html()],
    css: [css()],
    javascript: [javascript()]
  }[language];

  const theme = isDark ? oneDark : undefined;

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-full">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={theme}
        editable={editable}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false
        }}
        className="text-sm"
        style={{ height: '100%', overflow: 'auto' }}
      />
    </div>
  );
}
