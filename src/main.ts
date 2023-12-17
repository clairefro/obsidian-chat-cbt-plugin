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
} from "obsidian";
import { crypt } from "./util/crypt";
import { ChatCbt, Mode } from "./util/chatcbt";
import { buildAssistantMsg, convertTextToMsg } from "./util/messages";

/** Interfaces */
interface ChatCbtPluginSettings {
  openAiApiKey: string;
  mode: string;
  ollamaUrl: string;
}
interface ChatCbtResponseInput {
	isSummary: boolean;
	mode: Mode;
}

/** Constants */
const VALID_MODES = ['openai', 'ollama']

const DEFAULT_SETTINGS: ChatCbtPluginSettings = {
  openAiApiKey: "",
  mode: "openai",
  ollamaUrl: "http://0.0.0.0:11434"
};

/** Initialize chat client */
const chatCbt = new ChatCbt();


export default class ChatCbtPlugin extends Plugin {
  settings: ChatCbtPluginSettings;
  statusBar: HTMLElement

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();


    // This creates an icon in the left ribbon.
    this.addRibbonIcon(
      "heart-handshake",
      "ChatCBT",
      (evt: MouseEvent) => {
        const menu = new Menu();

        menu.addItem((item) =>
          item
            .setTitle("Chat")
            .setIcon("message-circle")
            .onClick(() => {
              this.getChatCbtRepsonse({ isSummary: false, mode: 'openai' });
            })
        );

		menu.addItem((item) =>
          item
            .setTitle("Summarize")
            .setIcon("table")
            .onClick(() => {
              this.getChatCbtSummary();
            })
        );

        menu.showAtMouseEvent(evt);
      }
    );

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
	this.statusBar = statusBarItemEl;
	this.setStatusBarMode(this.settings.mode as Mode);

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: "chat",
      name: "Chat - submit the text in the active tab to ChatCBT",
      editorCallback: (_editor: Editor, _view: MarkdownView) => {
		this.getChatCbtRepsonse({ isSummary: false, mode: this.settings.mode as Mode })
      },
    });

	this.addCommand({
		id: "summarize",
		name: "Summarize - create a table that summarizes reframed thoughts from your conversation",
		editorCallback: (_editor: Editor, _view: MarkdownView) => {
		  this.getChatCbtSummary()
		},
	  });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new MySettingTab(this.app, this));
  }

  /** Run when plugin is disabled */
  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  setStatusBarMode(mode: Mode) {
	this.statusBar.setText(`ChatCBT - ${mode} mode`);
  }


  async getChatCbtRepsonse({ isSummary = false, mode = 'openai' } : ChatCbtResponseInput) {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      return;
    }
    
	
	if(!VALID_MODES.includes(this.settings.mode)) {
	  new Notice(`Inavlid mode '${this.settings.mode}' detected. Update in ChatCBT plugin settings and select a valid mode`);
	  return
	}

	if(this.settings.mode === 'openai' && !this.settings.openAiApiKey) {
	  new Notice("Missing OpenAI API Key - update in ChatCBT plugin settings");
	  return
	}

	if(this.settings.mode === 'ollama' && !this.settings.ollamaUrl) {
	  new Notice("Missing Ollama URL - update in ChatCBT plugin settings");
	  return
	}

    const existingText = await this.app.vault.read(activeFile);
    if (!existingText.trim()) {
      new Notice("First, share how you are feeling");
      return;
    }

    const messages = existingText
      .split(/---+/)
      .map((i) => i.trim())
      .map((i) => convertTextToMsg(i));
    
	const loadingModal = new TextModel(this.app, `Asking ChatCBT... (${this.settings.mode} mode)`);
	loadingModal.open();

    let response = "";

    try {
      new Notice(`Asking ChatCBT... (${this.settings.mode} mode)`);
	    const apiKey = this.settings.openAiApiKey ? crypt.decrypt(this.settings.openAiApiKey): "";

	    const res = await chatCbt.chat({
		    apiKey,
        messages,
		    isSummary,
		    mode: this.settings.mode as Mode,
		    ollamaUrl: this.settings.ollamaUrl
	     });
      response = res;
    } catch (e) {
	  new Notice(`ChatCBT failed :(: ${e.message}`);
      console.error(e);
    } finally {
	  loadingModal.close()
	}

    if (response) {
	  const MSG_PADDING = "\n\n"
      const appendMsg = isSummary ? MSG_PADDING + response : buildAssistantMsg(response);
      await this.app.vault.append(activeFile, appendMsg);
    }
  }

  async getChatCbtSummary() {
	await this.getChatCbtRepsonse({ isSummary: true, mode: 'openai' })
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
    
	containerEl.createEl('a', { 'href': 'https://github.com/clairefro/obsidian-chat-cbt-plugin/blob/main/README.md', 'text': 'Read the setup guide ↗️ ' });
	containerEl.createEl('br');
	containerEl.createEl('br');

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Create an OpenAI API Key from their website and paste here")
      .addText((text) =>
        text
          .setPlaceholder("Enter your API Key")
          .setValue(this.plugin.settings.openAiApiKey ? crypt.decrypt(this.plugin.settings.openAiApiKey): "")
          .onChange(async (value) => {
			if (!value.trim()) {
			  this.plugin.settings.openAiApiKey = ""
			} else {
			  this.plugin.settings.openAiApiKey = crypt.encrypt(value.trim());
			}
            await this.plugin.saveSettings();
          })
      );

	new Setting(containerEl)
      .setName("Ollama mode (local)")
      .setDesc("Toggle on for a local experience if you are running Ollama")
      .addToggle((toggle) =>
        toggle
          .setValue((this.plugin.settings.mode === 'openai' ? false : true))
          .onChange(async (value) => {
			console.log({value})
			if (value) {
			  this.plugin.settings.mode = "ollama";
			} else {
			  this.plugin.settings.mode = "openai";
			}
            await this.plugin.saveSettings();
			this.plugin.setStatusBarMode(this.plugin.settings.mode as Mode);
          })
      );

	new Setting(containerEl)
      .setName("Ollama server URL")
      .setDesc("Edit this if you changed the default port for using Ollama")
      .addText((text) =>
        text
          .setPlaceholder("ex: http://0.0.0.0:11434")
          .setValue(this.plugin.settings.ollamaUrl)
          .onChange(async (value) => {
			this.plugin.settings.ollamaUrl = value.trim();
            await this.plugin.saveSettings();
          })
      );
  }
}


class TextModel extends Modal {
	text: string
	constructor(app: App, _text:string) {
	  super(app);
	  this.text = _text;
	}
  
	onOpen() {
	  const { contentEl } = this;
	  contentEl.setText(this.text);
	}
  
	onClose() {
	  const { contentEl } = this;
	  contentEl.empty();
	}
  }
