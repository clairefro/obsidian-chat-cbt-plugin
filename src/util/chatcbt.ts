import axios from "axios";
import systemPrompt from "../prompts/system";
import summaryPrompt from "../prompts/summary";

export interface Message {
  role: string;
  content: string;
}

const SYSTEM_MSG = { role: "system", content: systemPrompt };
const SUMMARY_MSG = { role: "user", content: summaryPrompt };

export class ChatCbt {
  constructor() {}

  async chat(apiKey: string, messages: Message[], isSummary: boolean = false): Promise<string> {
    const url = "https://api.openai.com/v1/chat/completions";

	const resolvedMsgs = [SYSTEM_MSG, ...messages]

	if (isSummary){
	  resolvedMsgs.push(SUMMARY_MSG)
	}

    const data = {
      model: "gpt-3.5-turbo",
      messages: resolvedMsgs,
      temperature: 0.7,
    };

    const headers = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const response: { data: { choices: { message: { content: string } }[] } } =
      await axios.post(url, data, headers);

    return response.data.choices[0].message.content;
  }
}
