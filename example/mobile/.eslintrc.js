module.exports = {
	'parser': 'babel-eslint',
	'plugins': [
		'react',
		'react-native'
	],
	'ignorePatterns': ['../browser', '../node', '../../docs', '../../lib', '../../test', '../../AlertBuilder'],
	'env': {
		'browser': true,
		'node': true,
		'es6': true
	},
	'parserOptions': {
		'ecmaVersion': 9,
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true,
			'modules': true
		}
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'rules': {
		'array-bracket-spacing': 'error',
		'arrow-parens': ['error', 'always'],
		'arrow-spacing': 'error',
		'camelcase': 'error',
		'comma-dangle': ['error', 'never'],
		'indent': ['error', 'tab', {
			'SwitchCase': 1,
			'MemberExpression': 1,
			'VariableDeclarator': 1,
			'outerIIFEBody': 1,
			'FunctionDeclaration': {
				'parameters': 1,
				'body': 1
			},
			'FunctionExpression': {
				'parameters': 1,
				'body': 1
			},
			'CallExpression': {
				'arguments': 1
			},
			'ArrayExpression': 1,
			'ObjectExpression': 1,
			'ImportDeclaration': 1
		}],
		'no-console': ['warn',
			{
				'allow': ['warn', 'error', 'info', 'debug']
			}],
		'no-debugger': 'error',
		'no-duplicate-case': 'error',
		'object-curly-spacing': ['error', 'always'],
		'padding-line-between-statements': ['error',
			{
				'blankLine': 'always', 'prev': '*', 'next': 'return'
			}],
		'prefer-const': 'error',
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'space-before-blocks': ['error', 'always'],
		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true
		}],
		'sort-imports': ['error', {
			'ignoreCase': true,
			'allowSeparatedGroups': true
		}],
		'react/no-unescaped-entities': 0,
		'react/prop-types': 0
	}
};
