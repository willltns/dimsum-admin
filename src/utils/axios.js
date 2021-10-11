// import qs from 'qs'
import axios from 'axios'
import { message } from 'antd'

axios.defaults.baseURL = '/api-v1'

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
  (response) => response.data,

  (error) => {
    console.error('ERROR', error)

    if (error.message) {
      error.message.search('timeout') > -1 && message.error('请求超时')
      error.message.search('404') > -1 && message.error('资源不存在')
      error.message.search('400') > -1 && message.error('请求异常')
      error.message.search('50') > -1 && message.error('服务异常')
    } else {
      message.error('服务异常')
    }
    return Promise.reject(error)
  }
)

export default axios
