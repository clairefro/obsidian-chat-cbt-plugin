import { CHAT_AGENT_MARKER, CHAT_DELIMETER } from '../constants';
import { escapeDangerousCharacters } from './parsers';

function convertTextToMsg(text: string) {
	const agentMarkerRegex = new RegExp(
		`^${escapeDangerousCharacters(CHAT_AGENT_MARKER)}`,
	);
	if (text.match(agentMarkerRegex)) {
		/** is assistant */
		return {
			role: 'assistant',
			content: text.replace(agentMarkerRegex, '').trim(),
		};
	} else {
		/** is user */
		return { role: 'user', content: text };
	}
}

function buildAssistantMsg(text: string) {
	return CHAT_DELIMETER + `${CHAT_AGENT_MARKER} ${text}` + CHAT_DELIMETER;
}

export { convertTextToMsg, buildAssistantMsg };
