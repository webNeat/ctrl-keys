type Result = {
  name: string
  duration: number
  memory: number
}
export function render(results: Result[]) {
  results.sort((a, b) => a.duration - b.duration)
  let content = `### Results\n\n<table>`
  content += `<tr><th>library</th><th>duration</th><th>memory usage</th></tr>`
  for (const {name, duration, memory} of results) {
    content += `<tr><td>${name}</td><td>${Math.floor(duration)} ms</td><td>${Math.floor(memory / 1000)} kb</td></tr>`
  }
  content += `</table>\n`
  return content
}
