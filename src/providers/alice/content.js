(function () {
  'use strict';
  const G = window.__multaiGenericProvider;
  if (!G) { console.error('[multai-alice] generic runtime missing'); return; }

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

  const SIDEBAR_COLLAPSE = [
    'button[aria-label*="Скрыть боковую панель" i]',
    'button[aria-label*="Свернуть боковую панель" i]',
    'button[aria-label*="Скрыть историю" i]',
    'button[title*="Скрыть боковую панель" i]',
    '[data-testid*="sidebar-toggle" i][aria-expanded="true"]'
  ];

  function collapseSidebar() {
    const button = R.findFirstVisible(SIDEBAR_COLLAPSE);
    if (!button) return false;
    try {
      button.click();
      console.info('[multai-alice] sidebar collapsed');
      return true;
    } catch (_) {
      return false;
    }
  }

  // Alice can re-render its navigation after sign-in or an internal route
  // change. Keep trying until it is collapsed, without touching it again once
  // the matching expanded-state control has disappeared.
  function watchSidebar() {
    let done = collapseSidebar();
    if (done) return;
    const observer = new MutationObserver(() => {
      if (collapseSidebar()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

  watchSidebar();

  G.register({ provider: 'alice', selectors: S, homeUrl: 'https://alice.yandex.ru/' });
})();
