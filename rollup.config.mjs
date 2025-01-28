import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'CtrlKeys',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(
      {
        declaration: false,
        declarationMap: false,
        rootDir: './src',
      }
    )
  ],
};
