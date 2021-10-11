// import ss from "./index.module.less";

import { Tabs } from 'antd'

import React from 'react'
import BannerMGMT from '@/pages/advert/banner-mgmt'
import PromoCoinMGMT from '@/pages/advert/promo-coin-mgmt'

const Home = () => {
  return (
    <section>
      <Tabs>
        <Tabs.TabPane tab="横幅广告" key="1">
          <BannerMGMT />
        </Tabs.TabPane>
        <Tabs.TabPane tab="推广代币" key="2">
          <PromoCoinMGMT />
        </Tabs.TabPane>
      </Tabs>
    </section>
  )
}

export default Home
