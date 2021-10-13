import { makeAutoObservable, flow } from 'mobx'
import { login } from '@/assets/xhr'

export class CommonStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // state
  userinfo = undefined
  loading = false

  // action
  updateUserinfo(userinfo) {
    this.userinfo = userinfo
  }

  // Creating async action using generator
  login = flow(
    function* (name, password) {
      this.loading = true
      try {
        const userinfo = yield login({ name, password })
        this.updateUserinfo(userinfo)
      } catch (err) {}
      this.loading = false
    }.bind(this)
  )
}
