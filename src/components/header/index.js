import ss from './index.module.less'
import logo from '@/assets/img/logo.png'

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Button, Dropdown, Form, Input, Modal, Row } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import moment from 'moment'

import { logout } from '@/assets/xhr'
import { updateUser } from '@/pages/mi-user/xhr'
import { useStore } from '@/utils/hooks/useStore'

function Header() {
  const { pathname } = useLocation()
  const { common } = useStore()

  const [{ modalVisible, editLoading }, setState] = React.useState({ modalVisible: false, editLoading: false })

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
            <div className={ss.ol}>
              <div onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>修改密码</div>
              <div onClick={onLogout}>退出登录</div>
            </div>
          }
        >
          <i className={ss.charAvatar}>{common.userinfo?.name?.[0] || '?'}</i>
        </Dropdown>
      </div>

      {/* 编辑用户信息 */}
      <Modal
        width={444}
        footer={null}
        destroyOnClose
        title="修改密码"
        keyboard={false}
        maskClosable={false}
        visible={modalVisible}
        closable={!editLoading}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false }))}
      >
        <Form
          autoComplete="off"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => {
            setState((state) => ({ ...state, editLoading: true }))
            updateUser({ ...values, id: common.userinfo.id })
              .then(() => {
                onLogout()
                setState((state) => ({ ...state, editLoading: false, modalVisible: false }))
              })
              .catch(() => setState((state) => ({ ...state, editLoading: false })))
          }}
        >
          <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="新密码" name="password" rules={[{ required: true, whitespace: true }, { min: 8 }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: true, whitespace: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject(new Error('两次输入的密码不匹配'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item noStyle>
            <Row justify="center" style={{ marginTop: 24 }}>
              <Button htmlType="submit" type="primary" loading={editLoading}>
                确定修改
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </header>
  )
}

export default observer(Header)
