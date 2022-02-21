import pptr from 'puppeteer'
import fs from 'fs/promises'
import {join as joinPaths} from 'path'
import {measure, render} from './functions'
import benchmarks from './benchmarks'

async function main() {
  const browser = await pptr.launch()
  const readme = []
  readme.push(await fs.readFile(joinPaths(__dirname, 'README.md'), 'utf-8'))
  for (const name in benchmarks) {
    readme.push(await fs.readFile(joinPaths(__dirname, 'benchmarks', name, 'README.md')))
    const tests = benchmarks[name]
    const results = []
    for (const test of tests) {
      const path = joinPaths(__dirname, 'benchmarks', name, test + '.ts')
      const {duration, memory} = await measure(browser, path)
      results.push({name: test, duration, memory})
    }
    readme.push(render(results))
  }
  await browser.close()
  await fs.writeFile('README.md', readme.join(`\n`))
}

main()
