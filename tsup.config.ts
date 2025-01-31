import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    entry: 'src/index.ts'
  },
  clean: true,
  minify: true,
  sourcemap: true,
  target: 'es2018',
  outDir: 'dist',
  noExternal: ['just-types']
})
