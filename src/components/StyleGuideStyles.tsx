'use client';

import { useEffect } from 'react';

export default function StyleGuideStyles() {
  useEffect(() => {
    // Wait for next tick to ensure DOM is ready
    const addStylesheets = () => {
      // Add utility classes stylesheet
      if (!document.getElementById('utility-classes-stylesheet')) {
        const utilityLink = document.createElement('link');
        utilityLink.rel = 'stylesheet';
        utilityLink.href = '/fall2025/downloads/project/solutions/utility-classes.css';
        utilityLink.id = 'utility-classes-stylesheet';
        document.head.appendChild(utilityLink);
      }
      
      // Add demo stylesheet
      if (!document.getElementById('style-guide-demo-stylesheet')) {
        const demoLink = document.createElement('link');
        demoLink.rel = 'stylesheet';
        demoLink.href = '/fall2025/downloads/project/solutions/style-guide-demo.css';
        demoLink.id = 'style-guide-demo-stylesheet';
        document.head.appendChild(demoLink);
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is fully ready
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        requestAnimationFrame(addStylesheets);
      });
    }
    
    // Cleanup on unmount
    return () => {
      const existingUtility = document.getElementById('utility-classes-stylesheet');
      const existingDemo = document.getElementById('style-guide-demo-stylesheet');
      if (existingUtility) existingUtility.remove();
      if (existingDemo) existingDemo.remove();
    };
  }, []);

  return null;
}

