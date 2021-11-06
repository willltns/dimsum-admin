import ss from './index.module.less'

import { BrowserRouter } from 'react-router-dom'
import { MobXProviderContext, Observer } from 'mobx-react'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'moment/locale/zh-cn'

import routes from '@/routes'
import rootStore from '@/stores'

import RouteWithSubRoutes from '../route-with-sub-routes'
import Header from '@/components/header'
import Sidebar from '@/components/siderbar'
import LoginModal from '@/components/login-modal'
import { getServerTime } from '@/assets/xhr'

rootStore.common.getUserinfo()

message.config({ top: 52, duration: 2, maxCount: 1 })

function App() {
  return (
    <MobXProviderContext.Provider value={rootStore}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          <Header />

          <Observer
            render={() =>
              !!rootStore.common.userinfo && (
                <div className={ss.main}>
                  <Sidebar />
                  <RouteWithSubRoutes routes={routes} />
                </div>
              )
            }
          />

          <LoginModal />
        </ConfigProvider>
      </BrowserRouter>
    </MobXProviderContext.Provider>
  )
}

export default App

window.addEventListener(
  'beforeunload',
  () => {
    rootStore.common.intervalTimer && clearInterval(rootStore.common.intervalTimer)
    return null
  },
  false
)

document.addEventListener('visibilitychange', function () {
  // 用户回到页面
  if (document.visibilityState !== 'visible') return
  // prettier-ignore
  getServerTime().then(res => rootStore.common.updateUnixTS(res?.date)).catch(()=> {})
})
