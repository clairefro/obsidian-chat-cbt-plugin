import axios from "axios";
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
		headers: {
		  Authorization: `Bearer ${apiKey}`,
		},
	  };

      try {
		const response: { data: { choices: { message: { content: string } }[] } } =
		await axios.post(url, data, headers);
  
	    return response.data.choices[0].message.content;
	  } catch(e) {
		throw e
	  }
	  
  }

  async _ollama_chat(messages: Message[], ollamaUrl: string): Promise<string> {
	const url = ollamaUrl.replace(/\/$/,"") + "/api/generate"
	// console.log({messages: messages.map(m => `${m.role}: ${m.content}`)})
    const data = {
		model: "mistral",
		prompt: JSON.stringify(messages),
		system: JSON.stringify(SYSTEM_MSG.content),
		stream: false
	  };
  
      try {
		const response: { data: { response: string } }  = await axios.post(url, data);
	    return response.data.response;
	  } catch(e) {
        throw e
	  }
  }
}
