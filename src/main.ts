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
import { ChatCbt } from "./util/chatcbt";
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

    /* add option when you right click on item in file menu */
    // this.registerEvent(
    //   this.app.workspace.on("file-menu", (menu, file) => {
    //     menu.addItem((item) => {
    //       item
    //         .setTitle("Print file path 👈")
    //         .setIcon("document")
    //         .onClick(async () => {
    //           new Notice(file.path);
    //         });
    //     });
    //   })
    // );

    /* add option when you right click on item in file menu */

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle("Print file path 👈")
            .setIcon("document")
            .onClick(async () => {
              new Notice(view.file ? view.file.path : "<nothing>");
            });
        });
      })
    );

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      "heart-handshake",
      "ChatCBT",
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        // TODO: remove
        // new Notice("Barrr");

        const menu = new Menu();

        menu.addItem((item) =>
          item
            .setTitle("Chat")
            .setIcon("message-circle")
            .onClick(() => {
              this.getChatCbtRepsonse();
            })
        );

        // menu.addItem((item) =>
        //   item
        //     .setTitle("Paste")
        //     .setIcon("paste")
        //     .onClick(() => {
        //       new Notice("Pasted");
        //     })
        // );

        menu.showAtMouseEvent(evt);
        // menu.showAtPosition({ x: 20, y: 20 });
      }
    );

    // Perform additional things with the ribbon
    ribbonIconEl.addClass("my-plugin-ribbon-class");

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("ChatCBT");

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "chatcbt-chat",
      name: "Chat with ChatCBT",
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        const text = view.editor.getValue();
        // parse into convo
        console.log(text);
      },
    });

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: "chatcbt-summarize",
      name: "Summarize takeaways from conversation",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        console.log(view);
        // editor.replaceSelection("Sample Editor Command");
        // console.log(editor.getSelection());
        // console.log(view.file);
        // editor.replaceSelection("Sample Editor Command");
        // console.log(editor.lastLine());
        // console.log(view.app);
        // console.log(view);
        // eslint-disable-next-line
        // console.log(editor.getDoc().cm.viewState.state.doc.text.join("\n"));
        // eslint-disable-next-line
        console.log(editor.lastLine());
        console.log(view.app);
      },
    });
    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: "open-sample-modal-complex",
      name: "Open sample modal (complex)",
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
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

  async getChatCbtRepsonse() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      return;
    }

    const existingText = await this.app.vault.read(activeFile);
    if (!existingText.trim()) {
      new Notice("First, tell how you are feeling");
      return;
    }

    const messages = existingText
      .split(/---+/)
      .map((i) => i.trim())
      .map((i) => convertTextToMsg(i));

    // TODO: PARSE FILE FOR MESSAGES/ temporarily just reading whole doc
    let response = "";

    try {
      new Notice("Asking ChatCBT...");
      const res = await chatCbt.chat(
        crypt.decrypt(this.settings.openAiApiKey),
        messages
      );
      response = res;
    } catch (e) {
      new Notice("ChatCBT failed :(");
      console.error(e);
    }

    if (response) {
      const appendMsg = buildAssistantMsg(response);
      await this.app.vault.append(activeFile, appendMsg);
    }
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.setText("Woah");
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
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
          .setValue(crypt.decrypt(this.plugin.settings.openAiApiKey))
          .onChange(async (value) => {
            this.plugin.settings.openAiApiKey = crypt.encrypt(value.trim());
            await this.plugin.saveSettings();
          })
      );
  }
}
