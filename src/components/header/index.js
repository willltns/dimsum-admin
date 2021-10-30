import ss from './index.module.less'

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Dropdown, Button } from 'antd'
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
      .then(() => common.updateUserinfo(null))
      .catch(() => {})

  return (
    <header className={ss.header}>
      <Link className="logo" to="/">
        YYDSCoins
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
        {common.userinfo ? (
          <Dropdown
            arrow
            placement="bottomCenter"
            overlay={
              <div className={ss.logoutBtn} onClick={onLogout}>
                退出登录
              </div>
            }
          >
            <i className={ss.charAvatar}>{common.userinfo.name?.[0] || '?'}</i>
          </Dropdown>
        ) : (
          <Button type="link" onClick={() => common.updateUserinfo(null)}>
            登录
          </Button>
        )}
      </div>
    </header>
  )
}

export default observer(Header)
