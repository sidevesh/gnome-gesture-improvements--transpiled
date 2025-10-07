/* exported printStack */
export function printStack(message) {
	const stack = new Error().stack;
	let prefix = '';
	if (stack) {
		const lines = stack.split('\n')[1].split('@');
		console.debug(`[DEBUG]:: in function ${lines[0]} at ${lines[2]}`);
		prefix = '\t';
	}

	if (message !== undefined)
		console.debug(`${prefix}${JSON.stringify(message)}`);
}
