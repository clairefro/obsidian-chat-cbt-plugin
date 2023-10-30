import axios from "axios";
import systemPrompt from "../prompts/system";

interface Message {
  role: string;
  content: string;
}

const SYSTEM_MSG = { role: "system", content: systemPrompt };

export class ChatCbt {
  constructor() {}

  async chat(apiKey: string, messages: Message[]): Promise<string> {
    const url = "https://api.openai.com/v1/chat/completions";

    const data = {
      model: "gpt-3.5-turbo",
      messages: [SYSTEM_MSG, ...messages],
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

  async usage(apiKey: string, date: string /* YYYY-MM-DD */) {
	const url = `https://api.openai.com/v1/usage?date=${date}`;

    const headers = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const response: { data: { choices: { message: { content: string } }[] } } =
      await axios.get(url, headers);

    return response.data;
  }
}
