const summary = (lang: string) =>
  `RESPOND TO THE USER IN ${lang}. Create a markdown table summarizing the conversation. It should have columns for each negative belief mentioned by the user, emotion, category of negative thinking, and reframed thought`;

export default summary;
