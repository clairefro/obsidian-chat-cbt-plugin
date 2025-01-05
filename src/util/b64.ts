const b64 = {
  encode: (str: string) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.btoa) {
      return btoa(str);
    } else {
      throw new Error('Base64 encoding not supported in this environment.');
    }
  },
  decode: (str: string) => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.atob) {
      return atob(str);
    } else {
      throw new Error('Base64 encoding not supported in this environment.');
    }
  },
};

export { b64 };
