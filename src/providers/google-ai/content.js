(function () {
  'use strict';
  const R = window.__multaiRuntime;
  if (!R) { console.error('[multai-google-ai] runtime missing'); return; }

  const PROVIDER = 'google-ai';
  const HOME_URL = 'https://www.google.com/ai';

  // These selectors intentionally target the AI Mode composer. Do not add a
  // generic input[type="text"] fallback here: on Google pages that commonly
  // resolves to the header search field, which accepts text but is not the
  // AI Mode prompt composer.
  const S = {
    promptInput: [
      'textarea[name="q"]',
      'input[name="q"]',
      'textarea[aria-label*="Ask" i]',
      'textarea[aria-label*="Search" i]',
      'input[aria-label*="Ask" i]',
      'input[aria-label*="Search" i]',
      '[role="textbox"][contenteditable="true"][aria-label*="Ask" i]',
      '[role="textbox"][contenteditable="true"][aria-label*="Search" i]',
      'form textarea',
      // AI Mode localizes its placeholder and may place the composer in an
      // open shadow root, so keep these structural fallbacks last.
      '[contenteditable="true"]',
      'textarea',
      'input[type="search"]',
      'input[type="text"]'
    ],
    sendButton: [
      'button[aria-label*="Submit" i]',
      'button[aria-label*="Send" i]',
      'button[aria-label*="Search" i]',
      'button[aria-label*="Отправ" i]',
      'button[aria-label*="Поиск" i]',
      'button[type="submit"]',
      'input[type="submit"]',
      'input[name="btnK"]'
    ],
    stopButton: [
      'button[aria-label*="Stop" i]',
      'button[aria-label*="Cancel" i]'
    ],
    newChatLink: [
      'a[href="/ai"]',
      'button[aria-label*="New chat" i]',
      'button[aria-label*="New search" i]'
    ],
    lastResponse: [
      '[data-attrid="wa:/description"]',
      '[data-attrid="wa:/ai_overview"]',
      '[data-attrid*="ai" i]',
      '[data-testid*="response" i]',
      '[role="main"] [data-content-feature*="AI" i]'
    ],
    copyButton: [
      'button[aria-label*="Copy" i]',
      'button[data-testid*="copy" i]'
    ]
  };

  function isEnabled(button) {
    return !!button && !button.disabled && button.getAttribute('aria-disabled') !== 'true' && R.isUsable(button);
  }

  function openRoots() {
    const roots = [document];
    const seen = new Set(roots);
    for (let index = 0; index < roots.length; index++) {
      const root = roots[index];
      const elements = root.querySelectorAll ? root.querySelectorAll('*') : [];
      for (const element of elements) {
        if (element.shadowRoot && !seen.has(element.shadowRoot)) {
          seen.add(element.shadowRoot);
          roots.push(element.shadowRoot);
        }
      }
    }
    return roots;
  }

  function promptScore(input) {
    const rect = input.getBoundingClientRect();
    const label = [
      input.getAttribute('aria-label'), input.getAttribute('placeholder'), input.name
    ].filter(Boolean).join(' ').toLowerCase();
    let score = 0;
    if (/ask|search|question|спрос|вопрос|задай/.test(label)) score += 100;
    if (input.matches('[contenteditable="true"], textarea')) score += 20;
    if (rect.width >= 260) score += 15;
    if (rect.top >= 100) score += 10;
    if (input.closest('main, [role="main"]')) score += 10;
    return score;
  }

  function findFirstDeep(selectors) {
    for (const root of openRoots()) {
      for (const selector of selectors) {
        try {
          for (const element of root.querySelectorAll(selector)) {
            if (isEnabled(element)) return element;
          }
        } catch (_) { /* continue with the next selector */ }
      }
    }
    return null;
  }

  function findPromptInput() {
    const candidates = [];
    const seen = new Set();
    for (const root of openRoots()) {
      for (const selector of S.promptInput) {
        try {
          for (const input of root.querySelectorAll(selector)) {
            if (R.isUsable(input) && !seen.has(input)) {
              seen.add(input);
              candidates.push(input);
            }
          }
        } catch (_) { /* continue with the next selector */ }
      }
    }
    candidates.sort((a, b) => promptScore(b) - promptScore(a));
    return candidates[0] || null;
  }

  function findSendButton(input) {
    // Google can render multiple search forms (header, page body, dialogs).
    // Prefer the submit control belonging to the composer we actually filled.
    const form = input.closest('form');
    if (form) {
      const button = R.findFirst(S.sendButton, form);
      if (isEnabled(button)) return button;
    }
    const composer = input.closest('[role="search"], [role="form"], form, main');
    if (composer) {
      const button = R.findFirst(S.sendButton, composer);
      if (isEnabled(button)) return button;
    }
    return findFirstDeep(S.sendButton);
  }

  async function probe() {
    const input = findPromptInput();
    return {
      ready: !!input,
      generating: !!R.findFirst(S.stopButton)
    };
  }

  async function broadcast({ prompt, files, skipSubmit }) {
    if (files?.length) throw new Error('Google AI Mode attachments are not supported yet');

    const input = await R.waitFor(findPromptInput, 15000);
    if (!input) throw new Error('Google AI Mode prompt input not found');

    console.info('[multai-google-ai] prompt input found', {
      tag: input.tagName,
      ariaLabel: input.getAttribute('aria-label'),
      placeholder: input.getAttribute('placeholder')
    });

    await R.setPrompt(input, prompt);
    if (skipSubmit) return;

    // Google enables the submit button asynchronously after it observes the
    // input event. Waiting for that state avoids the previous Enter fallback,
    // which left the prompt in the field without running it.
    const button = await R.waitFor(() => findSendButton(input), 10000, 80);
    if (!button) throw new Error('Google AI Mode send button never became ready');

    try {
      button.click();
      console.info('[multai-google-ai] prompt submitted');
    } catch (err) {
      throw new Error(`Google AI Mode send failed: ${err?.message || err}`);
    }
  }

  async function newChat() {
    const link = R.findFirstVisible(S.newChatLink);
    if (link) { link.click(); return; }
    location.assign(HOME_URL);
  }

  R.register({
    provider: PROVIDER,
    probe,
    broadcast,
    newChat,
    copyButtonSelectors: S.copyButton,
    lastResponseSelectors: S.lastResponse
  });
})();
