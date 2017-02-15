
import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/scripts/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: true,
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
}