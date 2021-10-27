import React from 'react'
import { observer } from 'mobx-react'
import { Button, Form, Input, Modal } from 'antd'

import { useStore } from '@/utils/hooks/useStore'

function LoginModal() {
  const { common } = useStore()

  const { login, userinfo, loading } = common

  return (
    <Modal
      centered
      width={400}
      footer={null}
      destroyOnClose
      closable={false}
      keyboard={false}
      maskClosable={false}
      visible={userinfo === null}
      bodyStyle={{ padding: '40px 40px 32px' }}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <Form autoComplete="off" onFinish={login}>
        <Form.Item label="用户" name="name" rules={[{ required: true, whitespace: true, message: '账号不得为空' }]}>
          <Input autoFocus placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, whitespace: true, message: '密码不得为空' }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item noStyle>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(LoginModal)
