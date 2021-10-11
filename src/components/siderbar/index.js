import ss from './index.module.less'

import React from 'react'
import { Menu, Button } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { DesktopOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

function Sidebar() {
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
        <Menu.Item key="/coin" icon={<DesktopOutlined />}>
          代币管理
        </Menu.Item>
        <Menu.Item key="/auto-vote" icon={<DesktopOutlined />}>
          自动投票管理
        </Menu.Item>
        <Menu.Item key="/advert" icon={<DesktopOutlined />}>
          广告管理
        </Menu.Item>
        <Menu.Item key="/vote-promo" icon={<DesktopOutlined />}>
          投票推广管理
        </Menu.Item>
        {/*<Menu.Item key="/ui-user" icon={<DesktopOutlined />}>
          前台用户管理
        </Menu.Item>*/}
        <Menu.Item key="/mi-user" icon={<DesktopOutlined />}>
          后台用户管理
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default Sidebar
