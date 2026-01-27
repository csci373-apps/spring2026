import { JavaScriptDOMTestCase, TestResult, TestResults } from './types';

export class TestRunner {
  private iframe: HTMLIFrameElement | null = null;
  private cleanupFn: (() => void) | null = null;

  async executeTests(
    html: string,
    css: string,
    js: string,
    testCases?: JavaScriptDOMTestCase[],
    testCode?: string
  ): Promise<TestResults> {
    // Cleanup previous iframe
    if (this.cleanupFn) {
      this.cleanupFn();
    }

    // Create sandboxed iframe
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.sandbox.add('allow-scripts');
    this.iframe.sandbox.add('allow-same-origin');
    this.iframe.sandbox.add('allow-forms');
    document.body.appendChild(this.iframe);

    this.cleanupFn = () => {
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      this.iframe = null;
    };

    return new Promise((resolve) => {
      if (!this.iframe) {
        resolve({
          allPassed: false,
          results: [],
          executionError: 'Failed to create iframe'
        });
        return;
      }

      this.iframe.onload = () => {
        // Add a small delay to ensure the iframe's JavaScript has fully executed
        // This is important because the script tag needs time to run
        setTimeout(async () => {
          try {
            let results: TestResult[];
            if (testCode) {
              // Execute JavaScript test code
              results = await this.runJavaScriptTests(testCode);
            } else if (testCases && testCases.length > 0) {
              // Execute legacy JSON test cases
              results = this.runTests(testCases);
            } else {
              results = [{
                passed: false,
                description: 'No tests provided',
                error: 'No test cases or test code provided'
              }];
            }
            const allPassed = results.every(r => r.passed);
            resolve({ allPassed, results });
          } catch (error) {
            resolve({
              allPassed: false,
              results: [],
              executionError: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }, 100); // Give 100ms for scripts to execute
      };

      // Build and load HTML
      const fullHTML = this.buildHTML(html, css, js);
      this.iframe.srcdoc = fullHTML;

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.iframe) {
          resolve({
            allPassed: false,
            results: [],
            executionError: 'Test execution timed out'
          });
        }
      }, 5000);
    });
  }

  private buildHTML(html: string, css: string, js: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>${html || ''}</body>
<script>
  ${js || ''}
</script>
</html>`;
  }

  private runTests(testCases: JavaScriptDOMTestCase[]): TestResult[] {
    if (!this.iframe) {
      return testCases.map(tc => ({
        passed: false,
        description: tc.description,
        error: 'Iframe not available'
      }));
    }

    const doc = this.iframe.contentDocument;
    const win = this.iframe.contentWindow;

    if (!doc || !win) {
      return testCases.map(tc => ({
        passed: false,
        description: tc.description,
        error: 'Cannot access iframe document'
      }));
    }

    // Run tests sequentially to ensure state persists between tests
    const results: TestResult[] = [];
    for (const testCase of testCases) {
      try {
        let result: TestResult;
        if (testCase.type === 'dom-check') {
          result = this.runDOMCheck(doc, testCase);
        } else if (testCase.type === 'event-simulation') {
          result = this.runEventSimulation(doc, testCase);
        } else if (testCase.type === 'function-call') {
          result = this.runFunctionCall(win, testCase);
        } else {
          result = {
            passed: false,
            description: testCase.description,
            error: 'Unknown test type'
          };
        }
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          description: testCase.description,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    return results;
  }

  private runDOMCheck(doc: Document, testCase: JavaScriptDOMTestCase): TestResult {
    if (!testCase.selector || !testCase.property) {
      return {
        passed: false,
        description: testCase.description,
        error: 'Missing selector or property'
      };
    }

    const element = doc.querySelector(testCase.selector);
    
    if (testCase.property === 'exists') {
      const passed = element !== null;
      return {
        passed,
        description: testCase.description,
        expected: true,
        actual: element !== null
      };
    }

    if (!element) {
      return {
        passed: false,
        description: testCase.description,
        expected: testCase.expected,
        error: `Element not found: ${testCase.selector}`
      };
    }

    const value = this.getPropertyValue(element, testCase.property!);
    // Normalize grid template values for comparison
    const normalizedValue = (typeof value === 'string' && 
      (testCase.property?.includes('gridTemplateColumns') || 
       testCase.property?.includes('gridTemplateRows'))) 
      ? this.normalizeGridTemplateValue(value) 
      : value;
    const normalizedExpected = (typeof testCase.expected === 'string' && 
      (testCase.property?.includes('gridTemplateColumns') || 
       testCase.property?.includes('gridTemplateRows'))) 
      ? this.normalizeGridTemplateValue(testCase.expected) 
      : testCase.expected;
    const passed = JSON.stringify(normalizedValue) === JSON.stringify(normalizedExpected);

    return {
      passed,
      description: testCase.description,
      expected: testCase.expected,
      actual: value
    };
  }

  private runEventSimulation(doc: Document, testCase: JavaScriptDOMTestCase): TestResult {
    if (!testCase.event || !testCase.event.selector) {
      return {
        passed: false,
        description: testCase.description,
        error: 'Missing event selector'
      };
    }

    // First, set any input values if specified (before triggering the main event)
    if (testCase.event.setInputs) {
      for (const input of testCase.event.setInputs) {
        const inputElement = doc.querySelector(input.selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!inputElement) {
          return {
            passed: false,
            description: testCase.description,
            error: `Input element not found: ${input.selector}`
          };
        }
        // Set the value directly - this is the standard way
        inputElement.value = input.value;
        
        // Verify the value was set correctly
        if (inputElement.value !== input.value) {
          return {
            passed: false,
            description: testCase.description,
            error: `Failed to set input value: expected "${input.value}", got "${inputElement.value}"`
          };
        }
        
        // Trigger input event to ensure any listeners are notified
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        inputElement.dispatchEvent(inputEvent);
        
        // Also trigger change event
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        inputElement.dispatchEvent(changeEvent);
      }
      // Small delay to ensure input values are set and any handlers have run
      // Use a longer delay to ensure all synchronous code has executed
      const startTime = Date.now();
      while (Date.now() - startTime < 50) {
        // Wait to ensure value is set and any handlers have executed
      }
    }

    const element = doc.querySelector(testCase.event.selector) as HTMLElement;
    if (!element) {
      return {
        passed: false,
        description: testCase.description,
        error: `Element not found: ${testCase.event.selector}`
      };
    }

    // Simulate the event
    this.simulateEvent(element, testCase.event);

    // Event handlers are synchronous, but give a moment for any microtasks
    // Use a longer delay for submit events to ensure handlers execute
    const delay = testCase.event.delay || (testCase.event.type === 'submit' ? 150 : 10);
    const startTime = Date.now();
    while (Date.now() - startTime < delay) {
      // Busy-wait to ensure event handlers execute
    }
    
    if (testCase.thenCheck) {
      const checkElement = doc.querySelector(testCase.thenCheck.selector);
      if (!checkElement) {
        return {
          passed: false,
          description: testCase.description,
          error: `Check element not found: ${testCase.thenCheck.selector}`
        };
      }

      const value = this.getPropertyValue(checkElement, testCase.thenCheck.property);
      // Normalize grid template values for comparison
      const normalizedValue = (typeof value === 'string' && 
        (testCase.thenCheck.property.includes('gridTemplateColumns') || 
         testCase.thenCheck.property.includes('gridTemplateRows'))) 
        ? this.normalizeGridTemplateValue(value) 
        : value;
      const normalizedExpected = (typeof testCase.thenCheck.expected === 'string' && 
        (testCase.thenCheck.property.includes('gridTemplateColumns') || 
         testCase.thenCheck.property.includes('gridTemplateRows'))) 
        ? this.normalizeGridTemplateValue(testCase.thenCheck.expected) 
        : testCase.thenCheck.expected;
      const passed = JSON.stringify(normalizedValue) === JSON.stringify(normalizedExpected);

      return {
        passed,
        description: testCase.description,
        expected: testCase.thenCheck.expected,
        actual: value
      };
    }

    return {
      passed: true,
      description: testCase.description
    };
  }

  private runFunctionCall(win: Window, testCase: JavaScriptDOMTestCase): TestResult {
    if (!testCase.functionName) {
      return {
        passed: false,
        description: testCase.description,
        error: 'Missing function name'
      };
    }

    const func = (win as Window & Record<string, unknown>)[testCase.functionName] as ((...args: unknown[]) => unknown) | undefined;
    if (typeof func !== 'function') {
      return {
        passed: false,
        description: testCase.description,
        error: `Function ${testCase.functionName} not found or not a function`
      };
    }

    const result = func(...(testCase.args || []));
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedReturn);

    return {
      passed,
      description: testCase.description,
      expected: testCase.expectedReturn as string | number | boolean | null | undefined,
      actual: result as string | number | boolean | null | undefined
    };
  }

  private getPropertyValue(element: Element, property: string): string | number | boolean | null | undefined {
    // Handle computed styles (e.g., "computedStyle.display", "computedStyle.gridTemplateColumns")
    if (property.startsWith('computedStyle.')) {
      const styleProp = property.replace('computedStyle.', '');
      const doc = element.ownerDocument;
      const win = doc?.defaultView || window;
      if (win) {
        const computed = win.getComputedStyle(element as HTMLElement);
        // Handle camelCase properties (e.g., flexDirection) and kebab-case (e.g., flex-direction)
        const camelCaseProp = styleProp.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        let value: string;
        // Try camelCase first (for direct property access)
        if (camelCaseProp in computed) {
          value = (computed as CSSStyleDeclaration & Record<string, string>)[camelCaseProp];
        } else {
          // Fall back to getPropertyValue for kebab-case
          value = computed.getPropertyValue(styleProp) || computed.getPropertyValue(camelCaseProp);
        }
        
        // Normalize grid-template-columns/rows values
        // Browsers expand repeat(3, 1fr) to "1fr 1fr 1fr", so we normalize both formats
        if (styleProp === 'gridTemplateColumns' || styleProp === 'grid-template-columns' ||
            styleProp === 'gridTemplateRows' || styleProp === 'grid-template-rows') {
          return this.normalizeGridTemplateValue(value);
        }
        
        return value;
      }
      return undefined;
    }

    // Handle nested properties like 'style.display'
    const parts = property.split('.');
    let value: unknown = element;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }
      value = (value as Record<string, unknown>)[part];
    }

    // Handle special cases
      if (property.startsWith('classList.contains(')) {
        const className = property.match(/classList\.contains\(['"](.*?)['"]\)/)?.[1];
        if (className) {
          return (element as HTMLElement).classList.contains(className);
        }
      }
      
      // Convert unknown to return type
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
        return value;
      }
      return undefined;
  }

  // Normalize grid template values to handle both "repeat(3, 1fr)" and "1fr 1fr 1fr" formats
  private normalizeGridTemplateValue(value: string): string {
    if (!value) return value;
    
    // If it's already in repeat() format, return as-is
    if (value.includes('repeat(')) {
      return value;
    }
    
    // If it's in expanded format (e.g., "1fr 1fr 1fr"), try to convert to repeat() format
    const parts = value.trim().split(/\s+/);
    if (parts.length > 0 && parts.every(p => p === parts[0])) {
      // All parts are the same, convert to repeat format
      const count = parts.length;
      const unit = parts[0];
      return `repeat(${count}, ${unit})`;
    }
    
    // If parts are different, return as-is (can't normalize)
    return value;
  }

  private simulateEvent(element: HTMLElement, event: NonNullable<JavaScriptDOMTestCase['event']>): void {
    switch (event.type) {
      case 'click':
        element.click();
        break;
      case 'input':
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.value = event.value || '';
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
        break;
      case 'change':
        if (element instanceof HTMLInputElement || 
            element instanceof HTMLSelectElement || 
            element instanceof HTMLTextAreaElement) {
          if (event.value !== undefined) {
            element.value = event.value;
          }
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        break;
      case 'submit':
        if (element instanceof HTMLFormElement) {
          // Create a submit event that can be prevented
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          // Dispatch the event - this will trigger all submit event listeners
          const notPrevented = element.dispatchEvent(submitEvent);
          // Note: Even if preventDefault() is called, the event handlers will have executed
        } else {
          // If selector points to something inside a form, find and submit the form
          const form = element.closest('form');
          if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
          }
        }
        break;
      case 'focus':
        element.focus();
        element.dispatchEvent(new Event('focus', { bubbles: true }));
        break;
      case 'blur':
        element.blur();
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        break;
    }
  }

  private async runJavaScriptTests(testCode: string): Promise<TestResult[]> {
    if (!this.iframe) {
      return [{
        passed: false,
        description: 'Test execution failed',
        error: 'Iframe not available'
      }];
    }

    const doc = this.iframe.contentDocument;
    const win = this.iframe.contentWindow;

    if (!doc || !win) {
      return [{
        passed: false,
        description: 'Test execution failed',
        error: 'Cannot access iframe document'
      }];
    }

    // Create test results array that will be populated by assertions
    const testResults: TestResult[] = [];
    
    // Helper to normalize grid template values
    const normalizeGridTemplateValue = (value: string): string => {
      if (!value) return value;
      if (value.includes('repeat(')) return value;
      const parts = value.trim().split(/\s+/);
      if (parts.length > 0 && parts.every(p => p === parts[0])) {
        return `repeat(${parts.length}, ${parts[0]})`;
      }
      return value;
    };

    // Helper to get computed style property
    const getComputedStyleValue = (element: Element, property: string): string => {
      const win = element.ownerDocument?.defaultView || window;
      if (!win) return '';
      const computed = win.getComputedStyle(element as HTMLElement);
      const camelCaseProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      if (camelCaseProp in computed) {
        return (computed as CSSStyleDeclaration & Record<string, string>)[camelCaseProp];
      }
      return computed.getPropertyValue(property) || computed.getPropertyValue(camelCaseProp);
    };

    // Helper to get property value (supports nested properties and computed styles)
    const getPropertyValue = (element: Element, property: string): string | number | boolean | null | undefined => {
      if (property.startsWith('computedStyle.')) {
        const styleProp = property.replace('computedStyle.', '');
        let value = getComputedStyleValue(element, styleProp);
        if (styleProp === 'gridTemplateColumns' || styleProp === 'grid-template-columns' ||
            styleProp === 'gridTemplateRows' || styleProp === 'grid-template-rows') {
          value = normalizeGridTemplateValue(value);
        }
        return value;
      }
      
      const parts = property.split('.');
      let value: unknown = element;
      for (const part of parts) {
        if (value === null || value === undefined) return undefined;
        value = (value as Record<string, unknown>)[part];
      }
      
      if (property.startsWith('classList.contains(')) {
        const className = property.match(/classList\.contains\(['"](.*?)['"]\)/)?.[1];
        if (className) {
          return (element as HTMLElement).classList.contains(className);
        }
      }
      
      // Convert unknown to return type
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
        return value;
      }
      return undefined;
    };

    // Create test utilities object
    const testUtils = {
      document: doc,
      window: win,
      query: (selector: string) => doc.querySelector(selector),
      queryAll: (selector: string) => doc.querySelectorAll(selector),
      assert: (condition: boolean, message: string) => {
        if (!condition) {
          testResults.push({
            passed: false,
            description: message,
            error: `Assertion failed: ${message}`
          });
          throw new Error(message);
        } else {
          testResults.push({
            passed: true,
            description: message
          });
        }
      },
      wait: (ms: number) => {
        return new Promise<void>((resolve) => {
          const startTime = Date.now();
          const checkInterval = setInterval(() => {
            if (Date.now() - startTime >= ms) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 1);
        });
      },
      getComputedStyle: (element: Element, property: string) => {
        return getComputedStyleValue(element, property);
      },
      setInputValue: (selector: string, value: string) => {
        const element = doc.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!element) {
          throw new Error(`Input element not found: ${selector}`);
        }
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      },
      getPropertyValue: getPropertyValue,
      normalizeGridTemplateValue: normalizeGridTemplateValue
    };

    // Wrap test code in an async function and execute it
    try {
      // Create a function that executes the test code with test utilities
      // The test code is wrapped in an async IIFE so it can use await
      const testFunction = new Function(
        'testUtils',
        `
        const { document, window, query, queryAll, assert, wait, getComputedStyle, setInputValue, getPropertyValue, normalizeGridTemplateValue } = testUtils;
        return (async function() {
          try {
            ${testCode}
          } catch (e) {
            // Re-throw to be caught by outer try-catch
            throw e;
          }
        })();
        `
      );

      await testFunction(testUtils);
    } catch (error) {
      // If an assertion failed or there was an error, it's already in testResults
      // But if it's a different error, add it
      if (testResults.length === 0 || !testResults[testResults.length - 1].error) {
        testResults.push({
          passed: false,
          description: 'Test execution error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return testResults;
  }

  cleanup(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
  }
}
