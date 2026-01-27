"use client";

import { TestResults as TestResultsType } from './types';

interface TestResultsProps {
  results: TestResultsType;
  isDark?: boolean;
}

export default function TestResults({ results, isDark }: TestResultsProps) {
  if (!results.results || results.results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Test Results
        </h3>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            results.allPassed
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {results.allPassed ? 'All Passed' : 'Some Failed'}
        </span>
      </div>

      {results.executionError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
          <strong>Execution Error:</strong> {results.executionError}
        </div>
      )}

      <div className="space-y-2">
        {results.results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${
              result.passed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className={`text-lg ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                {result.passed ? '✓' : '✗'}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {result.description}
                </div>
                {!result.passed && (
                  <div className="mt-2 text-sm space-y-1">
                    {result.error && (
                      <div className="text-red-700 dark:text-red-300">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    {result.expected !== undefined && (
                      <div>
                        <strong>Expected:</strong>{' '}
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                          {JSON.stringify(result.expected)}
                        </code>
                      </div>
                    )}
                    {result.actual !== undefined && (
                      <div>
                        <strong>Got:</strong>{' '}
                        <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                          {JSON.stringify(result.actual)}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
