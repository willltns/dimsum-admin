const rootStore = {}
const req = require.context('.', true, /^((?!\.\/index).)*\.js$/)

req.keys().forEach((path) => {
  Object.keys(req(path)).forEach((key) => {
    if (!key.endsWith('Store')) throw new Error(`The exported class '${key}' must end with 'Store'`)
    const StoreClass = req(path)[key]
    const subStoreKey = key[0].toLowerCase() + key.slice(1, -5)
    if (rootStore[subStoreKey]) throw new Error(`SubStore '${subStoreKey}' has already been declared`)
    StoreClass.prototype.getRoot = () => rootStore
    rootStore[subStoreKey] = new StoreClass()
  })
})

export default rootStore
