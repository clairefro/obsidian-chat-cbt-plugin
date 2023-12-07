# ChatCBT

An AI-powered journaling assistant for [Obsidian](https://obsidian.md/), inspired by cognitive behavioral therapy (CBT). 

Install from [here](https://obsidian.md/plugins?search=chatcbt) 
## Demo

ChatCBT is a journaling assitant that prods you to reframe negative thoughts and rewire your reactions to distressful situations ([\*disclaimer](https://github.com/clairefro/obsidian-chat-cbt-plugin#disclaimer)). 

### Start chatting in a note

![chat-gif](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/3b25b29e-ba86-4d39-b76f-fea17a75fe34)

### Summarize your findings when you're ready

![summary-gif](https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/27130199-4398-4861-bef7-924bc9f979d2)

## Features
- Available any time of day or night
- Get kind and objective responses to help yourself uncover negative thinking patterns and see situations from healthier angles
- Conversations are stored privately in local files on your computer 
- Automatically summarize your reframed thoughts in a table to inspire affirmations. 
- Choose how your data is handled: use either a cloud-based AI service (OpenAI), or a 100% local and private service (Ollama).
- Less than two cents per journal session if using OpenAI, or FREE if using Ollama

## Setup

To get started using ChatCBT, you need to configure an AI platform connection from the ChatCBT plugin settings menu.

<img width="941" alt="image" src="https://github.com/clairefro/obsidian-chat-cbt-plugin/assets/9841162/bbe7a24a-be60-43c4-91ae-c90711ecc7d7">

You have two options:

- **OpenAI** - a paid cloud service
- **Ollama** - a free local service

**OpenAI** is recommended for conversation quality and speed, with the cavaet that it is a paid service, and that your messages are sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy).

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

Treat your OpenAI API Keys like a password - do not share this publicly. For your safety, your OpenAI API key is encrypted when saving settings.

Note that with the OpenAI option enabled, your messages will be sent to OpenAI. See [OpenAI's data privacy policy](https://openai.com/policies/privacy-policy). To minimize chances of association of messages with you personally, I crafted the prompt to respond to a "fictional client". As you can guess, this is not foolproof. Try to stick to your emotions, and avoid disclosing any sensitive personal info like real names of people or your home address.

### Ollama setup

[Ollama](https://ollama.ai/) is a client that allows you to easily run powerful open source LLM models locally on your machine for free.

**System requirements**

- Available for:
  - MacOS Big Sur or later
  - Linux
  - (Windows coming soon, check their site)
- 4.5GB of storage
  - Ollama: 500 MB
  - Mistral model: 4GB
- At least 8GB of RAM, ideally

1. [download ollama](https://ollama.ai/)
2. download `mistral` model: in terminal, run `ollama pull mistral`
3. Start local server: in terminal, run `OLLAMA_ORIGINS="*" OLLAMA_HOST="0.0.0.0:11434" ollama serve`
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

## Develop 

You can install and enable ChatCBT in developer mode via these steps:

1. In Obsidian, make sure you have [enabled Community Plugins]([url](https://help.obsidian.md/Extending+Obsidian/Plugin+security#Restricted+mode)) 
2. In your terminal, navigate to the Obsidian vault (directory) on your computer where you'd like to use ChatCBT
3. `cd .obsidian`
4. `cd plugins` (if `plugins` directory doesn't exist, create one: `mkdir plugins`, then `cd plugins`)
5. `git clone git@github.com:clairefro/obsidian-chat-cbt-plugin.git`
6. Install dependences: `npm i`
7. Run plugin `npm run dev`
8. Navigate back to Obsidian settings, add ChatCBT plugin and enable it
9. Follow setup instructions below
    
## Disclaimer

ChatCBT is not a replacement for actual therapy or human interaction. Instead, ChatCBT should be thought of as a journaling assistant, similar to an interactive  worksheet. It is a bot that responds with objective questions to your writing help you get out of your head and see your problems from other angles. 

While the bot draws inspiration from general cognitive-behavioral therapy methods, it has not undergone review or approval by licensed therapists. Though I have personally found ChatCBT useful in managing negative thoughts, it's important to note that this bot was built by someone without domain expertise in pyschology. Also note that AI generates unpredictable responses. You are responsible for using your own discretion in determining whether or not this tool is useful for you. Conisder seeking help from a professional therapist. 

You can see the exact prompts that the bot is using to generate responses here: [chat](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/system.ts) and [summarize](https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/src/prompts/summary.ts).

I'm happy to hear about any issues you encounter with the bot in the Issues tab, or through a DM to `@clairefroe` on Twitter/X.
