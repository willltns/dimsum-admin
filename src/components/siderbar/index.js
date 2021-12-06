import ss from './index.module.less'

import React from 'react'
import { observer } from 'mobx-react'
import { Menu, Button } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyrightOutlined,
  BlockOutlined,
  DollarCircleOutlined,
  FundOutlined,
  InboxOutlined,
  TeamOutlined,
} from '@ant-design/icons'

import { useStore } from '@/utils/hooks/useStore'

function Sidebar() {
  const { common } = useStore()

  const [collapsed, setColl] = React.useState(false)

  const history = useHistory()
  const location = useLocation()

  const onMenuClick = ({ key }) => {
    history.push(key)
  }

  return (
    <div className={ss.sidebar}>
      <Button type="primary" className={ss.colBtn} onClick={() => setColl((state) => !state)}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <Menu mode="inline" onClick={onMenuClick} inlineCollapsed={collapsed} selectedKeys={[location.pathname]}>
        <Menu.Item key="/coin" icon={<CopyrightOutlined />}>
          代币管理
        </Menu.Item>

        {(common.auditorAuth || common.godAuth) && (
          <>
            <Menu.Item key="/auto-vote" icon={<BlockOutlined />}>
              自动投票管理
            </Menu.Item>
            <Menu.Item key="/advert" icon={<DollarCircleOutlined />}>
              广告管理
            </Menu.Item>
            <Menu.Item key="/promo-request" icon={<FundOutlined />}>
              广告申请管理
            </Menu.Item>
            <Menu.Item key="/vote-promo" icon={<InboxOutlined />}>
              投票推广管理
            </Menu.Item>
          </>
        )}

        {common.godAuth && (
          <Menu.Item key="/mi-user" icon={<TeamOutlined />}>
            后台用户管理
          </Menu.Item>
        )}
      </Menu>
    </div>
  )
}

export default observer(Sidebar)
