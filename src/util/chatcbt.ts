import axios from "axios";
import { requestUrl } from "obsidian";
import systemPrompt from "../prompts/system";
import summaryPrompt from "../prompts/summary";


export interface Message {
  role: string;
  content: string;
}

export type Mode = 'openai' | 'ollama'
export interface ChatInput {
	apiKey: string | undefined;
	messages: Message[];
	isSummary: boolean | undefined;
	mode: Mode
	ollamaUrl: string | undefined
}



const SYSTEM_MSG = { role: "system", content: systemPrompt };
const SUMMARY_MSG = { role: "user", content: summaryPrompt };

export class ChatCbt {
  constructor() {}

  async chat({ apiKey, messages, isSummary = false, mode = 'openai', ollamaUrl }: ChatInput): Promise<string> {


	const resolvedMsgs = [...messages]

	if (isSummary){
	  resolvedMsgs.push(SUMMARY_MSG)
	}

	let response = ''

    /** validations should be guaranteed from parent layer, based on mode. Re-validating here to appease typescript gods */
    if (mode === 'openai' && !!apiKey) {
	  const openAiMsgs = [SYSTEM_MSG, ...resolvedMsgs]
	  response = await this._openai_chat(openAiMsgs, apiKey)
	} else if (mode === 'ollama' && !!ollamaUrl) {
	  response = await this._ollama_chat(resolvedMsgs, ollamaUrl)
	}

	
    return response;
  }

  async _openai_chat(messages: Message[], apiKey: string): Promise<string> {
	const url = "https://api.openai.com/v1/chat/completions";

    const data = {
		model: "gpt-3.5-turbo",
		messages,
		temperature: 0.7,
	  };
  
	const headers = {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json"
	};

	const options = {
		url, 
		method: "POST",
		body: JSON.stringify(data),
		headers: headers as unknown as Record<string, string>
	}

	const response: { json: { choices: { message: { content: string } }[] } } = await requestUrl(options);

	return response.json.choices[0].message.content;
  }

  async _ollama_chat(messages: Message[], ollamaUrl: string): Promise<string> {
	const url = ollamaUrl.replace(/\/$/,"") + "/api/generate"

	const data = {
		model: "mistral",
		prompt: JSON.stringify(messages),
		system: JSON.stringify(SYSTEM_MSG.content),
		stream: false
	};

	const options = {
		url, 
		method: "POST",
		body: JSON.stringify(data),
	}
  
	const response: { json: { response: string } }  = await requestUrl(options);
	return response.json.response;
  }
}
