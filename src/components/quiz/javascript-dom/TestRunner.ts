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
    // Note: Firefox may not compute styles for hidden iframes (display: none)
    // We'll make it visible but off-screen to force style computation
    this.iframe = document.createElement('iframe');
    this.iframe.style.position = 'absolute';
    this.iframe.style.left = '-9999px';
    this.iframe.style.top = '-9999px';
    this.iframe.style.width = '1px';
    this.iframe.style.height = '1px';
    this.iframe.style.visibility = 'hidden';
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

      let resolved = false;
      const resolveOnce = (result: TestResults) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      };

      // Check if document is ready and stylesheets are loaded
      // Firefox may delay style computation in sandboxed srcdoc iframes until stylesheets are fully parsed
      const isDocumentReady = (): boolean => {
        if (!this.iframe?.contentDocument || !this.iframe?.contentWindow) {
          return false;
        }
        const doc = this.iframe.contentDocument;
        
        // Document must be complete and have a body
        if (doc.readyState !== 'complete' || !doc.body) {
          return false;
        }
        
        // Check if stylesheets are loaded (Firefox may need this for computed styles)
        try {
          const styleSheets = doc.styleSheets;
          let stylesLoaded = true;
          if (styleSheets.length > 0) {
            // Check if stylesheets are accessible (may throw in sandboxed iframes)
            for (let i = 0; i < styleSheets.length; i++) {
              try {
                void styleSheets[i].cssRules; // Accessing cssRules may throw if not loaded
              } catch (e) {
                // Stylesheet not accessible yet
                stylesLoaded = false;
                break;
              }
            }
          }
          
          // Force a reflow to trigger style computation in Firefox
          const testElement = doc.querySelector('p') || doc.body;
          if (testElement instanceof HTMLElement) {
            void testElement.offsetHeight;
          }
          
          // Proceed if stylesheets are loaded
          return stylesLoaded;
        } catch (e) {
          // If we can't check stylesheets, proceed anyway
          return true;
        }
      };

      const runTests = async () => {
        // Ensure iframe document is accessible
        if (!this.iframe?.contentDocument || !this.iframe?.contentWindow) {
          console.error('[TestRunner] Cannot access iframe document');
          resolveOnce({
            allPassed: false,
            results: [],
            executionError: 'Cannot access iframe document'
          });
          return;
        }

        let results: TestResult[];
        
        try {
          if (testCode) {
            // Execute JavaScript test code
            results = await this.runJavaScriptTests(testCode);
          } else if (testCases && testCases.length > 0) {
            // Execute legacy JSON test cases
            results = this.runTests(testCases);
          } else {
            console.error('[TestRunner] No tests provided');
            results = [{
              passed: false,
              description: 'No tests provided',
              error: 'No test cases or test code provided'
            }];
          }
          
          // Ensure results is an array and has the correct structure
          if (!Array.isArray(results)) {
            console.error('[TestRunner] Results is not an array:', results);
            results = [{
              passed: false,
              description: 'Test execution error',
              error: 'Invalid test results format'
            }];
          }
          
          const allPassed = results.length > 0 && results.every(r => r.passed);
          const testResults: TestResults = { allPassed, results };
          
          resolveOnce(testResults);
        } catch (error) {
          console.error('[TestRunner] Error in runTests:', error);
          resolveOnce({
            allPassed: false,
            results: [],
            executionError: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      };

      // Set up onload handler as a fallback (may not fire reliably in Firefox for srcdoc)
      this.iframe.onload = () => {
        if (isDocumentReady()) {
          // Add small delay to ensure scripts have executed
          setTimeout(() => {
            if (!resolved) {
              runTests().catch(error => {
                console.error('[TestRunner] Error in runTests from onload:', error);
                resolveOnce({
                  allPassed: false,
                  results: [],
                  executionError: error instanceof Error ? error.message : 'Unknown error'
                });
              });
            }
          }, 100);
        }
      };

      // Build and load HTML
      const fullHTML = this.buildHTML(html, css, js);
      this.iframe.srcdoc = fullHTML;

      // Poll for document ready state and computed styles (works in both Chrome and Firefox)
      // Firefox computes styles on-demand, so we need to wait for them
      let pollCount = 0;
      const maxPolls = 30; // 3 seconds max (30 * 100ms) - Firefox may need more time
      const pollInterval = setInterval(() => {
        pollCount++;
        if (isDocumentReady()) {
          clearInterval(pollInterval);
          // Add small delay to ensure scripts have executed
          setTimeout(() => {
            if (!resolved) {
              runTests().catch(error => {
                console.error('[TestRunner] Error in runTests from polling:', error);
                resolveOnce({
                  allPassed: false,
                  results: [],
                  executionError: error instanceof Error ? error.message : 'Unknown error'
                });
              });
            }
          }, 100);
        } else if (pollCount >= maxPolls) {
          console.error('[TestRunner] Max polls reached, document/styles still not ready');
          clearInterval(pollInterval);
          if (!resolved) {
            resolveOnce({
              allPassed: false,
              results: [],
              executionError: 'Document or styles did not become ready in time'
            });
          }
        }
      }, 100);

      // Timeout after 5 seconds as a safety net
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!resolved) {
          resolveOnce({
            allPassed: false,
            results: [],
            executionError: 'Test execution timed out'
          });
        }
      }, 5000);
    });
  }

  private buildHTML(html: string, css: string, js: string, imageData?: Record<string, string>): string {
    // Replace image src attributes with base64 data URIs if imageData is provided
    let processedHtml = html;
    if (imageData && Object.keys(imageData).length > 0) {
      // Use regex to find and replace img src attributes
      processedHtml = html.replace(/<img([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/gi, (match, before, src, after) => {
        // Extract filename from src (handle both "filename.jpg" and "images/filename.jpg")
        const filename = src.split('/').pop() || src;
        
        // If we have base64 data for this filename, replace the src
        if (imageData[filename]) {
          return `<img${before} src="${imageData[filename]}"${after}>`;
        }
        
        // Otherwise, return the original match
        return match;
      });
    }
    
    // Create image mapping script if imageData is provided
    // This intercepts when students set img.src = 'filename.jpg' and converts it to base64
    const imageMappingScript = imageData && Object.keys(imageData).length > 0 ? `
      // Map image filenames to base64 data URIs
      (function() {
        const imageMap = ${JSON.stringify(imageData)};
        
        // Intercept src property setter for all img elements
        const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src') || 
                                   Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(document.createElement('img'))), 'src');
        
        // Store original setter if it exists
        const originalSetter = originalDescriptor ? originalDescriptor.set : null;
        
        // Override the src setter
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          set: function(value) {
            // Extract filename from the value (handle paths like "images/cat.jpg" or "cat.jpg")
            const filename = value.split('/').pop() || value;
            
            // If this filename exists in our image map, use the base64 data URI
            if (imageMap[filename]) {
              // Store the original filename in a data attribute for testing
              this.setAttribute('data-original-src', filename);
              // Store the base64 URI in a hidden attribute
              this.setAttribute('data-base64-src', imageMap[filename]);
              // Use original setter if available, otherwise set directly
              if (originalSetter) {
                originalSetter.call(this, imageMap[filename]);
              } else {
                this.setAttribute('src', imageMap[filename]);
              }
            } else {
              // Not in our map, clear the data attributes and set normally
              this.removeAttribute('data-original-src');
              this.removeAttribute('data-base64-src');
              if (originalSetter) {
                originalSetter.call(this, value);
              } else {
                this.setAttribute('src', value);
              }
            }
          },
          get: function() {
            // If we have a stored original filename (set via our interceptor), return that
            // This allows tests to check img.src.endsWith('cat.jpg') and it will work
            const originalSrc = this.getAttribute('data-original-src');
            if (originalSrc) {
              return originalSrc;
            }
            // Otherwise return the actual src value
            return this.getAttribute('src') || '';
          },
          configurable: true
        });
        
        // Also intercept setAttribute('src', ...) calls for compatibility
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
          if (name === 'src' && this.tagName === 'IMG') {
            const filename = value.split('/').pop() || value;
            if (imageMap[filename]) {
              this.setAttribute('data-original-src', filename);
              return originalSetAttribute.call(this, name, imageMap[filename]);
            }
          }
          return originalSetAttribute.call(this, name, value);
        };
      })();
    ` : '';
    
    return `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>${processedHtml || ''}</body>
<script>
  ${imageMappingScript}
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

  // Normalize color values for cross-browser compatibility
  // Firefox may return "rgb(0,0,255)" while Chrome returns "rgb(0, 0, 255)"
  // We normalize to the format with spaces to match test expectations
  private normalizeColor(color: string): string {
    if (!color) return color;
    // Normalize rgb values: ensure spaces after commas
    // e.g., "rgb(0,0,255)" -> "rgb(0, 0, 255)"
    color = color.replace(/rgb\(([^)]+)\)/g, (match, content) => {
      const parts = content.split(',').map((p: string) => p.trim());
      return `rgb(${parts.join(', ')})`;
    });
    // Normalize rgba values: ensure spaces after commas
    color = color.replace(/rgba\(([^)]+)\)/g, (match, content) => {
      const parts = content.split(',').map((p: string) => p.trim());
      return `rgba(${parts.join(', ')})`;
    });
    return color.trim();
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
        
        // Normalize color values for cross-browser compatibility
        if (styleProp === 'color' || styleProp.toLowerCase() === 'color') {
          value = this.normalizeColor(value);
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

    // Helper to normalize color values for cross-browser compatibility
    // Firefox may return "rgb(0,0,255)" while Chrome returns "rgb(0, 0, 255)"
    // We normalize to the format with spaces to match test expectations
    const normalizeColor = (color: string): string => {
      if (!color) return color;
      // Normalize rgb values: ensure spaces after commas
      // e.g., "rgb(0,0,255)" -> "rgb(0, 0, 255)"
      color = color.replace(/rgb\(([^)]+)\)/g, (match, content) => {
        const parts = content.split(',').map((p: string) => p.trim());
        return `rgb(${parts.join(', ')})`;
      });
      // Normalize rgba values: ensure spaces after commas
      color = color.replace(/rgba\(([^)]+)\)/g, (match, content) => {
        const parts = content.split(',').map((p: string) => p.trim());
        return `rgba(${parts.join(', ')})`;
      });
      return color.trim();
    };

    // Helper to get computed style property
    // In Firefox with sandboxed srcdoc iframes, we need to force a reflow to trigger style computation
    const getComputedStyleValue = (element: Element, property: string): string => {
      const win = element.ownerDocument?.defaultView || window;
      if (!win) return '';
      try {
        // Force a reflow to trigger style computation in Firefox
        // This is necessary for sandboxed srcdoc iframes where styles may not be computed until accessed
        if (element instanceof HTMLElement) {
          // Accessing offsetHeight forces a layout calculation
          void element.offsetHeight;
          // Also try accessing the element's style to trigger computation
          void element.style;
        }
        
        const computed = win.getComputedStyle(element as HTMLElement);
        const camelCaseProp = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        let value: string;
        if (camelCaseProp in computed) {
          value = (computed as CSSStyleDeclaration & Record<string, string>)[camelCaseProp];
        } else {
          value = computed.getPropertyValue(property) || computed.getPropertyValue(camelCaseProp);
        }
        
        // If value is still empty, try waiting a bit and accessing again
        // (Firefox may need a moment to compute styles in sandboxed iframes)
        if (!value && property === 'color') {
          // Force another reflow
          if (element instanceof HTMLElement) {
            void element.offsetWidth;
          }
          // Try accessing again
          if (camelCaseProp in computed) {
            value = (computed as CSSStyleDeclaration & Record<string, string>)[camelCaseProp];
          } else {
            value = computed.getPropertyValue(property) || computed.getPropertyValue(camelCaseProp);
          }
        }
        
        // Normalize color values for cross-browser compatibility
        if (property === 'color' || property.toLowerCase() === 'color') {
          return normalizeColor(value || '');
        }
        // Return empty string if value is not available (let tests handle it)
        return value || '';
      } catch (e) {
        console.error('[TestRunner] Error getting computed style:', e, 'property:', property);
        // If we can't access computed styles, return empty string
        return '';
      }
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
      getComputedStyle: (element: Element | null, property: string) => {
        if (!element) {
          const errorMsg = `Element is null when getting computed style for property: ${property}`;
          console.error('[TestRunner] getComputedStyle error:', errorMsg);
          testResults.push({
            passed: false,
            description: errorMsg,
            error: errorMsg
          });
          throw new Error(errorMsg);
        }
        // Return computed style value (may be empty string if not computed yet)
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
            // If we get here without any assertions, that's a problem
            return 'completed';
          } catch (e) {
            // Re-throw to be caught by outer try-catch
            throw e;
          }
        })();
        `
      );

      await testFunction(testUtils);
      
      // If no test results were generated, the test code might not have run any assertions
      // This could happen if there was an early error or the code didn't execute
      if (testResults.length === 0) {
        testResults.push({
          passed: false,
          description: 'No test results generated',
          error: 'Test code executed but produced no results. The test code may have failed before any assertions were made, or no assertions were executed. Check the browser console for errors.'
        });
      }
    } catch (error) {
      // If an assertion failed or there was an error, it's already in testResults
      // But if it's a different error, add it
      if (testResults.length === 0 || !testResults[testResults.length - 1]?.error) {
        testResults.push({
          passed: false,
          description: 'Test execution error',
          error: error instanceof Error ? `${error.message}${error.stack ? '\n' + error.stack : ''}` : String(error)
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
