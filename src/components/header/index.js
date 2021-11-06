import ss from './index.module.less'
import logo from '@/assets/img/logo.png'

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Dropdown } from 'antd'
import moment from 'moment'
import { Link, useLocation } from 'react-router-dom'

import { useStore } from '@/utils/hooks/useStore'
import { logout } from '@/assets/xhr'

function Header() {
  const { pathname } = useLocation()
  const { common } = useStore()

  useEffect(() => {
    common.timeStart()
  }, [common])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const onLogout = () =>
    logout()
      .then(() => {
        common.updateUserinfo(null)
        localStorage.removeItem('token')
      })
      .catch(() => {})

  return (
    <header className={ss.header}>
      <Link className="logo" to="/">
        <img src={logo} alt="logo" style={{ height: 40 }} />
      </Link>

      {!!common.unixTS && (
        <div className={ss.time}>
          <div>
            <span>UTC+8: </span>
            <b>{moment.unix(common.unixTS).format('YYYY-MM-DD HH:mm:ss')}</b>
          </div>
          <div>
            <span>UTC: </span>
            <b>{moment.unix(common.unixTS - 8 * 3600).format('YYYY-MM-DD HH:mm:ss')}</b>
          </div>
        </div>
      )}

      <div className={ss.user}>
        <Dropdown
          arrow
          placement="bottomCenter"
          overlay={
            <div className={ss.logoutBtn} onClick={onLogout}>
              退出登录
            </div>
          }
        >
          <i className={ss.charAvatar}>{common.userinfo?.name?.[0] || '?'}</i>
        </Dropdown>
      </div>
    </header>
  )
}

export default observer(Header)
