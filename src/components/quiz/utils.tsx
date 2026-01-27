"use client";

import React from 'react';
import hljs from 'highlight.js';
import { QuizQuestion } from './types';

// Helper function to format inline code and bold text within text
function formatInlineCode(text: string, isDark: boolean): React.ReactNode {
  // Process both inline code and bold text
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Combined regex to match both inline code (`code`) and bold (**text**)
  const combinedRegex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let match;
  
  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Process the match
    if (match[0].startsWith('`')) {
      // Inline code
      const codeContent = match[0].slice(1, -1);
      parts.push(
        <code
          key={`inline-${match.index}`}
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            border: `1px solid ${isDark ? '#1f2937' : '#d1d5d9'}`,
            color: isDark ? '#e2e8f0' : '#24292e',
          }}
        >
          {codeContent}
        </code>
      );
    } else if (match[0].startsWith('**')) {
      // Bold text
      const boldContent = match[0].slice(2, -2);
      parts.push(
        <strong key={`bold-${match.index}`}>
          {boldContent}
        </strong>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? <>{parts}</> : text;
}

// Helper function to format inline code and code blocks
function formatQuestionText(text: string, isDark: boolean): React.ReactNode {
  // First, process numbered lists (lines starting with "1. ", "2. ", etc.)
  // Split text into segments: text blocks and list blocks
  const lines = text.split('\n');
  const segments: Array<{ type: 'text' | 'list'; content: string | string[] }> = [];
  let currentList: string[] = [];
  let currentText: string[] = [];
  
  const numberedListRegex = /^(\d+)\.\s+(.+)$/;
  
  for (const line of lines) {
    const match = line.match(numberedListRegex);
    if (match) {
      // This is a numbered list item
      if (currentText.length > 0) {
        segments.push({ type: 'text', content: currentText.join('\n') });
        currentText = [];
      }
      currentList.push(match[2]); // Add the item text (without the number)
    } else {
      // This is regular text
      if (currentList.length > 0) {
        segments.push({ type: 'list', content: currentList });
        currentList = [];
      }
      currentText.push(line);
    }
  }
  
  // Flush any remaining content
  if (currentList.length > 0) {
    segments.push({ type: 'list', content: currentList });
  }
  if (currentText.length > 0) {
    segments.push({ type: 'text', content: currentText.join('\n') });
  }
  
  // If no lists found, process normally with code blocks
  if (segments.every(s => s.type === 'text')) {
    const fullText = segments.map(s => s.content as string).join('\n');
    return processCodeBlocks(fullText, isDark);
  }
  
  // Process each segment: lists become <ol>, text segments go through code block processing
  const result: React.ReactNode[] = [];
  let listIndex = 0;
  
  for (const segment of segments) {
    if (segment.type === 'list') {
      result.push(
        <ol key={`list-${listIndex++}`} className="list-decimal list-inside my-2 space-y-1 ml-2">
          {(segment.content as string[]).map((item, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-300 font-normal text-sm" style={isDark ? { color: '#d1d5db' } : undefined}>
              {processCodeBlocks(item, isDark)}
            </li>
          ))}
        </ol>
      );
    } else {
      const processed = processCodeBlocks(segment.content as string, isDark);
      if (processed) {
        result.push(<span key={`text-${listIndex++}`}>{processed}</span>);
      }
    }
  }
  
  return <>{result}</>;
}

// Helper to process code blocks and inline code in text
function processCodeBlocks(text: string, isDark: boolean): React.ReactNode {
  // Handle code blocks: ```language\ncode\n```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: (string | { type: 'code'; language: string; code: string; id: string })[] = [];
  let lastIndex = 0;
  let match;
  let codeBlockIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block (process inline code in it)
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText.trim()) {
        parts.push(beforeText);
      }
    }
    
    // Add the code block
    const codeBlockId = `code-block-${codeBlockIndex++}`;
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      code: match[2].trim(),
      id: codeBlockId
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text (process inline code in it)
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push(remainingText);
    }
  }

  // If no code blocks found, just process inline code
  if (parts.length === 0 || parts.every(p => typeof p === 'string')) {
    return formatInlineCode(text, isDark);
  }
  
  // Render parts with both code blocks and inline code
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          // Process inline code in text parts
          return <span key={index}>{formatInlineCode(part, isDark)}</span>;
        } else {
          // Code block
          return (
            <pre
              key={part.id}
              className="my-4 p-4 rounded-lg overflow-x-auto text-sm font-mono block"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: `1px solid ${isDark ? '#1f2937' : '#e1e4e8'}`,
                color: isDark ? '#e2e8f0' : '#24292e',
              }}
            >
              <code
                className={`hljs language-${part.language}`}
                style={{ backgroundColor: 'transparent' }}
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(part.code, { 
                    language: part.language || 'text',
                    ignoreIllegals: true 
                  }).value
                }}
              />
            </pre>
          );
        }
      })}
    </>
  );
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to create a signature from questions (for detecting reshuffling)
function createQuestionSignature(questions: QuizQuestion[]): string {
  // Create a signature based on question IDs and their option orders
  const signature = questions.map(q => 
    `${q.id}:${q.options?.join('|') || ''}`
  ).join('||');
  return signature;
}

// Helper to strip markdown formatting for plain text report
function stripMarkdown(text: string): string {
  // Remove code blocks
  let cleaned = text.replace(/```[\s\S]*?```/g, '[code block]');
  // Remove inline code backticks
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  return cleaned;
}

// Find the index of an option text in the current options array
// Used to map saved option text to current shuffled option index
function findOptionIndex(optionText: string, options: string[]): number {
  return options.findIndex(opt => opt === optionText);
}

// Get the option text at a given index
function getOptionText(question: QuizQuestion, optionIndex: number): string | undefined {
  return question.options?.[optionIndex];
}

// Export all functions
export {
  formatQuestionText,
  shuffleArray,
  createQuestionSignature,
  stripMarkdown,
  findOptionIndex,
  getOptionText,
};
