
import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/scripts/main.js',
	output: {
		file: 'build/js/main.min.js',
		format: 'cjs',
		sourceMap: true,
	},
	plugins: [
		eslint({
			exclude: [
				'src/styles/**',
			]
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};