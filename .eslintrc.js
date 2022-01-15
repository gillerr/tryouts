module.exports = {
	root: true,
	overrides: [
		{
			files: ['*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: ['tsconfig.json'],
				createDefaultProgram: true
			},
			extends: [
				'eslint:all',
				'plugin:@typescript-eslint/eslint-plugin/all',
				'plugin:@angular-eslint/all',
				'plugin:@angular-eslint/template/process-inline-templates'
			],
			rules: {
				// overwriting some rules
				'@angular-eslint/no-host-metadata-property': ['error', {allowStatic: true}],
				'@typescript-eslint/member-ordering': [
					'error',
					{
						default: [
							'public-static-field',
							'public-instance-field',
							'protected-static-field',
							'protected-instance-field',
							'private-static-field',
							'private-instance-field',
							'public-constructor',
							'protected-constructor',
							'private-constructor',
							'public-static-method',
							'public-instance-method',
							'protected-static-method',
							'protected-instance-method',
							'private-static-method',
							'private-instance-method'
						]
					}
				],
				'capitalized-comments': ['error', 'never'],
				'grouped-accessor-pairs': ['error', 'getBeforeSet'],
				'id-length': ['error', {min: 3, max: 15}],
				'max-lines': ['error', {max: 150}],
				'max-lines-per-function': ['error', {max: 25}],
				'max-nested-callbacks': ['error', 3],
				'max-params': ['error', 5],
				'no-console': [
					'error',
					{
						allow: ['info', 'warn', 'error']
					}
				],
				'sort-imports': ['error', {ignoreDeclarationSort: true}],

				// adapting some rules for prettier
				'lines-around-comment': 'off',
				'no-confusing-arrow': 'off',
				'max-len': 'off',
				'no-tabs': ['error', {allowIndentationTabs: true}],
				'@typescript-eslint/quotes': ['error', 'single', {avoidEscape: true, allowTemplateLiterals: false}],
				'no-restricted-syntax': ['error', 'SequenceExpression']
			}
		},
		{
			files: ['*.spec.ts'],
			rules: {
				'@angular-eslint/use-component-selector': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'max-lines': 'off',
				'max-lines-per-function': 'off'
			}
		},
		{
			files: ['polyfills.ts'],
			rules: {
				'spaced-comment': 'off'
			}
		},
		{
			files: ['*.html'],
			extends: ['plugin:@angular-eslint/template/recommended']
		}
	]
};
