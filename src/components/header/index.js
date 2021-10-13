import ss from './index.module.less'

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Dropdown } from 'antd'
import { Link, useLocation } from 'react-router-dom'

import { useStore } from '@/utils/hooks/useStore'
import { logout } from '@/assets/xhr'

function Header() {
  const { pathname } = useLocation()
  const { common } = useStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const onLogout = () =>
    logout()
      .then(() => common.updateUserinfo(null))
      .catch(() => {})

  return (
    <header className={ss.header}>
      <Link className="logo" to="/">
        Dimsum
      </Link>

      <div className={ss.user}>
        {common.userinfo && (
          <Dropdown
            arrow
            placement="bottomCenter"
            overlay={
              <div className={ss.logoutBtn} onClick={onLogout}>
                退出登录
              </div>
            }
          >
            <i className={ss.charAvatar}>{common.userinfo.name[0]}</i>
          </Dropdown>
        )}
      </div>
    </header>
  )
}

export default observer(Header)
