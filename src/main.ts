import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	Menu,
	MarkdownRenderer,
	Component,
} from 'obsidian';
import { ChatCbt, Mode } from './util/chatcbt';
import { buildAssistantMsg, convertTextToMsg } from './util/messages';
import { platformBasedSecrets } from './util/platformBasedSecrets';
import { OPENAI_DEFAULT_MODEL, DEEPSEEK_DEFAULT_MODEL } from './constants';
import { languages } from './util/languages';
import defaultSystemPrompt from './prompts/system';
import { AI_PROVIDERS } from './constants';

/** Interfaces */
interface ChatCbtPluginSettings {
	openAiApiKey: string;
	deepseekApiKey: string;
	mode: AI_PROVIDERS;
	model: string; // KEEPING FOR BACKCOMPAT
	ollamaUrl: string;
	language: string;
	prompt: string;
	openaiModel: string;
	ollamaModel: string;
	deepseekModel: string;
}

interface ChatCbtResponseInput {
	isSummary: boolean;
	mode: Mode;
}

/** Constants */
const DEFAULT_LANG = 'English';

const DEFAULT_SETTINGS: ChatCbtPluginSettings = {
	openAiApiKey: '',
	deepseekApiKey: '',
	mode: AI_PROVIDERS.OPENAI,
	model: '_DEPRECATED', // KEEPING FOR BACKCOMPAT
	ollamaUrl: 'http://0.0.0.0:11434',
	language: DEFAULT_LANG,
	prompt: defaultSystemPrompt,
	openaiModel: '',
	ollamaModel: '',
	deepseekModel: '',
};

/** Initialize chat client */
const chatCbt = new ChatCbt();

export default class ChatCbtPlugin extends Plugin {
	settings: ChatCbtPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('heart-handshake', 'ChatCBT', (evt: MouseEvent) => {
			const menu = new Menu();

			const model = this.getCurrentModel();

			menu.addItem((item) =>
				item
					.setTitle(`Chat`)
					.setIcon('message-circle')
					.onClick(async () => {
						try {
							await this.getChatCbtRepsonse({
								isSummary: false,
								mode: this.settings.mode,
							});
						} catch (e) {
							new Notice(e.message);
						}
					}),
			);

			menu.addItem((item) =>
				item
					.setTitle(`Summarize`)
					.setIcon('table')
					.onClick(() => {
						this.getChatCbtSummary();
					}),
			);

			menu.showAtMouseEvent(evt);
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'chat',
			name: 'Chat',
			editorCallback: (_editor: Editor, _view: MarkdownView) => {
				this.getChatCbtRepsonse({
					isSummary: false,
					mode: this.settings.mode as Mode,
				});
			},
		});

		this.addCommand({
			id: 'summarize',
			name: 'Summarize',
			editorCallback: (_editor: Editor, _view: MarkdownView) => {
				this.getChatCbtSummary();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MySettingTab(this.app, this));
	}

	/** Run when plugin is disabled */
	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getChatCbtRepsonse({ isSummary = false }: ChatCbtResponseInput) {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			return;
		}

		if (!Object.values(AI_PROVIDERS).includes(this.settings.mode)) {
			new Notice(
				`Inavlid mode '${this.settings.mode}' detected. Update in ChatCBT plugin settings and select a valid mode`,
			);
			return;
		}

		if (
			this.settings.mode === AI_PROVIDERS.OPENAI &&
			!this.settings.openAiApiKey
		) {
			new Notice('Missing OpenAI API Key - update in ChatCBT plugin settings');
			return;
		}

		if (
			this.settings.mode === AI_PROVIDERS.DEEPSEEK &&
			!this.settings.deepseekApiKey
		) {
			new Notice(
				'Missing Deepseek API Key - update in ChatCBT plugin settings',
			);
			return;
		}

		if (
			this.settings.mode === AI_PROVIDERS.OLLAMA &&
			!this.settings.ollamaUrl
		) {
			new Notice('Missing Ollama URL - update in ChatCBT plugin settings');
			return;
		}

		const existingText = await this.app.vault.read(activeFile);
		if (!existingText.trim()) {
			new Notice('First, share how you are feeling in a note');
			return;
		}

		const messages = existingText
			.split(/---+/)
			.map((i) => i.trim())
			.map((i) => convertTextToMsg(i));

		const selectedModel = this.getCurrentModel();

		const loadingModal = new MarkdownTextModel(
			this.app,
			`Asking ChatCBT...\n\n_mode: ${this.settings.mode}_\n\n_model: ${selectedModel}_`,
		);
		loadingModal.open();

		let response = '';

		try {
			const openAiApiKey = this.settings.openAiApiKey
				? platformBasedSecrets.decrypt(this.settings.openAiApiKey)
				: '';

			const deepseekApiKey = this.settings.deepseekApiKey
				? platformBasedSecrets.decrypt(this.settings.deepseekApiKey)
				: '';

			const res = await chatCbt.chat({
				openAiApiKey,
				deepseekApiKey,
				messages,
				isSummary,
				mode: this.settings.mode as Mode,
				ollamaUrl: this.settings.ollamaUrl,
				model: selectedModel,
				language: this.settings.language,
				prompt: this.settings.prompt,
			});
			response = res;
		} catch (e) {
			let msg = e.msg;
			if (e.status === 404) {
				msg = `Model named '${selectedModel}' not found for ${this.settings.mode}. Update mode or model name in settings.`;
			} else if (e.status > 399 && e.status < 500) {
				msg = `Unable to connect to provider ${this.settings.mode}.\n\nEnsure you have:\n\n- a valid API key registered in the settings\n\n - there is credit charged in your account (if applicable)`;
			}

			new Notice(`ChatCBT failed with status ${e.status}: ${msg}`);
			console.error(e);
		} finally {
			loadingModal.close();
		}

		if (response) {
			const MSG_PADDING = '\n\n';
			const appendMsg = isSummary
				? MSG_PADDING + response
				: buildAssistantMsg(response);
			await this.app.vault.append(activeFile, appendMsg);
		}
	}

	async getChatCbtSummary() {
		await this.getChatCbtRepsonse({
			isSummary: true,
			mode: this.settings.mode,
		});
	}

	private getCurrentModel(): string {
		switch (this.settings.mode) {
			case AI_PROVIDERS.OPENAI:
				return this.settings.openaiModel || OPENAI_DEFAULT_MODEL;
			case AI_PROVIDERS.OLLAMA:
				return this.settings.ollamaModel || '';
			case AI_PROVIDERS.DEEPSEEK:
				return this.settings.deepseekModel || DEEPSEEK_DEFAULT_MODEL;
			default:
				return '';
		}
	}
}

class MySettingTab extends PluginSettingTab {
	plugin: ChatCbtPlugin;

	constructor(app: App, plugin: ChatCbtPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('a', {
			href: 'https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/README.md',
			text: 'Read the setup guide ↗️ ',
		});
		containerEl.createEl('br');
		containerEl.createEl('br');

		// PROVIDER DROPDOWN
		new Setting(containerEl)
			.setName('AI Provider')
			.setDesc('Choose which AI provider to use')
			.addDropdown((dropdown) => {
				dropdown
					.addOption(AI_PROVIDERS.OPENAI, 'OpenAI (Cloud)')
					.addOption(AI_PROVIDERS.DEEPSEEK, 'Deepseek (Cloud)')
					.addOption(AI_PROVIDERS.OLLAMA, 'Ollama (Local)')
					.setValue(this.plugin.settings.mode)
					.onChange(async (value: AI_PROVIDERS) => {
						this.plugin.settings.mode = value;
						// this.updateModelPlaceholder(containerEl);
						await this.plugin.saveSettings();

						// show/hide relevant settings
						this.updateProviderSettings(containerEl, value);
					});
			});

		// OPENAI
		new Setting(containerEl)
			.setName('OpenAI Model')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-openai-setting')
			.setDesc('Custom OpenAI model (leave empty for default)')
			.addText((text) =>
				text
					.setPlaceholder(OPENAI_DEFAULT_MODEL)
					.setValue(this.plugin.settings.openaiModel)
					.onChange(async (value) => {
						this.plugin.settings.openaiModel = value.trim();

						await this.plugin.saveSettings();
					}),
			);

		// OpenAI API Key
		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-openai-setting')
			.setDesc('Make sure you have added credits to your account!')
			.addText((text) =>
				text
					.setPlaceholder('Enter your API Key')
					.setValue(
						this.plugin.settings.openAiApiKey
							? platformBasedSecrets.decrypt(this.plugin.settings.openAiApiKey)
							: '',
					)
					.onChange(async (value) => {
						if (!value.trim()) {
							this.plugin.settings.openAiApiKey = '';
						} else {
							this.plugin.settings.openAiApiKey = platformBasedSecrets.encrypt(
								value.trim(),
							);
						}
						await this.plugin.saveSettings();
					}),
			);

		const openAiLinkboxEl = document.createElement('div');
		openAiLinkboxEl.classList =
			'chat-cbt-provider-setting chat-cbt-openai-setting';

		const link = openAiLinkboxEl.createEl('a');
		link.textContent = 'Get OpenAI API Key';
		link.href = 'https://platform.openai.com/api-keys';
		link.target = '_blank';
		link.style.textDecoration = 'underline';

		openAiLinkboxEl.createEl('br');
		openAiLinkboxEl.createEl('br');

		containerEl.appendChild(openAiLinkboxEl);

		// Deepseek API key

		new Setting(containerEl)
			.setName('Deepseek Model')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-deepseek-setting')
			.setDesc('Custom Deepseek model (leave empty for default)')
			.addText((text) =>
				text
					.setPlaceholder(DEEPSEEK_DEFAULT_MODEL)
					.setValue(this.plugin.settings.deepseekModel)
					.onChange(async (value) => {
						this.plugin.settings.deepseekModel = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Deepseek API Key')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-deepseek-setting')
			.setDesc('Enter your Deepseek API key')
			.addText((text) =>
				text
					.setPlaceholder('Enter your API Key')
					.setValue(
						this.plugin.settings.deepseekApiKey
							? platformBasedSecrets.decrypt(
									this.plugin.settings.deepseekApiKey,
							  )
							: '',
					)
					.onChange(async (value) => {
						if (!value.trim()) {
							this.plugin.settings.deepseekApiKey = '';
						} else {
							this.plugin.settings.deepseekApiKey =
								platformBasedSecrets.encrypt(value.trim());
						}
						await this.plugin.saveSettings();
					}),
			);

		const deepseekLinkboxEl = document.createElement('div');
		deepseekLinkboxEl.classList =
			'chat-cbt-provider-setting chat-cbt-deepseek-setting';

		const link2 = deepseekLinkboxEl.createEl('a');
		link2.textContent = 'Get Deepseek API Key';
		link2.href = 'https://platform.deepseek.com/api_keys';
		link2.target = '_blank';
		link2.style.textDecoration = 'underline';
		link2.classList = 'chat-cbt-provider-setting chat-cbt-deepseek-setting';

		deepseekLinkboxEl.createEl('br');
		deepseekLinkboxEl.createEl('br');

		containerEl.appendChild(deepseekLinkboxEl);

		// OLLAMA

		new Setting(containerEl)
			.setName('Ollama Model')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-ollama-setting')
			.setDesc(
				'Select an available Ollama model. Ensure Ollama is running (run: ollama serve)',
			)
			.addDropdown(async (dropdown) => {
				dropdown.addOption('loading', 'Loading available models...');

				try {
					const models = await ChatCbt.getAvailableOllamaModels(
						this.plugin.settings.ollamaUrl,
					);

					dropdown.selectEl.empty();
					if (!models.length) {
						dropdown.addOption('', 'No models found');
						new Notice(
							'No Ollama models found. Install models via terminal: ollama pull <model>',
						);
						return;
					}

					dropdown.addOption('', '-- Select a model --');

					models.forEach((model) => {
						dropdown.addOption(model, model);
					});

					dropdown.setValue(this.plugin.settings.ollamaModel || '');
				} catch (error) {
					console.error('Failed to fetch Ollama models:', error);
					dropdown.selectEl.empty();
					dropdown.addOption('', 'Failed to load models');
					new Notice(
						'Failed to load Ollama models. Ensure Ollama serer is running',
					);
				}

				// handle model selection
				dropdown.onChange(async (value) => {
					this.plugin.settings.ollamaModel = value;
					await this.plugin.saveSettings();
				});
			});

		const ollamaLinkboxEl = document.createElement('div');
		ollamaLinkboxEl.classList =
			'chat-cbt-provider-setting chat-cbt-ollama-setting';

		const ollamaLink = ollamaLinkboxEl.createEl('span');
		ollamaLink.innerHTML =
			'Install <a href="https://ollama.com/" target="_blank">Ollama</a> for free and local AI on your device. Suggested model: <a href="https://ollama.com/library/llama3.2" target="_blank">Llama 3.2 3B</a>';

		ollamaLinkboxEl.createEl('br');
		ollamaLinkboxEl.createEl('br');

		containerEl.appendChild(ollamaLinkboxEl);

		new Setting(containerEl)
			.setName('Ollama server URL')
			.setClass('chat-cbt-provider-setting')
			.setClass('chat-cbt-ollama-setting')
			.setDesc(
				'Edit this if you changed the default port for using Ollama. Requires Ollama v0.1.24 or higher.',
			)
			.addText((text) =>
				text
					.setPlaceholder('ex: http://0.0.0.0:11434')
					.setValue(this.plugin.settings.ollamaUrl)
					.onChange(async (value) => {
						this.plugin.settings.ollamaUrl = value.trim();
						await this.plugin.saveSettings();
					}),
			);

		// LANGUAGE
		new Setting(containerEl)
			.setName('Preferred Language (Beta)')
			.setDesc('For responses from ChatCBT')
			.addDropdown((dropdown) => {
				languages.forEach((lang) => {
					dropdown.addOption(lang.value, lang.label);
				});

				dropdown
					.setValue(this.plugin.settings.language || 'English')
					.onChange(async (value) => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
					});
			});

		// SYSTEM PROMPT
		const promptSetting = new Setting(containerEl)
			.setName('Edit System Prompt')
			.setDesc('Customize the prompt that controls how ChatCBT responds to you')
			.setClass('chat-cbt-prompt-setting');

		promptSetting.addTextArea((text) => {
			text.setValue(this.plugin.settings.prompt).onChange(async (value) => {
				this.plugin.settings.prompt = value;
				updateResetButtonVisibility(value);
				await this.plugin.saveSettings();
			});

			text.inputEl.addClass('chat-cbt-prompt-textarea');

			return text;
		});

		const buttonContainer = containerEl.createDiv('chat-cbt-button-container');

		const resetButton = new Setting(buttonContainer).addButton((button) => {
			button.setButtonText('Reset to Default').onClick(async () => {
				const confirmReset = confirm(
					"Are you sure you want to reset the prompt to default? You'll lose your custom prompt.",
				);

				if (confirmReset) {
					this.plugin.settings.prompt = defaultSystemPrompt;

					const textareaElement = containerEl.querySelector(
						'.chat-cbt-prompt-textarea',
					) as HTMLTextAreaElement;
					if (textareaElement) {
						textareaElement.value = defaultSystemPrompt;
					}

					await this.plugin.saveSettings();
					new Notice('ChatCBT prompt reset to default');

					// Update button visibility
					updateResetButtonVisibility(defaultSystemPrompt);
				}
			});

			return button;
		});

		const updateResetButtonVisibility = (value: string) => {
			const shouldShow = value !== defaultSystemPrompt;
			buttonContainer.style.display = shouldShow ? 'flex' : 'none';
		};
		// hide the reset button setting's name/desc elements
		resetButton.nameEl.remove();
		resetButton.controlEl.addClass('chat-cbt-reset-button-control');
		// run this on insitial settings load
		updateResetButtonVisibility(this.plugin.settings.prompt);

		// initialize
		this.updateProviderSettings(containerEl, this.plugin.settings.mode);
	}

	private updateProviderSettings(containerEl: HTMLElement, mode: AI_PROVIDERS) {
		const openaiSettings = Array.from(
			containerEl.querySelectorAll('.chat-cbt-openai-setting'),
		) as HTMLElement[];
		const ollamaSettings = Array.from(
			containerEl.querySelectorAll('.chat-cbt-ollama-setting'),
		) as HTMLElement[];
		const deepseekSettings = Array.from(
			containerEl.querySelectorAll('.chat-cbt-deepseek-setting'),
		) as HTMLElement[];

		if (openaiSettings && ollamaSettings && deepseekSettings) {
			openaiSettings.forEach((s) => {
				s.style.display = mode === AI_PROVIDERS.OPENAI ? 'flex' : 'none';
			});
			ollamaSettings.forEach((s) => {
				s.style.display = mode === AI_PROVIDERS.OLLAMA ? 'flex' : 'none';
			});
			deepseekSettings.forEach((s) => {
				s.style.display = mode === AI_PROVIDERS.DEEPSEEK ? 'flex' : 'none';
			});
		}
	}
}

class MarkdownTextModel extends Modal {
	text: string;
	component: Component;
	constructor(app: App, _text: string) {
		super(app);
		this.text = _text;
		this.component = new Component();
	}

	onOpen() {
		const { contentEl } = this;

		const markdownContainer = contentEl.createDiv('markdown-container');

		MarkdownRenderer.render(
			this.app,
			this.text,
			markdownContainer,
			'',
			this.component,
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
