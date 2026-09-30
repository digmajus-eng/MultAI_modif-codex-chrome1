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
    sendButton: [
      'button[type="submit"]',
      'input[type="submit"]',
      'button[aria-label*="Найти" i]',
      'button[aria-label*="Поиск" i]'
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

  function isEnabled(button) {
    return !!button && !button.disabled && button.getAttribute('aria-disabled') !== 'true' && R.isUsable(button);
  }

  function findInput() {
    return R.findFirstVisible(S.promptInput);
  }

  function findSubmitButton(input) {
    const form = input.closest('form');
    if (form) {
      const button = R.findFirst(S.sendButton, form);
      if (isEnabled(button)) return button;
    }
    const button = R.findFirstVisible(S.sendButton);
    return isEnabled(button) ? button : null;
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

    const button = await R.waitFor(() => findSubmitButton(input), 5000, 80);
    const form = input.closest('form');
    if (form?.requestSubmit) {
      // Calling click() on Yandex's visual button can update its UI without
      // submitting a subsequent query. requestSubmit() follows the browser's
      // form-submit path and reaches Yandex's search handler reliably.
      form.requestSubmit(button?.form === form ? button : undefined);
      console.info('[multai-yandex-search] query submitted through form');
      return;
    }
    if (button) {
      button.click();
      console.info('[multai-yandex-search] query submitted');
      return;
    }
    throw new Error('Yandex Search submit button not found');
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
