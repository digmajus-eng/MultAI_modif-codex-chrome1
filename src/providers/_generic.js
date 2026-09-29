(function () {
  'use strict';
  const R = window.__multaiRuntime;
  if (!R || window.__multaiGenericProvider) return;

  async function registerGeneric(config) {
    const S = config.selectors;

    async function probe() {
      return {
        ready: !!R.findFirstVisible(S.promptInput),
        generating: !!R.findFirst(S.stopButton)
      };
    }

    async function broadcast({ prompt, files, skipSubmit }) {
      const input = await R.waitFor(() => R.findFirstVisible(S.promptInput), 15000);
      if (!input) throw new Error('prompt input not found');
      if (files?.length) {
        await R.attachFiles(files, S.fileInput, S.dropTarget);
        await R.wait(500);
      }
      await R.setPrompt(input, prompt);
      if (!skipSubmit) {
        await R.wait(100);
        await R.submit(input, S.sendButton);
      }
    }

    async function newChat() {
      const trigger = R.findFirstVisible(S.newChatLink);
      if (trigger) { trigger.click(); return; }
      location.assign(config.homeUrl || location.origin + '/');
    }

    R.register({
      provider: config.provider,
      probe,
      broadcast,
      newChat,
      copyButtonSelectors: S.copyButton,
      lastResponseSelectors: S.lastResponse
    });
  }

  window.__multaiGenericProvider = { register: registerGeneric };
})();
