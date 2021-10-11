import React, { useState } from 'react'
import { Button, Form, Input, Modal, Table, Upload } from 'antd'
import { chainTypeList } from '@/consts'
import { UploadOutlined } from '@ant-design/icons'

const data = chainTypeList.map((item, index) => ({ id: item.value, chainName: item.text, sort: index }))

function ChainMGMT() {
  const [state, setState] = useState({ modalVisible: false, modifyChain: null })
  const { modalVisible, modifyChain } = state

  const columns = [
    { title: 'id', dataIndex: 'id' },
    { title: '主网名', dataIndex: 'chainName', width: 270 },
    { title: '排序', dataIndex: 'sort', width: 66 },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      render: (_, r) => (
        <Button type="link" size="small" onClick={() => setState((state) => ({ ...state, modifyChain: r }))}>
          修改
        </Button>
      ),
    },
  ]
  return (
    <>
      <Button onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>主网类型管理</Button>

      {/* 列表弹窗 */}
      <Modal
        footer={null}
        width={600}
        keyboard={false}
        visible={modalVisible}
        maskClosable={false}
        title="主网类型管理"
        onCancel={() => setState((state) => ({ ...state, modalVisible: false }))}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" onClick={() => setState((state) => ({ ...state, modifyChain: {} }))}>
            添加主网
          </Button>
        </div>

        <Table rowKey="id" bordered columns={columns} dataSource={data} pagination={false} />
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        footer={null}
        keyboard={false}
        visible={!!modifyChain}
        maskClosable={false}
        title={modifyChain?.id ? '修改主网名' : '添加主网'}
        destroyOnClose
        onCancel={() => setState((state) => ({ ...state, modifyChain: null }))}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={(value) => {
            console.log(value)
            console.log(modifyChain?.id)
          }}
          initialValues={modifyChain?.id ? { ...modifyChain } : undefined}
        >
          <Form.Item label="主网名" name="name" rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="符号" name="Symbol" rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Logo"
            name="logo"
            getValueFromEvent={(e) => {
              console.log('Upload event:', e)
              if (Array.isArray(e)) {
                return e
              }
              return e && e.fileList
            }}
            valuePropName="fileList"
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="排序值" name="sort">
            <Input />
          </Form.Item>

          <Form.Item noStyle>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button htmlType="submit" type="primary">
                {modifyChain?.id ? '修改' : '添加'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default React.memo(ChainMGMT)
