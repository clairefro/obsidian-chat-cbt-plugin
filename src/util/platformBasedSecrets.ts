import { Platform } from 'obsidian';
import { b64 } from './b64';
import { crypt } from './crypt';

// cryptr requires node runtime and doestn't work on mobile
// can't rip out cryptr bc many users already using it on desktop
// instead, will use base64 encoding (not as safe, but obfuscates) on mobile

const platformBasedSecrets = {
  decrypt: (str: string) => {
    if (Platform.isMobile) {
      return b64.decode(str);
    } else {
      // Desktop
      return crypt.decrypt(str);
    }
  },
  encrypt: (str: string) => {
    if (Platform.isMobile) {
      return b64.encode(str);
    } else {
      // Desktop
      return crypt.encrypt(str);
    }
  },
};

export { platformBasedSecrets };
