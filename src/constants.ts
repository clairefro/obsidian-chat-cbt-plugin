const CHAT_AGENT_MARKER = '**ChatCBT:**';
const CHAT_DELIMETER = '\n\n---\n\n';
const OPENAI_DEFAULT_MODEL = 'gpt-4o-mini';
const OLLAMA_DEFAULT_MODEL = 'mistral';
const DEEPSEEK_DEFAULT_MODEL = 'deepseek-chat';

enum AI_PROVIDERS {
	OPENAI = 'openai',
	OLLAMA = 'ollama',
	DEEPSEEK = 'deepseek',
}

export {
	CHAT_AGENT_MARKER,
	CHAT_DELIMETER,
	OPENAI_DEFAULT_MODEL,
	OLLAMA_DEFAULT_MODEL,
	DEEPSEEK_DEFAULT_MODEL,
	AI_PROVIDERS,
};
