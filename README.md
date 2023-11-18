# ChatCBT

An AI-powered Cognitive Behavioral Therapist plugin for Obsidian

## Demo

Chat with ChatCBT any hour of the day to help reframe your negative thoughts and rewire your reactions to distressful circumstances. Your conversations are stored in local files on your computer you can use as a diary, or even share with a therapist. (see [disclaimer](<![untitled-2x](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/3b25b29e-ba86-4d39-b76f-fea17a75fe34)>))

### Start chatting in a note

![untitled-2x](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/3b25b29e-ba86-4d39-b76f-fea17a75fe34)

### Summarize your findings when you're ready

![summary](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/27130199-4398-4861-bef7-924bc9f979d2)

## Setup

To get started using ChatCBT, you need to configure an AI platform connection from the ChatCBT plugin settings menu.

You have two options: a paid cloud service (OpenAI) or free local service (Ollama).

OpenAI is recommended for conversation quality and speed, with the cavaet that it is a paid service and that your messages are sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy).

### Choosing a model

| Platform                 | Model           | Cost         | Hosting         | Speed   | Quality   |
| ------------------------ | --------------- | ------------ | --------------- | ------- | --------- |
| **OpenAI** (recommended) | `gpt-3.5-turbo` | Paid (cheap) | Cloud           | Fast ⚡ | Excellent |
| **Ollama**               | `mistral`       | Free         | Local (private) | OK      | Good      |

### OpenAI setup

[OpenAI](https://openai.com/about) provides cloud based AI solutions, including the models that power ChatGPT.

While use of OpenAI costs money, it is cheap (as of Nov 2023). Chat sessions with ChatCBT cost less than a few 2-4 cents.

To use OpenAI with ChatCBT:

1. [Create](https://auth0.openai.com/u/signup) an OpenAI account
2. Add a payment method to your account
3. Generate an API Key [here](https://platform.openai.com/api-keys) and copy it to your clipboard
4. Set your OpenAI API Key in ChatCBT plugin settings
5. Ensure "Ollama mode" is disabled in ChatCBT plugin settings

Treat your OpenAI API Keys like a password - do not share this publicaly. For your safety, your OpenAI API key is encrypted when saving settings.

Note that with the OpenAI option enabled, your messages will be sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy). To minimize chances of association of messages with you personally, I crafted the prompt to respond to a "fictional client". As you can guess, this is not foolproof. Try to stick to your emotions, and avoid disclosing any sensitive personal info like real names of people or your home address.

### Ollama setup

[Ollama](https://ollama.ai/) is a client that allows you to easily run powerful open source LLM models locally on your machine.

**System requirements**

- Available for:
  - MacOS Big Sur or later
  - Linux
  - (Windows coming soon, check their site)
- ~4.5GB of storage
  - Ollama: ~500 MB
  - Mistral model: ~4GB
- At least 8GB of RAM, ideally

1. [download ollama](https://ollama.ai/)
2. download `mistral` model: in terminal, run in terminal `ollama pull mistral`
3. Start local server by running this command in terminal `OLLAMA_ORIGINS="*" OLLAMA_HOST="0.0.0.0:11434" ollama serve`
4. Ensure "Ollama mode" is enabled in ChatCBT settings

This will start a local server that hosts your Ollama instance locally on your computer from port `11434`. You can change the port if you like by editing the `OLLAMA_HOST` property in step 3 - just be sure to also update the `Ollama URL` in the ChatCBT plugin settings too. The `OLLAMA_ORIGINS='*'` allows Obsidian to talk to Ollama.

## Usage

1. Start a new note
2. Type what's bothering you
3. Run "Chat" from ChatCBT
4. You can converse with ChatGPT by adding additional responses at the bottom of the file
5. Chat enough back and forth to start reframing your negative thoughts
6. Once you are ready to sum up your conversation, run "Summarize" for create a table outlining your reframed thoughts

### Running commands

You can run the "Chat" and "Summarize" commands from the left ribbon menu or the command pallette.

**Ribbon menu**

<img width="368" alt="image" src="https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/1ab0126b-48de-48c4-b33d-45896334651c">

**Command pallete (`cmd` + `p` > search "chat...")**

<img width="777" alt="image" src="https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/ea32ec43-dd9e-4def-87f2-64ee59b9f849">

## Disclaimer

I am not a licensed therapist, and ChatCBT is not a replacement for actual therapy. Instead, ChatCBT should be thought of as an assistant similar to an interactive CBT worksheet. It is a bot that responds with objective questions to help you see your problems from other angles. You can see the exact AI prompts that the bot is using here: [chat](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/system.ts) and [summarize](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/summary.ts).

While I've tested out ChatCBT and found it personally useful in unprogramming negative thoughts, please note that AI produces inherently unpredictable responses. You are responsible for using your own discretion in interpreting responses from the bot, and determining whether this tool is useful for you.

I'm happy to hear about any issues you encounter with the bot in the Issues tab, or through a DM to `@clairefroe` on Twitter/X.
