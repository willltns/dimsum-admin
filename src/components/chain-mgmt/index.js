import React, { useState, useEffect, useCallback } from 'react'
import { Button, Form, Input, Modal, Table } from 'antd'

import { addChain, editChain, fetchChainList } from './xhr'
import ImgUpload, { handleFileUpload } from '@/components/img-upload'
import { fileDomain } from '@/consts'

function ChainMGMT(props) {
  const { updateChainList } = props
  const [state, setState] = useState({
    modalVisible: false,
    curModify: null,
    dataSource: [],
    tableLoading: false,
    editLoading: false,
  })
  const { modalVisible, curModify, dataSource, tableLoading, editLoading } = state

  const handleChainList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    fetchChainList()
      .then((res) => {
        updateChainList(res?.list || [])
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [] }))
      })
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [updateChainList])

  useEffect(() => {
    if (modalVisible) handleChainList()
  }, [modalVisible, handleChainList])

  const onFormFinish = async (values) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      const params = { ...values }
      params.logo = values.logo[0]?.response || (await handleFileUpload(values.logo[0]?.originFileObj))
      curModify?.id && (params.id = curModify.id)
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
                    ? // prettier-ignore
                      [{ response: curModify.logo, uid: '1', status: 'done', name: '', thumbUrl: fileDomain + curModify.logo }]
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
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: '请上传主网 Logo' }]}
          >
            <ImgUpload />
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
