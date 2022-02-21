import {Browser, Page} from 'puppeteer'
import {measureRepetitions} from '../config'
import {bundle} from './bundle'

export async function measure(browser: Browser, path: string, repetitions: number = measureRepetitions) {
  const content = await bundle(path)
  const page = await browser.newPage()
  await page.addScriptTag({content})
  await (page as any)._client.send(`HeapProfiler.enable`)
  let totalDuration = 0
  let totalMemory = 0
  for (let i = 0; i < repetitions; i++) {
    const {duration, memory} = await measureOnce(page)
    totalDuration += duration
    totalMemory += memory
  }
  await page.close()
  return {
    duration: totalDuration / repetitions,
    memory: totalMemory / repetitions,
  }
}

async function measureOnce(page: Page) {
  await (page as any)._client.send(`HeapProfiler.collectGarbage`)
  const {JSHeapUsedSize: startMemory} = await page.metrics()
  const duration = await page.evaluate(async () => {
    const startTime = performance.now()
    await window['run_test']()
    return performance.now() - startTime
  })
  const {JSHeapUsedSize: endMemory} = await page.metrics()
  const memory = endMemory - startMemory
  return {duration, memory}
}
