import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Website } from '../types';
import { useWebsiteStore } from '../store/websiteStore';

interface Props {
  website: Website;
  isMainFrame?: boolean;
}

export const WebsiteFrame: React.FC<Props> = ({ website, isMainFrame }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isRecording, addAction } = useWebsiteStore();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // 注入事件监听脚本
        const script = doc.createElement('script');
        script.textContent = `
          (function() {
            window.addEventListener('click', function(e) {
              window.parent.postMessage({
                type: 'USER_ACTION',
                action: {
                  type: 'click',
                  selector: e.target.tagName.toLowerCase(),
                  timestamp: Date.now()
                }
              }, '*');
            }, true);

            window.addEventListener('input', function(e) {
              if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                window.parent.postMessage({
                  type: 'USER_ACTION',
                  action: {
                    type: 'input',
                    selector: e.target.tagName.toLowerCase(),
                    value: e.target.value,
                    timestamp: Date.now()
                  }
                }, '*');
              }
            }, true);

            window.addEventListener('message', function(event) {
              if (event.data.type === 'PLAYBACK_ACTION') {
                const action = event.data.action;
                if (action.type === 'click') {
                  const elements = document.getElementsByTagName(action.selector);
                  if (elements.length > 0) {
                    elements[0].click();
                  }
                } else if (action.type === 'input') {
                  const elements = document.getElementsByTagName(action.selector);
                  if (elements.length > 0 && (elements[0] instanceof HTMLInputElement || elements[0] instanceof HTMLTextAreaElement)) {
                    elements[0].value = action.value || '';
                    elements[0].dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }
              }
            });
          })();
        `;
        doc.body.appendChild(script);
      } catch (error) {
        console.error('Error injecting script:', error);
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (isMainFrame && event.data.type === 'USER_ACTION' && isRecording) {
        addAction(event.data.action);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isRecording, addAction, isMainFrame]);

  return (
    <Box 
      height="500px" 
      border="1px solid #ccc" 
      borderRadius={1} 
      overflow="hidden"
      sx={isMainFrame ? { borderColor: 'primary.main', borderWidth: 2 } : {}}
    >
      <iframe
        ref={iframeRef}
        src={website.url}
        title={website.title}
        width="100%"
        height="100%"
        data-website-id={website.id}
        style={{ border: 'none' }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </Box>
  );
};