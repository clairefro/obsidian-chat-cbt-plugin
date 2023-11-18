# ChatCBT

> An AI-powered Cognitive Behavioral Therapist plugin for Obsidian

TODO: GIF

### Setup

To get started using ChatCBT, you need to configure an AI platform connection from the ChatCBT plugin settings menu.

You have two options: a paid cloud service (OpenAI) or free local service (Ollama). OpenAI is recommended for conversation quality and speed.

#### Choosing a model

| Platform                 | Model           | Cost                                  | Hosting         | Speed   | Quality   |
| ------------------------ | --------------- | ------------------------------------- | --------------- | ------- | --------- |
| **OpenAI** (recommended) | `gpt-3.5-turbo` | Paid (less than a few cents per chat) | Cloud           | Fast ⚡ | Excellent |
| **Ollama**               | `mistral`       | Free                                  | Local (private) | OK      | Good      |

#### OpenAI setup

[OpenAI](https://openai.com/about) provides cloud based AI solutions, including the models that power ChatGPT.

While use of OpenAI costs money, it is cheap (as of Nov 2023). Chat sessions with ChatCBT cost less than a few 2-4 cents.

To use OpenAI with ChatCBT:

1. [Create](https://auth0.openai.com/u/signup) an OpenAI account
2. Add a payment method to your account
3. Generate an API Key [here](https://platform.openai.com/api-keys) and copy it to your clipboard
4. Set your OpenAI API Key in ChatCBT plugin settings
5. Ensure "Ollama mode" is disabled in ChatCBT plugin settings

Treat your OpenAI API Keys like a password - do not share this publicaly. For your safety, your OpenAI API key is encrypted when saving settings.

#### Ollama setup

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

This will start a local server that hosts your Ollama instance locally on your computer from port `11434`. You can change the port if you like by editing the terminal command - just be sure to also update the `Ollama URL` in the ChatCBT plugin settings too.

### Usage

TODO
