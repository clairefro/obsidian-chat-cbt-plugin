# ChatCBT

An AI-powered journaling assistant for [Obsidian](https://obsidian.md/), inspired by cognitive behavioral therapy (CBT).

**[Install](https://obsidian.md/plugins?search=chatcbt)**

<a href="https://www.buymeacoffee.com/clairefro"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a potato&emoji=🍠&slug=clairefro&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

## Demo

ChatCBT is a journaling assistant that prods you to reframe negative thoughts and rewire your reactions to distressful situations ([\*disclaimer](https://github.com/clairefro/obsidian-chat-cbt-plugin#disclaimer)).

## Features

- Desktop or Mobile
- Supports 60+ languages
- Local or cloud AI models
- Editable prompt

### Start chatting in a note

![chat-gif](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/3b25b29e-ba86-4d39-b76f-fea17a75fe34)

### Summarize your findings when you're ready

![summary-gif](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/27130199-4398-4861-bef7-924bc9f979d2)

## Features

- Available any time of day or night
- Get kind and objective responses to help yourself uncover negative thinking patterns and see situations from other angles to help you move forward
- Conversations are stored privately in local files on your computer
- Automatically summarize your reframed thoughts in a table to inspire affirmations.
- Choose how your data is handled: use either a cloud-based AI service (OpenAI/Deepseek), or a 100% local and private service (Ollama).
- Less than a penny per journal session if using OpenAI or Deepseek, or FREE if using Ollama
- Edit the system prompt to your liking (ex: "Speak to me as Carl Jung")

You can keep your local conversations and affirmations as a diary, or even share them with a therapist.

## Setup

To get started using ChatCBT, you need to configure an AI platform connection from the ChatCBT plugin settings menu.

<img width="1090" alt="image" src="https://github.com/user-attachments/assets/ed3a5986-b508-4fab-8d8d-1368f6c742ec" />

You have three options:

- **OpenAI** - a paid cloud service
- **Deepseek** - a paid cloud service
- **Ollama** - a free local service

**OpenAI** is recommended for conversation quality and speed, with the cavaet that it is a paid service, and that your messages are sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy).

### Choosing a model

ChatCBT defaults to the following models for each platform mode. You can manually override the model in the ChatCBT settings. See available [OpenAI models](https://platform.openai.com/docs/models) (note that some are more costly than others) and [Ollama models](https://ollama.ai/library).

| Platform                 | Default model      | Cost         | Hosting         | Speed   | Quality   |
| ------------------------ | ------------------ | ------------ | --------------- | ------- | --------- |
| **OpenAI** (recommended) | `gpt-4o-mini`      | Paid (cheap) | Cloud           | Fast ⚡ | Excellent |
| **Deepseek**             | `deepseek-chat`    | Paid (cheap) | Cloud           | Fast ⚡ | Excellent |
| **Ollama**               | downloaded models | Free         | Local (private) | OK      | Great     |

### OpenAI setup (Cloud)

[OpenAI](https://openai.com/about) is a cloud AI provider created by a U.S.-based AI research lab backed by Microsoft.

While use of OpenAI costs money, it is cheap (as of June 2025). Chat sessions with ChatCBT cost less than a few cents.

To use OpenAI with ChatCBT:

1. [Create](https://auth0.openai.com/u/signup) an OpenAI account
2. Add a payment method to your account, and add a small credit (ex: $10 = roughly 500 ChatCBT sessions!)
3. Generate an API Key [here](https://platform.openai.com/api-keys) and copy it to your clipboard
4. Set your OpenAI API Key in ChatCBT plugin settings (visibile when OpenAI provider is selected)

Treat your OpenAI API Keys like a password - do not share this publicly. For your safety, your OpenAI API key is encrypted when saving settings.

_**Note:** With the OpenAI option enabled, your messages will be sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy). To minimize chances of your messages being associated with you personally, I crafted the default prompt to respond to a "fictional client" such that it looks like you are creating fake scenarios. As you can guess, this is not foolproof. Try to stick to your emotions, and avoid disclosing any sensitive personal info like real names of people or your home address._

If you prefer to use a different [OpenAI model](https://platform.openai.com/docs/models), you can specify in the plugin settings.

### Deepseek setup (Cloud)

[Deepseek](https://api-docs.deepseek.com/quick_start/pricing) is a cloud AI provider backed by a Chinese research team.

While use of Deepseek costs money, it is cheap (as of June 2025). Chat sessions with ChatCBT cost less than a few cents.

To use Deepseek with ChatCBT:

1. [Create](https://platform.deepseek.com/sign_up) a Deepseek account
2. Add a payment method to your account, and add a small credit of a couple dollars
3. Generate an API Key [here](https://platform.deepseek.com/api_keys) and copy it to your clipboard
4. Set your Deepseek API Key in ChatCBT plugin settings (visibile when Deepseek provider is selected)

Treat your Deepseek API Keys like a password - do not share this publicly. For your safety, your Deepseek API key is encrypted when saving settings.

_**Note:** With the Deepseek provider enabled, your messages will be sent to Deepseek. See [Deepseeks's data privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html). To minimize chances of your messages being associated with you personally, I crafted the default prompt to respond to a "fictional client" such that it looks like you are creating fake scenarios. As you can guess, this is not foolproof. Try to stick to your emotions, and avoid disclosing any sensitive personal info like real names of people or your home address._

As of June 2025, there are only two available Deepseek chat models: `deepseek-chat` (default, recommended) and `deepseek-reason`.

### Ollama setup (Local and private)

[Ollama](https://ollama.ai/) is a client that allows you to easily run powerful open source LLM models locally on your machine privately for free.

Requires Ollama v0.1.24 or higher

**System requirements**

- Available for:
  - MacOS Big Sur or later
  - Linux
  - Windows
- 2.5GB of storage (depending on model you choose)
  - Ollama: 500 MB
  - llama2 model (recommended): ~2GB
- At least 8GB of RAM, ideally

1. [download ollama](https://ollama.ai/) (Get Ollama v0.1.24 or higher)
2. download a [model](https://ollama.com/search) such as `llama2`: in terminal, run `ollama pull llama2`
3. Start local server. In terminal, run `ollama serve`
4. Ensure "Ollama" is selected as the AI provider in ChatCBT settings

_(Troubleshooting: if you have trouble getting Ollama to run with Obsidian, stop the Ollama server and try running wtih `OLLAMA_ORIGINS="*" OLLAMA_HOST="0.0.0.0:11434"`)_

This will start a local server that hosts your Ollama instance locally on your computer from port `11434`. For advanced users, you can change the port or url if you like. Just be sure to update the Ollama url in the ChatCBT settings.

If you prefer to use a different [Ollama model](https://ollama.ai/library), you can specify in the plugin settings.

## Usage

1. Start a new note
2. Type what's bothering you
3. Run "Chat" from ChatCBT
4. Chat with ChatGPT by adding your responses at the bottom of the file
5. Keep chatting to start reframing your negative thoughts
6. Once you are ready to sum up your conversation, run "Summarize" to create a table outlining your reframed thoughts

### Running commands

You can run the "Chat" and "Summarize" commands from the left ribbon menu or the command pallette.

**Ribbon menu**

<img width="368" alt="image" src="https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/1ab0126b-48de-48c4-b33d-45896334651c">

**Command pallete (`cmd` + `p` > search "chat...")**

<img width="777" alt="image" src="https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/ea32ec43-dd9e-4def-87f2-64ee59b9f849">

**Slash command**

Enable slash commands from the Obsidian Core Plugins, and you can type `/chat` or `/summarize` inline to access ChatCBT actions in your notes.

## Edit Prompt

You can update the system prompt (or restore it to the default) from Settings.

<img width="1080" alt="image" src="https://github.com/user-attachments/assets/5f18f29f-dfbe-4002-9020-df7fac3dca0a" />

_The response will honor the Preferred Language setting, regardless of the language of the prompt._

## Preferred Language (Beta)

Select the language you prefer ChatCBT to repsond in from the Settings. Raise an issue if you run into any quality concerns, or would like to request a language!

<img width="1091" alt="image" src="https://github.com/user-attachments/assets/9a0022b6-93b9-4b94-82f3-0dd17e1005b0" />

## Contributing

You can install and enable ChatCBT in developer mode via these steps:

1. In Obsidian, make sure you have [enabled Community Plugins](<[url](https://help.obsidian.md/Extending+Obsidian/Plugin+security#Restricted+mode)>)
2. In your terminal, navigate to the Obsidian vault (directory) on your computer where you'd like to use ChatCBT
3. `cd .obsidian`
4. `cd plugins` (if `plugins` directory doesn't exist, create one: `mkdir plugins`, then `cd plugins`)
5. `git clone git@github.com:clairefro/obsidian-chat-cbt-plugin.git`
6. Install dependences: `npm i`
7. Run plugin `npm run dev`
8. Navigate back to Obsidian settings, add ChatCBT plugin and enable it
9. Follow setup instructions below

## Disclaimer

ChatCBT is not a replacement for actual therapy or human interaction. Instead, ChatCBT should be thought of as a journaling assistant, similar to an interactive worksheet. It is a bot that responds with objective questions to your writing help you get out of your head and see your problems from other angles.

While the bot draws inspiration from general cognitive-behavioral therapy methods, it has not undergone review or approval by licensed therapists. Though I have personally found ChatCBT useful in managing negative thoughts, it's important to note that this bot was built by someone without domain expertise in pyschology. Also note that AI generates unpredictable responses. You are responsible for deciding whether or not this tool is useful for you. Conisder seeking help from a professional therapist.

You can see the prompts that the bot uses to generate responses here: [chat](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/system.ts) and [summarize](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/summary.ts).

**The creator is not liable for your physical, mental or spiritual health, whether you are using the default prompt or a custom prompt**

I'm happy to hear about any issues you encounter with the bot in the Issues tab, or through a DM to `@clairefroe` on Twitter/X.
