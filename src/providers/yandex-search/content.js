(function () {
  'use strict';
  const G = window.__multaiGenericProvider;
  if (!G) { console.error('[multai-yandex-search] generic runtime missing'); return; }

  // Site-specific selectors. Keep these near the top: provider UIs change often.
  const S = {
    promptInput: [
      // Yandex Search's primary query input.
      'input[name="text"]',
      'textarea[name="text"]',
      'input[aria-label*="Search" i]',
      'input[aria-label*="Поиск" i]',
      'input[placeholder*="Find" i]',
      'input[placeholder*="Найдётся" i]',
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
      'form[action*="search"] button[type="submit"]',
      'form[role="search"] button[type="submit"]',
      'button[aria-label*="Search" i]',
      'button[aria-label*="Найти" i]',
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

  G.register({ provider: 'yandex-search', selectors: S, homeUrl: 'https://yandex.com/' });
})();
