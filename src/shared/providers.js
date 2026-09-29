export const PROVIDERS = [
  { id: 'chatgpt',  label: 'ChatGPT',   url: 'https://chatgpt.com/',          temporaryUrl: 'https://chatgpt.com/?temporary-chat=true',   origin: 'https://chatgpt.com',       hasContentScript: true },
  { id: 'claude',   label: 'Claude',    url: 'https://claude.ai/new',         temporaryUrl: 'https://claude.ai/new?incognito',            origin: 'https://claude.ai',         hasContentScript: true },
  { id: 'gemini',   label: 'Gemini',    url: 'https://gemini.google.com/app', temporaryUrl: 'https://gemini.google.com/app#temporary-chat',      origin: 'https://gemini.google.com', hasContentScript: true },
  { id: 'grok',     label: 'Grok',      url: 'https://grok.com/',             temporaryUrl: 'https://grok.com/#private',                        origin: 'https://grok.com',          hasContentScript: true },
  { id: 'meta',     label: 'Meta AI',   url: 'https://www.meta.ai/',                                                                      origin: 'https://www.meta.ai',       hasContentScript: true },
  { id: 'deepseek', label: 'DeepSeek',  url: 'https://chat.deepseek.com/',                                                                origin: 'https://chat.deepseek.com', hasContentScript: true },
  { id: 'qwen',     label: 'Qwen',      url: 'https://chat.qwen.ai/',         temporaryUrl: 'https://chat.qwen.ai/?temporary-chat=true',  origin: 'https://chat.qwen.ai',      hasContentScript: true },
  { id: 'gigachat', label: 'GigaChat',  url: 'https://giga.chat/',             origin: 'https://giga.chat',          hasContentScript: true },
  { id: 'alice',    label: 'Alice',     url: 'https://alice.yandex.ru/',      origin: 'https://alice.yandex.ru',    altOrigins: ['https://ya.ru'], hasContentScript: true },
  { id: 'kimi',     label: 'Kimi',      url: 'https://www.kimi.ai/',          origin: 'https://www.kimi.ai',        altOrigins: ['https://kimi.ai'], hasContentScript: true },
  { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/',  origin: 'https://www.perplexity.ai',  altOrigins: ['https://perplexity.ai'], hasContentScript: true },
  { id: 'zai',      label: 'Z.ai',      url: 'https://chat.z.ai/',            origin: 'https://chat.z.ai',          hasContentScript: true },
  { id: 'yuanbao',  label: 'Yuanbao',   url: 'https://yuanbao.tencent.com/chat/naQivTmsDa/', origin: 'https://yuanbao.tencent.com', hasContentScript: true },
  { id: 'google-ai', label: 'Google AI Mode', url: 'https://www.google.com/',  origin: 'https://www.google.com',     hasContentScript: true },
  { id: 'brave-search', label: 'Brave Search', url: 'https://search.brave.com/', origin: 'https://search.brave.com', hasContentScript: true },
  { id: 'mistral',  label: 'Mistral',   url: 'https://chat.mistral.ai/chat',  origin: 'https://chat.mistral.ai',    altOrigins: ['https://mistral.ai', 'https://www.mistral.ai'], hasContentScript: true },
  { id: 'copilot',  label: 'Microsoft Copilot', url: 'https://copilot.cloud.microsoft/', origin: 'https://copilot.cloud.microsoft', hasContentScript: true },
  { id: 'yandex-search', label: 'Yandex Search', url: 'https://yandex.com/',  origin: 'https://yandex.com',         altOrigins: ['https://www.yandex.com', 'https://yandex.ru', 'https://www.yandex.ru', 'https://dzen.ru'], hasContentScript: true }
];

export const DEFAULT_CREW = ['chatgpt', 'claude', 'gemini', 'grok'];

export function getProvider(id) {
  return PROVIDERS.find(p => p.id === id);
}
