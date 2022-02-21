import {MemoryFS} from '@parcel/fs'
import {Parcel, createWorkerFarm} from '@parcel/core'

export async function bundle(path) {
  const workerFarm = createWorkerFarm()
  const outputFS = new MemoryFS(workerFarm)
  const bundler = new Parcel({
    entries: path,
    outputFS,
    workerFarm,
    mode: 'production',
    defaultConfig: '@parcel/config-default',
    defaultTargetOptions: {sourceMaps: false},
  })
  const {bundleGraph} = await bundler.run()
  const [bundle] = bundleGraph.getBundles()
  const output = await outputFS.readFile(bundle.filePath, 'utf-8')
  await workerFarm.end()
  return output
}
