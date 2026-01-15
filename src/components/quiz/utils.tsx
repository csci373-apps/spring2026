"use client";

import React from 'react';
import hljs from 'highlight.js';
import { QuizQuestion } from './types';

// Helper function to format inline code and code blocks
function formatQuestionText(text: string, isDark: boolean): React.ReactNode {
  // First, handle code blocks: ```language\ncode\n```
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
    // Process inline code: `stuff`
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineParts: React.ReactNode[] = [];
    let inlineLastIndex = 0;
    let inlineMatch;
    
    while ((inlineMatch = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (inlineMatch.index > inlineLastIndex) {
        inlineParts.push(text.substring(inlineLastIndex, inlineMatch.index));
      }
      
      // Add inline code
      inlineParts.push(
        <code
          key={`inline-${inlineMatch.index}`}
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#fff',
            border: `1px solid ${isDark ? '#1f2937' : '#d1d5d9'}`,
            color: isDark ? '#e2e8f0' : '#24292e',
          }}
        >
          {inlineMatch[1]}
        </code>
      );
      
      inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
    }
    
    // Add remaining text
    if (inlineLastIndex < text.length) {
      inlineParts.push(text.substring(inlineLastIndex));
    }
    
    return inlineParts.length > 0 ? <>{inlineParts}</> : text;
  }
  
  // Render parts with both code blocks and inline code
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          // Process inline code in text parts
          const inlineCodeRegex = /`([^`]+)`/g;
          const inlineParts: React.ReactNode[] = [];
          let inlineLastIndex = 0;
          let inlineMatch;
          
          while ((inlineMatch = inlineCodeRegex.exec(part)) !== null) {
            // Add text before inline code
            if (inlineMatch.index > inlineLastIndex) {
              inlineParts.push(part.substring(inlineLastIndex, inlineMatch.index));
            }
            
            // Add inline code
            inlineParts.push(
              <code
                key={`inline-${index}-${inlineMatch.index}`}
                className="px-1.5 py-0.5 rounded text-sm font-mono"
                style={{
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: `1px solid ${isDark ? '#1f2937' : '#d1d5d9'}`,
                  color: isDark ? '#e2e8f0' : '#24292e',
                }}
              >
                {inlineMatch[1]}
              </code>
            );
            
            inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
          }
          
          // Add remaining text
          if (inlineLastIndex < part.length) {
            inlineParts.push(part.substring(inlineLastIndex));
          }
          
          return <span key={index}>{inlineParts.length > 0 ? inlineParts : part}</span>;
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
    `${q.id}:${q.options.join('|')}`
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
  return question.options[optionIndex];
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
