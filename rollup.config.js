
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default {
    input: 'src/index.js',
    output: {
        file: './lib/rendererToy.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};