# Benchmarks

The following benchmarks are a try to compare the performance (in term of time and memory usage) of `ctrl-keys` to some similar libraries. No benchmark is perfect, so it you found out that I am doing something wrong, feel free to open an issue to let me know how I can correct it, Thanks.

## How is a benchmark done?

Each benchmark is done as follows:

- Define a scenario to test/benchmark.
- For each implementation of the scenario for a library:
  - Run the implementation into a web browser page (using puppeteer) and measure the time and memory it uses.
  - Do that measurement 100 times and return the averages.

The code that measure the time and memory usage of an implementation is:

```ts
// `page` is a puppeteer page
await page._client.send(`HeapProfiler.collectGarbage`) // run garbage collection to free up memory
const {JSHeapUsedSize: startMemory} = await page.metrics()
const duration = await page.evaluate(async () => {
  const startTime = performance.now()
  // run the implementation here ...
  return performance.now() - startTime
})
const {JSHeapUsedSize: endMemory} = await page.metrics()
const memory = endMemory - startMemory
return {duration, memory}
```

## Single key shortcut

- Setup the library to run a callback when `ctrl+b` is pressed.
- Press `ctrl+a` then `ctrl+b` then `ctrl+c` 1000 times.
- Wait for the library to run the callback 1000 times.

### Results

<table><tr><th>library</th><th>duration</th><th>memory usage</th></tr><tr><td>ctrl-keys</td><td>53 ms</td><td>4734 kb</td></tr><tr><td>shortcuts</td><td>59 ms</td><td>4845 kb</td></tr><tr><td>tinykeys</td><td>66 ms</td><td>4983 kb</td></tr></table>

## Multiple keys shortcut

- Setup the library to run a callback when `ctrl+a ctrl+b ctrl+c` is pressed.
- Press `ctrl+a` then `ctrl+b` then `ctrl+c` 1000 times.
- Wait for the library to run the callback 1000 times.

### Results

<table><tr><th>library</th><th>duration</th><th>memory usage</th></tr><tr><td>ctrl-keys</td><td>55 ms</td><td>4711 kb</td></tr><tr><td>shortcuts</td><td>58 ms</td><td>4963 kb</td></tr><tr><td>tinykeys</td><td>69 ms</td><td>5056 kb</td></tr></table>
