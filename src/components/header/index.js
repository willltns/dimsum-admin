import ss from './index.module.less'
import bib from '@/assets/img/birb.png'

import React, { useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Dropdown } from 'antd'

function Header() {
  const history = useHistory()
  const { pathname } = useLocation()

  const userinfo = {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <header className={ss.header}>
      <Link className="logo" to="/">
        Dimsum
      </Link>
      <div className={ss.admin}>
        {userinfo && (
          <Dropdown arrow placement="bottomCenter" overlay={<div className={ss.logoutBtn}>退出登录</div>}>
            <i className={ss.charAvatar}>W</i>
            {/*<img src={bib} alt="avatar" />*/}
          </Dropdown>
        )}
      </div>
    </header>
  )
}

export default Header
