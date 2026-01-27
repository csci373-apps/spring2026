"use client";

import { useRef, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import { QuizData, QuizQuestion } from './types';
import { stripMarkdown } from './utils';
import { TestResults } from './javascript-dom/types';

interface QuizReportProps {
  quizData: QuizData;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  studentName: string;
  incorrectQuestions: QuizQuestion[];
  selectedAnswers: { [questionId: string]: string | string[] | { html: string; css: string; js: string; testResults?: TestResults } };
  resourceSlug: string;
  onGeneratingChange: (generating: boolean) => void;
}

export interface QuizReportHandle {
  generateReport: () => Promise<void>;
}

const QuizReport = forwardRef<QuizReportHandle, QuizReportProps>(({
  quizData,
  score,
  totalQuestions,
  scorePercentage,
  studentName,
  incorrectQuestions,
  selectedAnswers,
  resourceSlug,
  onGeneratingChange,
}, ref) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    if (!reportRef.current) return;
    
    onGeneratingChange(true);
    try {
      // Clone the element and position it off-screen for capture (no flash)
      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 800px; visibility: visible; opacity: 1;';
      document.body.appendChild(clone);
      
      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        windowWidth: 800,
        windowHeight: clone.scrollHeight,
      });
      
      // Remove the clone
      document.body.removeChild(clone);
      
      // Convert to blob and download
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
      });
      
      if (!blob) {
        console.error('Failed to create blob');
        onGeneratingChange(false);
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quiz-report-${resourceSlug}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onGeneratingChange(false);
    } catch (error) {
      console.error('Error generating report:', error);
      if (reportRef.current) {
        // Restore original style on error
        reportRef.current.style.cssText = 'position: absolute; left: -9999px; top: -9999px; visibility: hidden;';
      }
      onGeneratingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    generateReport,
  }));

  // Determine achievement badge
  let badgeText = '';
  let badgeColor = '';
  
  if (scorePercentage === 100) {
    badgeText = 'Perfect Score!';
    badgeColor = '#f59e0b';
  } else if (scorePercentage >= 90) {
    badgeText = 'Excellent!';
    badgeColor = '#10b981';
  } else if (scorePercentage >= 80) {
    badgeText = 'Great Job!';
    badgeColor = '#3b82f6';
  } else if (scorePercentage >= 70) {
    badgeText = 'Good Effort!';
    badgeColor = '#f59e0b';
  } else {
    badgeText = 'Keep Practicing!';
    badgeColor = '#ef4444';
  }

  return (
    <>
      {/* Hidden Report Content for Export */}
      <div ref={reportRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden', width: '800px' }}>
        <div style={{ padding: '40px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif', width: '100%' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Quiz Report</h1>
          
          {quizData.quizName && (
            <div style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center', fontWeight: 'bold' }}>
              {quizData.quizName}
            </div>
          )}
          
          {/* Achievement Badge */}
          <div style={{ 
            marginBottom: '25px', 
            textAlign: 'center' 
          }}>
            <div style={{
              display: 'inline-blockt',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold',
              color: badgeColor
            }}>
              {badgeText}
            </div>
          </div>
          
          {studentName && (
            <div style={{ marginBottom: '20px', fontSize: '18px', textAlign: 'center' }}>
              <strong>Name:</strong> {studentName}
            </div>
          )}
          
          <div style={{ marginBottom: '30px', fontSize: '20px', textAlign: 'center' }}>
            <strong>Score:</strong> {score} / {totalQuestions} ({scorePercentage}%)
          </div>
          
          {incorrectQuestions.length === 0 ? (
            <div style={{ padding: '5px 5px 20px 5px', backgroundColor: '#d1fae5', borderRadius: '8px', marginTop: '20px', textAlign: 'center', fontSize: '18px' }}>
              Perfect score! All answers correct.
            </div>
          ) : (
            <div>
              <div style={{ marginTop: '30px', marginBottom: '20px', fontSize: '18px', textAlign: 'center' }}>
                You answered <strong>{score}</strong> out of <strong>{totalQuestions}</strong> questions correctly.
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px', marginBottom: '20px' }}>
                Incorrect Answers ({incorrectQuestions.length})
              </h2>
              
              {incorrectQuestions.map((question, index) => {
                const savedAnswer = selectedAnswers[question.id];
                
                // Handle JavaScript DOM questions
                if (question.type === 'javascript-dom') {
                  let selectedAnswerText = 'Not answered';
                  const correctAnswerText = 'All tests must pass';
                  
                  if (savedAnswer !== undefined && typeof savedAnswer === 'object' && savedAnswer !== null && 'testResults' in savedAnswer) {
                    const testResults = (savedAnswer as { testResults?: TestResults }).testResults;
                    if (testResults) {
                      const passedCount = testResults.results?.filter((r) => r.passed).length || 0;
                      const totalCount = testResults.results?.length || 0;
                      selectedAnswerText = `${passedCount} of ${totalCount} tests passed`;
                    } else {
                      selectedAnswerText = 'Code submitted but not tested';
                    }
                  }
                  
                  return (
                    <div key={question.id} style={{ marginBottom: '30px', padding: '20px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                        Question {index + 1}: {stripMarkdown(question.question)}
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#ef4444' }}>Your result:</strong> {selectedAnswerText}
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#10b981' }}>Required:</strong> {correctAnswerText}
                      </div>
                      
                      {question.explanation && (
                        <div style={{ marginTop: '15px', padding: '10px 5px 20px 5px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                          <strong>Explanation:</strong> {stripMarkdown(question.explanation)}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Handle multiple-choice questions
                const isMultiSelect = question.type === 'select-all' || Array.isArray(question.correct);
                
                // Format selected answer
                let selectedAnswerText = 'Not answered';
                if (savedAnswer !== undefined) {
                  if (Array.isArray(savedAnswer)) {
                    selectedAnswerText = savedAnswer.length > 0 
                      ? savedAnswer.map(text => stripMarkdown(text)).join(', ')
                      : 'Not answered';
                  } else if (typeof savedAnswer === 'string') {
                    selectedAnswerText = stripMarkdown(savedAnswer);
                  }
                }
                
                // Format correct answer
                let correctAnswerText = '';
                if (question.options && question.correct !== undefined) {
                  if (Array.isArray(question.correct)) {
                    const correctOptions = question.correct.map(idx => question.options![idx]);
                    correctAnswerText = correctOptions.map(text => stripMarkdown(text)).join(', ');
                  } else {
                    correctAnswerText = stripMarkdown(question.options[question.correct]);
                  }
                }
                
                return (
                  <div key={question.id} style={{ marginBottom: '30px', padding: '20px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                      Question {index + 1}: {stripMarkdown(question.question)}
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#ef4444' }}>Your answer:</strong> {selectedAnswerText}
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#10b981' }}>Correct answer:</strong> {correctAnswerText}
                    </div>
                    
                    {question.explanation && (
                      <div style={{ marginTop: '15px', padding: '10px 5px 20px 5px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                        <strong>Explanation:</strong> {stripMarkdown(question.explanation)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div style={{ marginTop: '30px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            Generated on {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
});

QuizReport.displayName = 'QuizReport';

export default QuizReport;
