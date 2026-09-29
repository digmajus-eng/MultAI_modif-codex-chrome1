(function () {
  'use strict';
  const G = window.__multaiGenericProvider;
  if (!G) { console.error('[multai-copilot] generic runtime missing'); return; }

  // Site-specific selectors. Keep these near the top: provider UIs change often.
  const S = {
    promptInput: [
      'textarea[placeholder*="Ask" i]',
      'textarea[placeholder*="message" i]',
      'textarea[placeholder*="search" i]',
      '[contenteditable="true"][role="textbox"]',
      '[contenteditable="true"]',
      'textarea',
      'input[type="search"]',
      'input[type="text"]'
    ],
    sendButton: [
      'button[aria-label*="Send" i]',
      'button[aria-label*="Submit" i]',
      'button[aria-label*="Search" i]',
      'button[type="submit"]',
      'form button'
    ],
    stopButton: [
      'button[aria-label*="Stop" i]',
      'button[aria-label*="Cancel" i]'
    ],
    fileInput: ['input[type="file"]'],
    dropTarget: ['form', 'main', 'body'],
    newChatLink: [
      'button[aria-label*="New chat" i]',
      'button[aria-label*="New conversation" i]',
      'a[aria-label*="New chat" i]',
      'a[href="/"]'
    ],
    lastResponse: [
      '[data-testid*="answer" i]',
      '[data-testid*="response" i]',
      '[data-message-author-role="assistant"]',
      'article[class*="answer" i]',
      'article[class*="response" i]',
      '[class*="assistant-message" i]',
      '[class*="markdown" i]'
    ],
    copyButton: [
      'button[aria-label*="Copy" i]', 'button[data-testid*="copy" i]'
    ]
  };

  G.register({ provider: 'copilot', selectors: S, homeUrl: 'https://copilot.cloud.microsoft/' });
})();
