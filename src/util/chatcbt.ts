import { requestUrl } from 'obsidian';
import summaryPrompt from '../prompts/summary';
import {
	OPENAI_DEFAULT_MODEL,
	DEEPSEEK_DEFAULT_MODEL,
	AI_PROVIDERS,
} from '../constants';
import { Notice } from 'obsidian';

const defaultPromptPrefix = (lang: string) =>
	`Respond to the user in ${lang}.\n`;

export interface Message {
	role: string;
	content: string;
}

export type Mode = AI_PROVIDERS;
export interface ChatInput {
	openAiApiKey: string | undefined;
	deepseekApiKey: string | undefined;
	messages: Message[];
	isSummary: boolean | undefined;
	mode: Mode;
	ollamaUrl: string | undefined;
	model: string | undefined;
	language: string;
	prompt: string;
}

export class ChatCbt {
	constructor() {}

	async chat({
		openAiApiKey,
		deepseekApiKey,
		messages,
		isSummary = false,
		mode = AI_PROVIDERS.OPENAI,
		ollamaUrl,
		model,
		language,
		prompt,
	}: ChatInput): Promise<string> {
		if (!model) {
			new Notice('Please select a model from the settings');
		}

		const SYSTEM_MSG = {
			role: 'system',
			content: defaultPromptPrefix(language) + prompt,
		};
		const SUMMARY_MSG = { role: 'user', content: summaryPrompt(language) };

		const resolvedMsgs = [...messages];

		if (isSummary) {
			resolvedMsgs.push(SUMMARY_MSG);
		}

		let response = '';

		const msgs = [SYSTEM_MSG, ...resolvedMsgs];

		/** validations should be guaranteed from parent layer, based on mode. Re-validating here to appease typescript gods */
		if (mode === AI_PROVIDERS.OPENAI && !!openAiApiKey) {
			const url = 'https://api.openai.com/v1/chat/completions';
			response = await this._chat(
				url,
				msgs,
				openAiApiKey,
				model || OPENAI_DEFAULT_MODEL,
			);
		} else if (mode === AI_PROVIDERS.OLLAMA && !!ollamaUrl) {
			const url = ollamaUrl.replace(/\/$/, '') + '/v1/chat/completions';
			response = await this._chat(url, msgs, 'ollama', model || '');
		} else if (mode === AI_PROVIDERS.DEEPSEEK && !!deepseekApiKey) {
			const url = 'https://api.deepseek.com/v1/chat/completions';
			response = await this._chat(
				url,
				msgs,
				deepseekApiKey,
				model || DEEPSEEK_DEFAULT_MODEL,
			);
		}

		return response;
	}

	async _chat(
		url: string,
		messages: Message[],
		apiKey: string,
		model: string | undefined,
	): Promise<string> {
		const data = {
			model,
			messages,
			temperature: 0.7,
		};

		const headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		};

		const options = {
			url,
			method: 'POST',
			body: JSON.stringify(data),
			headers: headers as unknown as Record<string, string>,
		};

		const response: {
			json: { choices: { message: { content: string } }[] };
		} = await requestUrl(options);

		return response.json.choices[0].message.content;
	}

	static async getAvailableOllamaModels(ollamaUrl: string): Promise<string[]> {
		try {
			const url = `${ollamaUrl.replace(/\/$/, '')}/api/tags`;

			const options = {
				url,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const response: {
				json: { models: { name: string }[] };
			} = await requestUrl(options);

			return response.json.models.map((model) => model.name);
		} catch (error) {
			console.error('Failed to fetch Ollama models:', error);
			return [];
		}
	}
}
