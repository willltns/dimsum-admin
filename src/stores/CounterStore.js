import { makeAutoObservable, flow } from 'mobx'

export class CounterStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // state
  count = 1
  loading = false

  // computed
  get squareOfCount() {
    return this.count ** 2
  }

  // action
  increase() {
    // get rootStore
    // const rootStore = this.getRoot()
    this.count++
  }

  // Creating async action using generator
  incAfter2Sec = flow(
    function* () {
      this.loading = true
      yield delay(2)
      this.count++
      this.loading = false
    }.bind(this)
  )
}

function delay(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000))
}
