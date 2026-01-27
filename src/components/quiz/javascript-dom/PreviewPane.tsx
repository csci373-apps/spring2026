"use client";

import { useEffect, useRef, useState } from 'react';

interface PreviewPaneProps {
  html: string;
  css: string;
  js: string;
  isDark?: boolean;
}

export default function PreviewPane({ html, css, js, isDark }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  const updateIframe = (iframe: HTMLIFrameElement | null) => {
    if (iframe) {
      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>${html || ''}</body>
<script>${js || ''}</script>
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
<script>${js || ''}</script>
</html>`;
      
      iframe.srcdoc = fullHTML;
    }
  };

  const refresh = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 flex justify-between items-center flex-shrink-0">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
        <button
          onClick={refresh}
          className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>
      <div className="flex-1 min-h-0" style={{ overflow: 'auto' }}>
        <iframe
          key={key}
          ref={setIframeRef}
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="w-full h-full border-0"
          title="Code preview"
        />
      </div>
    </div>
  );
}
