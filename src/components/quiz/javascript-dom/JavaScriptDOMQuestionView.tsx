"use client";

import { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { JavaScriptDOMQuestion, TestResults } from './types';
import { TestRunner } from './TestRunner';
import CodeEditor from './CodeEditor';
import PreviewPane from './PreviewPane';
import TargetPreview from './TargetPreview';
import TestResultsView from './TestResults';
import { formatQuestionText } from '../utils';

interface JavaScriptDOMQuestionViewProps {
  question: JavaScriptDOMQuestion;
  questionNumber: number;
  selectedAnswers: { [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } };
  onAnswerSelect: (questionId: string, answer: { html: string; css: string; js: string; testResults?: TestResults }, passed: boolean) => void;
  isRevealed?: boolean;
  onRevealAnswer?: (questionId: string) => void;
  showSummary?: boolean;
  isDark: boolean;
}

export default function JavaScriptDOMQuestionView({
  question,
  questionNumber,
  selectedAnswers,
  onAnswerSelect,
  isRevealed = false,
  onRevealAnswer,
  showSummary = false,
  isDark
}: JavaScriptDOMQuestionViewProps) {
  const savedAnswer = selectedAnswers[question.id];
  const isCodeAnswer = typeof savedAnswer === 'object' && savedAnswer !== null && 'html' in savedAnswer;
  const codeAnswer = isCodeAnswer ? savedAnswer as { html: string; css: string; js: string; testResults?: TestResults } : null;
  
  const [html, setHtml] = useState(
    codeAnswer?.html || question.htmlTemplate || ''
  );
  const [css, setCss] = useState(
    codeAnswer?.css || question.cssTemplate || ''
  );
  const [js, setJs] = useState(
    codeAnswer?.js || question.codeTemplate || ''
  );
  const [testResults, setTestResults] = useState<TestResults | null>(
    codeAnswer?.testResults || null
  );
  const [isRunning, setIsRunning] = useState(false);
  
  // Check if CSS and JS templates are meaningful (not just comments)
  const hasCssTemplate = question.cssTemplate && 
    question.cssTemplate.trim().length > 0 &&
    !question.cssTemplate.trim().match(/^\/\/.*$/m); // Not just a single-line comment
  const hasJsTemplate = question.codeTemplate && 
    question.codeTemplate.trim().length > 0 &&
    !question.codeTemplate.trim().match(/^\/\/.*No JavaScript needed.*$/i); // Not "// No JavaScript needed"
  
  // If JavaScript is present, always show CSS tab (even if no CSS template)
  // This allows users to add CSS for styling JavaScript interactions
  const showCssTab = hasCssTemplate || hasJsTemplate;
  
  // Check if question has a target example to display
  const hasTargetExample = !!(question.targetHtml && question.targetCss);
  
  // Determine initial tab based on available templates
  const getInitialTab = (): 'html' | 'css' | 'javascript' | 'preview' => {
    if (hasCssTemplate && !hasJsTemplate) {
      return 'html'; // HTML + CSS only, start with HTML
    }
    if (!hasCssTemplate && !hasJsTemplate) {
      return 'html'; // HTML only, start with HTML
    }
    return 'html'; // Default to HTML
  };
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript' | 'preview'>(getInitialTab());

  const testRunnerRef = useRef<TestRunner | null>(null);
  const draftSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track previous question ID to detect actual question changes
  const prevQuestionIdRef = useRef<string>(question.id);

  // Reset state when question changes
  useEffect(() => {
    const currentSavedAnswer = selectedAnswers[question.id];
    const isCodeAnswer = typeof currentSavedAnswer === 'object' && currentSavedAnswer !== null && 'html' in currentSavedAnswer;
    const codeAnswer = isCodeAnswer ? currentSavedAnswer as { html: string; css: string; js: string; testResults?: TestResults } : null;
    setHtml(codeAnswer?.html || question.htmlTemplate || '');
    setCss(codeAnswer?.css || question.cssTemplate || '');
    setJs(codeAnswer?.js || question.codeTemplate || '');
    setTestResults(codeAnswer?.testResults || null);
    
    // Only reset to HTML tab when question ID actually changes (new question)
    if (prevQuestionIdRef.current !== question.id) {
      setActiveTab('html');
      prevQuestionIdRef.current = question.id;
    }
  }, [question.id, question.htmlTemplate, question.cssTemplate, question.codeTemplate, selectedAnswers]);

  // Persist edits after a check so navigating away doesn't reset progress
  useEffect(() => {
    if (!codeAnswer) return;

    const savedHtml = codeAnswer.html || '';
    const savedCss = codeAnswer.css || '';
    const savedJs = codeAnswer.js || '';
    const isUnchanged = html === savedHtml && css === savedCss && js === savedJs;

    if (isUnchanged) return;

    if (draftSaveTimeoutRef.current) {
      clearTimeout(draftSaveTimeoutRef.current);
    }

    draftSaveTimeoutRef.current = setTimeout(() => {
      const currentResults = testResults || codeAnswer.testResults;
      onAnswerSelect(
        question.id,
        { html, css, js, testResults: currentResults },
        !!currentResults?.allPassed
      );
    }, 300);

    return () => {
      if (draftSaveTimeoutRef.current) {
        clearTimeout(draftSaveTimeoutRef.current);
      }
    };
  }, [html, css, js, codeAnswer, testResults, question.id, onAnswerSelect]);

  // Initialize TestRunner once using useEffect to avoid issues in strict mode
  useEffect(() => {
    if (!testRunnerRef.current) {
      testRunnerRef.current = new TestRunner();
    }
    
    return () => {
      if (testRunnerRef.current) {
        testRunnerRef.current.cleanup();
      }
    };
  }, []);

  const handleCheck = async () => {
    if (!testRunnerRef.current) return;
    
    setIsRunning(true);
    try {
      const results = await testRunnerRef.current.executeTests(
        html,
        css,
        js,
        question.testCases,  // Legacy JSON format
        question.testCode     // New JavaScript format
      );
      setTestResults(results);
      onAnswerSelect(question.id, { html, css, js, testResults: results }, results.allPassed);
    } catch (error) {
      setTestResults({
        allPassed: false,
        results: [],
        executionError: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-check when question is revealed in review mode and hasn't been checked yet
  useEffect(() => {
    if (isRevealed && !testResults && !isRunning && testRunnerRef.current) {
      // Only auto-check if there's actual code to test
      if (html.trim() || css.trim() || js.trim()) {
        const runCheck = async () => {
          if (!testRunnerRef.current) return;
          
          setIsRunning(true);
          try {
            const results = await testRunnerRef.current.executeTests(
              html,
              css,
              js,
              question.testCases,  // Legacy JSON format
              question.testCode     // New JavaScript format
            );
            setTestResults(results);
            onAnswerSelect(question.id, { html, css, js, testResults: results }, results.allPassed);
          } catch (error) {
            setTestResults({
              allPassed: false,
              results: [],
              executionError: error instanceof Error ? error.message : 'Unknown error'
            });
          } finally {
            setIsRunning(false);
          }
        };
        runCheck();
      }
    }
  }, [isRevealed, testResults, isRunning, html, css, js, question.id, question.testCases, question.testCode, onAnswerSelect]);

  const handleDownload = async () => {
    const zip = new JSZip();
    
    // Create index.html with linked CSS and JS
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${question.question.split('\n')[0]}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${html || '<!-- Your HTML here -->'}
<script src="script.js"></script>
</body>
</html>`;
    
    // Add files to zip
    zip.file('index.html', indexHtml);
    zip.file('styles.css', css || '/* Your CSS here */');
    zip.file('script.js', js || '// Your JavaScript here');
    
    // Generate zip file and trigger download
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `question-${questionNumber}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shouldShowFeedback = isRevealed || showSummary;

  return (
    <div className="px-6 pt-6 pb-0 rounded-lg" style={isDark ? { backgroundColor: 'rgba(30, 58, 138, 0.15)', borderColor: '#1e3a8a' } : undefined}>
    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100" style={isDark ? { color: '#f9fafb' } : undefined}>
        {questionNumber}. {formatQuestionText(question.question, isDark)}
    </div>

      {/* Target Preview - shown above tabs when available */}
      {hasTargetExample && (
        <div className="">
          {question.instructions && (
            <div className="mb-3 text-gray-700 dark:text-gray-300">
              {formatQuestionText(question.instructions, isDark)}
            </div>
          )}
          <div style={{ height: '150px' }} className="mb-8">
            <TargetPreview
              html={question.targetHtml!}
              css={question.targetCss!}
              js={question.targetJs}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {/* Tab Navigation with Buttons */}
        <div className="py-2 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
          <div className="flex">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'html'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            HTML
          </button>
          {showCssTab && (
            <button
              onClick={() => setActiveTab('css')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'css'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              CSS
            </button>
          )}
          {hasJsTemplate && (
            <button
              onClick={() => setActiveTab('javascript')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'javascript'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              JavaScript
            </button>
          )}
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Preview
          </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
              title="Download code as ZIP file"
            >
              <i className="fas fa-download"></i>
              Download
            </button>
            {!showSummary && (
              <button
                onClick={async () => {
                  await handleCheck();
                  if (onRevealAnswer && !isRevealed) {
                    onRevealAnswer(question.id);
                  }
                }}
                disabled={isRunning}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Running Tests...' : 'Check Answer'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Content - Fixed height with scrolling */}
        <div style={{ height: '300px' }}>
          {activeTab === 'html' && (
            <CodeEditor
              language="html"
              value={html}
              onChange={setHtml}
              editable={true}
              isDark={isDark}
              placeholder="<!-- Your HTML here -->"
            />
          )}
          {activeTab === 'css' && showCssTab && (
            <CodeEditor
              language="css"
              value={css}
              onChange={setCss}
              editable={true}
              isDark={isDark}
              placeholder="/* Your CSS here */"
            />
          )}
          {activeTab === 'javascript' && hasJsTemplate && (
            <CodeEditor
              language="javascript"
              value={js}
              onChange={setJs}
              editable={true}
              isDark={isDark}
              placeholder="// Your JavaScript here"
            />
          )}
          {activeTab === 'preview' && (
            <PreviewPane key={`preview-${html.length}-${css.length}-${js.length}`} html={html} css={css} js={js} isDark={isDark} />
          )}
        </div>

      </div>

      {/* Test Results */}
      {testResults && shouldShowFeedback && (
        <TestResultsView results={testResults} isDark={isDark} />
      )}

      {/* Explanation */}
      {shouldShowFeedback && question.explanation && (
        <div className="mt-4 py-4">
          <p className="text-gray-700 dark:text-gray-200" style={isDark ? { color: '#e5e7eb' } : undefined}>
            <strong className="text-blue-900 dark:text-blue-200" style={isDark ? { color: '#bfdbfe' } : undefined}>
              Explanation:
            </strong>{' '}
            {formatQuestionText(question.explanation, isDark)}
          </p>
        </div>
      )}

      {/* Correct Answer Code - shown when revealed */}
      {shouldShowFeedback && (question.targetHtml || question.targetCss || question.targetJs) && (
        <div className="mt-6 py-4 border-t border-gray-300 dark:border-gray-700" style={isDark ? { borderColor: '#374151' } : undefined}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4" style={isDark ? { color: '#f9fafb' } : undefined}>
            Correct Answer:
          </h3>
          <div className="space-y-4">
            {question.targetHtml && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style={isDark ? { color: '#d1d5db' } : undefined}>
                  HTML:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-700" style={isDark ? { backgroundColor: '#111827', borderColor: '#374151' } : undefined}>
                  <code className="text-sm text-gray-900 dark:text-gray-100" style={isDark ? { color: '#e2e8f0' } : undefined}>
                    {question.targetHtml}
                  </code>
                </pre>
              </div>
            )}
            {question.targetCss && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style={isDark ? { color: '#d1d5db' } : undefined}>
                  CSS:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-700" style={isDark ? { backgroundColor: '#111827', borderColor: '#374151' } : undefined}>
                  <code className="text-sm text-gray-900 dark:text-gray-100" style={isDark ? { color: '#e2e8f0' } : undefined}>
                    {question.targetCss}
                  </code>
                </pre>
              </div>
            )}
            {question.targetJs && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" style={isDark ? { color: '#d1d5db' } : undefined}>
                  JavaScript:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-700" style={isDark ? { backgroundColor: '#111827', borderColor: '#374151' } : undefined}>
                  <code className="text-sm text-gray-900 dark:text-gray-100" style={isDark ? { color: '#e2e8f0' } : undefined}>
                    {question.targetJs}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
