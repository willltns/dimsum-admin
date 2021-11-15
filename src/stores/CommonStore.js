import moment from 'moment'
import { makeAutoObservable, flow, action } from 'mobx'
import { getServerTime, getUserinfo, login } from '@/assets/xhr'
import { userRoleMap } from '@/consts'

export class CommonStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  // state
  userinfo = undefined
  loading = false
  unixTS = 0
  intervalTimer = null

  get godAuth() {
    return +this.userinfo?.role === +userRoleMap.god
  }
  get auditorAuth() {
    return +this.userinfo?.role === +userRoleMap.auditor
  }
  get inputorAuth() {
    return +this.userinfo?.role === +userRoleMap.inputor
  }

  // action
  updateUnixTS(date) {
    this.unixTS = moment(date, 'YYYY-MM-DD HH:mm:ss').unix()
  }

  updateUserinfo(userinfo) {
    this.userinfo = userinfo
  }

  getUserinfo = flow(
    function* () {
      try {
        const userinfo = yield getUserinfo()
        this.updateUserinfo(userinfo)
      } catch (err) {
        this.updateUserinfo(null)
      }
    }.bind(this)
  )

  login = flow(
    function* (params) {
      this.loading = true
      try {
        const userinfo = yield login(params)
        localStorage.setItem('token', userinfo.token)
        this.updateUserinfo(userinfo)
      } catch (err) {}
      this.loading = false
    }.bind(this)
  )

  timeStart = flow(
    function* () {
      try {
        const { date } = yield getServerTime()
        // prettier-ignore
        this.intervalTimer = setInterval(action(() => ++this.unixTS), 1000)
        this.unixTS = moment(date, 'YYYY-MM-DD HH:mm:ss').unix()
      } catch (err) {}
    }.bind(this)
  )
}
