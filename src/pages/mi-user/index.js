// import ss from './index.module.less'

import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Space, Table, Form, Input, Popconfirm } from 'antd'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { miUserStatusList, miUserStatusMap } from './consts'
import { addUser, fetchUserList, updateUser, updateUserStatus } from '@/pages/mi-user/xhr'

const MiUser = () => {
  const [state, setState] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredStatus: null,
    name: '',
    remark: '',
    modalVisible: false,
    curModify: null,
    tableLoading: false,
    editLoading: false,
  })
  const {
    total,
    current,
    pageSize,
    dataSource,
    filteredStatus,
    name,
    remark,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
  } = state

  const handleUserList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = { pageNo: current, pageSize, name, remark, status: filteredStatus }

    fetchUserList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [current, pageSize, name, remark, filteredStatus])

  useEffect(() => {
    handleUserList()
  }, [handleUserList])

  const [form] = Form.useForm()

  const handleEditOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const params = { ...values }

      curModify?.id && (params.id = curModify.id)
      curModify?.id ? await updateUser(params) : await addUser(params)

      setState((state) => ({ ...state, editLoading: false, modalVisible: false, curModify: null }))
      handleUserList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      await updateUserStatus({ id, status })
      setState((state) => ({ ...state, editLoading: false }))
      handleUserList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const pagination = {
    total,
    current,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 30],
    showTotal: (total) => `共 ${total} 条查询结果`,
  }

  const onTableChange = (pagination, filters) => {
    const { current, pageSize } = pagination
    const { status } = filters

    setState((state) => ({
      ...state,
      current: state.pageSize === pageSize ? current : 1,
      pageSize,
      filteredStatus: status?.[0],
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 80 },
    {
      title: '用户',
      dataIndex: 'name',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('用户', 'name', handleInputSearch, name),
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      filteredValue: filteredStatus ? [filteredStatus] : null,
      filterMultiple: false,
      filters: miUserStatusList,
      render: (t) => miUserStatusMap[t]?.text,
    },
    { title: '添加时间', width: 170, dataIndex: 'createTime' },
    { title: '修改时间', width: 170, dataIndex: 'modifyTime' },
    {
      title: '备注',
      width: 200,
      dataIndex: 'remark',
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      width: 160,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setState((state) => ({ ...state, modalVisible: true, curModify: r }))
              setTimeout(() => form.setFieldsValue({ ...r }))
            }}
          >
            修改
          </Button>
          <Popconfirm
            title={`恢复 ${r.name} ？`}
            disabled={+r.status === 10 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 10)}
          >
            <Button type="link" size="small" disabled={+r.status === 10 || editLoading}>
              恢复
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`禁用 ${r.name} ？`}
            disabled={+r.status === 20 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="text" size="small" danger disabled={+r.status === 20 || editLoading}>
              禁用
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加用户
      </Button>
      <Space style={{ width: '100%' }}>
        <br />
      </Space>

      <Table
        bordered
        rowKey="id"
        size="small"
        columns={columns}
        loading={tableLoading}
        pagination={pagination}
        dataSource={dataSource}
        onChange={onTableChange}
        scroll={{ x: columns.reduce((t, { width, fixed }) => (fixed || !width ? t : t + width), 0) }}
      />

      {/* 设置投票推广 */}
      <Modal
        centered
        width={600}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title={curModify ? '修改用户信息' : '添加用户信息'}
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: null, curModify: null }))}
        afterClose={form.resetFields}
        onOk={handleEditOk}
      >
        <Form form={form} autoComplete="off" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="用户名" name="name" rules={[{ required: true, whitespace: true }]}>
            <Input disabled={!!curModify} />
          </Form.Item>
          {curModify && (
            <Form.Item label="旧密码" name="oldPassword">
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item label="密码" name="password" rules={[{ required: !curModify, whitespace: true }, { min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[
              { required: !curModify, whitespace: true },
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
          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  )
}

export default MiUser
