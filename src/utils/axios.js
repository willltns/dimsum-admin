// import qs from 'qs'
import axios from 'axios'
import { message } from 'antd'

import rootStore from '@/stores'

axios.defaults.baseURL = '/api-mgmt'

axios.defaults.timeout = 60000

// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded;charset=UTF-8'

// data is only applicable for request methods 'PUT', 'POST', and 'PATCH'
// axios.defaults.transformRequest = (data, header) => qs.stringify(data)

axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => {
    const { data } = response

    if (data?.code === 200) return data.data

    if (data?.code === 401) rootStore.common.updateUserinfo(null)
    if (data?.message) message.warn(data.message)

    return Promise.reject(new CodeError(data))
  },

  (error) => {
    console.log('ERR', error)

    if (error.message) {
      error.message.search('timeout') > -1 && message.error('请求超时')
      error.message.search('404') > -1 && message.error('资源不存在')
      error.message.search('400') > -1 && message.error('请求异常')
      error.message.search('50') > -1 && message.error('服务异常')
      error.message === 'Network Error' && message.error('网络异常')
    } else {
      message.error('服务异常')
    }
    return Promise.reject(error)
  }
)

// axios.interceptors.response.use(undefined, (error) => {
//   console.log(error)
//   return Promise.reject(error)
// })

export default axios

function CodeError(data) {
  this.name = 'LogicalError'
  this.code = data?.code
  this.data = data?.data
  this.message = data?.message
}
