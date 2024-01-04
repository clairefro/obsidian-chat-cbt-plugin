function escapeDangerousCharacters(str: string) {
	const specialCharacters = ['*', ':', '^', '$', '.', '[', ']', '|', '?', '+'];
	const split = str.split('').map((c) => {
		if (specialCharacters.includes(c)) {
			return `\\${c}`;
		} else {
			return c;
		}
	});

	return split.join('');
}

export { escapeDangerousCharacters };
