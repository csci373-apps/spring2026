"use client";

import { useEffect, useRef } from 'react';

interface TargetPreviewProps {
  html: string;
  css: string;
  js?: string;
  isDark?: boolean;
}

export default function TargetPreview({ html, css, js, isDark }: TargetPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframe = (iframe: HTMLIFrameElement | null) => {
    if (iframe) {
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>${html || ''}</body>
${js ? `<script>${js || ''}</script>` : ''}
</html>`;
      
      iframe.srcdoc = fullHTML;
    }
  };

  useEffect(() => {
    // Update when values change
    updateIframe(iframeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js]);

  const setIframeRef = (iframe: HTMLIFrameElement | null) => {
    iframeRef.current = iframe;
    // Update immediately when iframe is mounted
    if (iframe) {
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>${html || ''}</body>
${js ? `<script>${js || ''}</script>` : ''}
</html>`;

      iframe.srcdoc = fullHTML;
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-blue-50 dark:bg-blue-900 px-3 py-2 flex justify-between items-center flex-shrink-0 border-b border-blue-200 dark:border-blue-700">
        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          Target Output
        </span>
        <span className="text-xs text-blue-700 dark:text-blue-300 italic">
          (Reference - what you should create)
        </span>
      </div>
      <div className="flex-1 min-h-0" style={{ overflow: 'auto' }}>
        <iframe
          ref={setIframeRef}
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="w-full h-full border-0"
          title="Target output preview"
        />
      </div>
    </div>
  );
}
