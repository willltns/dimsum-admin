import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Modal, Table, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { addChain, editChain, fetchChainList } from './xhr'
import { uploadFile } from '@/assets/xhr'

function ChainMGMT(props) {
  const [state, setState] = useState({
    modalVisible: false,
    curModify: null,
    dataSource: [],
    tableLoading: false,
    editLoading: false,
  })
  const { modalVisible, curModify, dataSource, tableLoading, editLoading } = state

  const handleChainList = () => {
    setState((state) => ({ ...state, tableLoading: true }))
    fetchChainList()
      .then((res) => {
        props.updateChainList(res?.list || [])
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [] }))
      })
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }

  useEffect(() => {
    if (modalVisible) handleChainList()
  }, [modalVisible])

  const onFormFinish = async (values) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      const params = { ...values }
      curModify?.id && (params.id = curModify.id)
      params.logo = params.logo?.[0]?.response || ''
      curModify?.id ? await editChain({ ...params, id: curModify.id }) : await addChain(params)
      setState((state) => ({ ...state, editLoading: false, curModify: null }))
      handleChainList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '主网名', dataIndex: 'chainName', width: 270 },
    { title: '排序', dataIndex: 'sort', width: 66 },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      render: (_, r) => (
        <Button type="link" size="small" onClick={() => setState((state) => ({ ...state, curModify: r }))}>
          修改
        </Button>
      ),
    },
  ]
  return (
    <>
      <Button onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>主网管理</Button>

      {/* 列表弹窗 */}
      <Modal
        footer={null}
        width={600}
        keyboard={false}
        visible={modalVisible}
        maskClosable={false}
        title="主网管理"
        onCancel={() => setState((state) => ({ ...state, modalVisible: false }))}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" onClick={() => setState((state) => ({ ...state, curModify: {} }))}>
            添加主网
          </Button>
        </div>

        <Table
          rowKey="id"
          bordered
          columns={columns}
          pagination={false}
          loading={tableLoading}
          dataSource={dataSource}
        />
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        footer={null}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        visible={!!curModify}
        closable={!editLoading}
        title={curModify?.id ? '修改主网名' : '添加主网'}
        onCancel={() => setState((state) => ({ ...state, curModify: null }))}
      >
        <Form
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFormFinish}
          initialValues={
            curModify?.id
              ? {
                  ...curModify,
                  logo: curModify.logo
                    ? [{ uid: '001', status: 'done', name: curModify.chainName + ' - icon', response: curModify.logo }]
                    : undefined,
                }
              : undefined
          }
        >
          <Form.Item label="主网名" name="chainName" rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="符号" name="symbol" rules={[{ required: true, whitespace: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Logo"
            name="logo"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            valuePropName="fileList"
          >
            <Upload name="logo" customRequest={handleFileUpload} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="排序值" name="sort">
            <Input />
          </Form.Item>

          <Form.Item noStyle>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button htmlType="submit" type="primary" loading={editLoading}>
                {curModify?.id ? '修改' : '添加'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default React.memo(ChainMGMT)

export async function handleFileUpload({ file, onError, onSuccess }) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await uploadFile(formData)
    onSuccess(res, file)
  } catch (err) {
    onError('上传出错，请重新尝试')
  }
}
