import {readFileSync} from 'fs';

class CommitMessage {
	static perform() {
		const lines = readFileSync('.git/COMMIT_EDITMSG').toString().split('\n');
		try {
			CommitMessage.checkLineLength(lines, 100);
			CommitMessage.checkEmptyLine(lines);
			CommitMessage.checkHeader(lines[0]);
			CommitMessage.checkBreakingChanges(lines);
		} catch (err: any) {
			console.error(`\nInvalid commit message:\n${err.message}.\n\nSee details in CONTRIBUTING.md.\n`);
			process.exit(1);
		}
	}

	private static checkLineLength(lines: string[], maxLength: number): void {
		const error = CommitMessage.textJoin(lines.map((line, i) => (line.length > maxLength ? CommitMessage.numeral(i) : '')).filter(line => line));
		const plural = error.indexOf(' and ') > -1;
		if (error) {
			throw new Error(`${error} line${plural ? 's' : ''} exceeds ${maxLength} characters`);
		}
	}

	private static checkEmptyLine(lines: string[]): void {
		if (lines.length > 1 && !/^$/.test(lines[1])) {
			throw new Error(`2nd line has to be empty`);
		}
	}

	private static checkBreakingChanges(lines: string[]): void {
		const breakingLineIndex = lines.findIndex(line => line.toLowerCase().includes('breaking change'));
		if (breakingLineIndex > 0) {
			// skip 1st line as it may contain the "breaking change" string
			const breaking = lines[breakingLineIndex];
			const start = `${CommitMessage.numeral(breakingLineIndex)} line doesn't follow "BREAKING CHANGE:" format,`;
			if (!/^BREAKING CHANGE/i.test(breaking)) {
				throw new Error(`${start} it must start on a new line`);
			}
			if (!/^BREAKING CHANGE/.test(breaking)) {
				throw new Error(`${start} it must be written in uppercase letter`);
			}
			if (!/^BREAKING CHANGE(?!S)/.test(breaking)) {
				throw new Error(`${start} it must not be plural`);
			}
			if (!/^BREAKING CHANGE(?!S):/.test(breaking)) {
				throw new Error(`${start} it must be terminated with a colon without a whitespace`);
			}
			if (!lines[breakingLineIndex + 1] || !lines[breakingLineIndex + 1].length) {
				throw new Error(`${CommitMessage.numeral(breakingLineIndex + 1)} line cannot be empty as it follows a breaking change declaration`);
			}
		}
	}

	private static textJoin(values: string[]): string {
		return values.join(', ').replace(/,(?=[^,]*$)/, ' and');
	}

	private static checkHeader(header: string): void {
		const {type, scope, subject} = CommitMessage.breakDownHeader(header);
		const contributing = readFileSync('CONTRIBUTING.md', 'utf8');
		CommitMessage.checkType(type, CommitMessage.extractList(contributing, 'Type'));
		CommitMessage.checkScope(scope, CommitMessage.extractList(contributing, 'Scope'));
		CommitMessage.checkSubject(subject);
	}

	private static numeral(i: number): string {
		return ['1st', '2nd', '3rd'][i] || `${i + 1}th`;
	}

	private static breakDownHeader(header: string): {type: string; scope: string; subject: string} {
		const groups = /^(?<type>[a-z-]+)(?:\((?<scope>[a-z-]+)\))?:\s(?<subject>.+)$/.exec(header)?.groups;
		if (!groups) {
			throw new Error(`1st line doesn't follow "type(scope): subject" format`);
		}
		return {
			type: groups['type'],
			scope: groups['scope'],
			subject: groups['subject']
		};
	}

	private static extractList(contributing: string, type: string): string[] {
		const start = contributing.indexOf(`# ${type}`);
		const list = contributing.substring(contributing.indexOf('*', start), contributing.indexOf('#', start + 1));
		return list.match(/(?<=\*\*).*(?=\*\*)/g) || [];
	}

	private static checkType(type: string, types: string[]): void {
		if (!types.includes(type)) {
			throw new Error(`1st line has an invalid type '${type}'. Allowed types are: ${CommitMessage.textJoin(types)}`);
		}
	}

	private static checkScope(scope: string, scopes: string[]): void {
		if (scope && !scopes.includes(scope)) {
			throw new Error(`1st line has an invalid scope '${scope}'. Allowed types are: ${CommitMessage.textJoin(scopes)}`);
		}
	}

	private static checkSubject(subject: string): void {
		if (/^[A-Z]/.test(subject)) {
			throw new Error(`1st line has an invalid subject, its first letter must be lower case`);
		}

		if (/\.$/.test(subject)) {
			throw new Error('1st line has an invalid subject, it must not end with a dot "."');
		}
	}
}

CommitMessage.perform();
