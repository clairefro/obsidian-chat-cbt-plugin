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
import { ChatCbt, Message } from "./util/chatcbt";
import { buildAssistantMsg, convertTextToMsg } from "./util/messages";

/** Interfaces */
const chatCbt = new ChatCbt();
interface MyPluginSettings {
  openAiApiKey: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  openAiApiKey: "",
};

export default class ChatCbtPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();


    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      "heart-handshake",
      "ChatCBT",
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.

        const menu = new Menu();

        menu.addItem((item) =>
          item
            .setTitle("Chat")
            .setIcon("message-circle")
            .onClick(() => {
              this.getChatCbtRepsonse();
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
    statusBarItemEl.setText("ChatCBT");

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: "chatcbt-chat",
      name: "Chat - submit the text in the active tab to ChatCBT",
      editorCallback: (_editor: Editor, _view: MarkdownView) => {
		this.getChatCbtRepsonse()
      },
    });

	this.addCommand({
		id: "chatcbt-summarize",
		name: "Summarize - create a table that summarizes reframed thoughts from your conversation",
		editorCallback: (_editor: Editor, _view: MarkdownView) => {
		  this.getChatCbtSummary()
		},
	  });


    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new MySettingTab(this.app, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      //   console.log("click", evt);
    });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
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


  async getChatCbtRepsonse(isSummary: boolean = false) {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      return;
    }

	if(!this.settings.openAiApiKey) {
	  new Notice("Missing API Key - update in ChatCBT plugin settings");
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
    

	const loadingModal = new TextModel(this.app, "Asking...");
	loadingModal.open()

    let response = "";

    try {
      new Notice("Asking ChatCBT...");
      const res = await chatCbt.chat(
        crypt.decrypt(this.settings.openAiApiKey),
        messages,
		isSummary
      );
      response = res;
    } catch (e) {
		if(e.response.status === 401) {
		  new Notice("Invalid API Key - update in ChatCBT plugin settings");
		} else {
		  new Notice("ChatCBT failed :(");
		}
      console.error(e);
    } finally {
	  loadingModal.close()
	}

    if (response) {
      const appendMsg = isSummary ? "\n\n" + response : buildAssistantMsg(response);
      await this.app.vault.append(activeFile, appendMsg);
    }
  }

  async getChatCbtSummary() {
	await this.getChatCbtRepsonse(true)
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

    new Setting(containerEl)
      .setName("OpenAI API Key")
      //   .setDesc("")
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
