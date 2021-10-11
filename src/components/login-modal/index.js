import React from "react";
import { Button, Form, Input, Modal } from "antd";

function LoginModal() {
  return (
    <Modal
      centered
      width={400}
      footer={null}
      visible={false}
      closable={false}
      keyboard={false}
      maskClosable={false}
      bodyStyle={{ padding: "32px 40px" }}
    >
      <Form autoComplete="off" onFinish={console.log}>
        <Form.Item
          label="账号"
          name="name"
          rules={[{ required: true, message: "账号不得为空" }]}
        >
          <Input autoFocus placeholder="请输入账号" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="psw"
          rules={[{ required: true, message: "密码不得为空" }]}
        >
          <Input placeholder="请输入密码" />
        </Form.Item>

        <Form.Item noStyle>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;
