export interface JavaScriptDOMTestCase {
  type: 'dom-check' | 'event-simulation' | 'function-call';
  description: string;
  
  // For dom-check
  selector?: string;
  property?: string;  // 'textContent', 'style.display', 'classList.contains', etc.
  expected?: string | number | boolean | null;
  
  // For event-simulation
  event?: {
    type: 'click' | 'input' | 'change' | 'submit' | 'focus' | 'blur';
    selector: string;
    value?: string;
    delay?: number;  // ms to wait after event
    // Optional: set input values before triggering the event (useful for form submissions)
    setInputs?: Array<{
      selector: string;
      value: string;
    }>;
  };
  thenCheck?: {
    selector: string;
    property: string;
    expected: string | number | boolean | null;
  };
  
  // For function-call
  functionName?: string;
  args?: unknown[];
  expectedReturn?: unknown;  // Renamed to avoid conflict with dom-check expected
}

export interface JavaScriptDOMQuestion {
  id: string;
  question: string;
  type: 'javascript-dom';
  htmlTemplate?: string;
  cssTemplate?: string;
  codeTemplate?: string;
  targetHtml?: string;  // HTML for the target example students should recreate
  targetCss?: string;  // CSS for the target example students should recreate
  targetJs?: string;    // Optional JS for the target example
  instructions?: string;  // Additional instructions shown below target output
  testCases?: JavaScriptDOMTestCase[];  // Legacy JSON format (optional for backward compatibility)
  testCode?: string;  // JavaScript test code (new format)
  explanation?: string;
}

export interface TestResult {
  passed: boolean;
  description: string;
  expected?: string | number | boolean | null;
  actual?: string | number | boolean | null;
  error?: string;
}

export interface TestResults {
  allPassed: boolean;
  results: TestResult[];
  executionError?: string;
}
