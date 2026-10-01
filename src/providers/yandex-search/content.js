(function () {
  'use strict';
  const R = window.__multaiRuntime;
  if (!R) { console.error('[multai-yandex-search] runtime missing'); return; }

  const PROVIDER = 'yandex-search';
  const S = {
    promptInput: [
      'form[role="search"] input[name="text"]',
      'form[action*="search"] input[name="text"]',
      'input[name="text"]',
      'textarea[name="text"]',
      'input[aria-label*="Поиск" i]',
      'input[placeholder*="Найдётся" i]'
    ],
    stopButton: [
      'button[aria-label*="Stop" i]',
      'button[aria-label*="Cancel" i]'
    ],
    lastResponse: [
      '[data-testid*="answer" i]',
      '[data-testid*="response" i]',
      'article[class*="answer" i]',
      '[class*="serp-item"]'
    ],
    copyButton: ['button[aria-label*="Copy" i]', 'button[data-testid*="copy" i]']
  };

  function findInput() {
    return R.findFirstVisible(S.promptInput);
  }

  function setSearchValue(input, text) {
    // Yandex replaces the search form after navigation. Dispatch a real
    // InputEvent after the native value setter so its controlled field updates
    // on the second and later searches as well as the initial one.
    R.setTextareaValue(input, text);
    try {
      input.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertText',
        data: text
      }));
    } catch (_) { /* the plain input event above remains sufficient */ }
  }

  async function probe() {
    return {
      ready: !!findInput(),
      generating: !!R.findFirst(S.stopButton)
    };
  }

  async function broadcast({ prompt, files, skipSubmit }) {
    if (files?.length) throw new Error('Yandex Search attachments are not supported');
    const input = await R.waitFor(findInput, 15000);
    if (!input) throw new Error('Yandex Search input not found');

    setSearchValue(input, prompt);
    if (skipSubmit) return;

    // Search results can replace Yandex's form while retaining a visual input.
    // Navigating to the documented search URL is deterministic for every query
    // and avoids relying on a stale React button handler after the first one.
    const url = new URL('/search/', location.origin);
    url.searchParams.set('text', prompt);
    console.info('[multai-yandex-search] navigating to submitted query');
    location.assign(url.href);
  }

  async function newChat() {
    location.assign('https://yandex.com/');
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
