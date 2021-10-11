// import ss from './index.module.less'

import React from 'react'
import { Button, Modal, Space, Table, Form, Input, Popconfirm } from 'antd'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { miUserStatusList, miUserStatusMap } from './consts'

const data = [
  {
    id: 1,
    userName: 'will',
    status: 20,
    createTime: '2020-12-12 12:00:00',
    modifyTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 2,
    userName: 'james',
    status: 10,
    createTime: '2020-12-12 12:00:00',
    modifyTime: '2020-11-01 05:55:00',
    remark: '反反复复',
  },
]

const MiUser = () => {
  const [state, setState] = React.useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredStatus: null,
    userName: '',
    remark: '',
    modalVisible: false,
    modifyUser: null,
  })
  const { total, current, pageSize, dataSource, filteredStatus, userName, remark, modalVisible, modifyUser } = state

  const [form] = Form.useForm()

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
      current,
      pageSize,
      filteredStatus: status?.[0],
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value }))

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: 'userName',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('用户', 'userName', handleInputSearch, userName),
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
    {
      title: '添加时间',
      width: 170,
      dataIndex: 'createTime',
    },
    {
      title: '修改时间',
      width: 170,
      dataIndex: 'modifyTime',
    },
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
              form.setFieldsValue({ ...r })
              setState((state) => ({ ...state, modalVisible: true, modifyUser: r }))
            }}
          >
            修改
          </Button>
          <Popconfirm title={`恢复 ${r.userName} ？`} disabled={+r.status === 10} onConfirm={() => console.log(r.id)}>
            <Button type="link" size="small" disabled={+r.status === 10}>
              恢复
            </Button>
          </Popconfirm>
          <Popconfirm title={`禁用 ${r.userName} ？`} disabled={+r.status === 20} onConfirm={() => console.log(r.id)}>
            <Button type="text" size="small" danger disabled={+r.status === 20}>
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
        title={modifyUser?.id ? '修改用户信息' : '添加用户信息'}
        visible={modalVisible}
        afterClose={form.resetFields}
        onCancel={() => setState((state) => ({ ...state, modalVisible: null, modifyUser: null }))}
        onOk={() =>
          form
            .validateFields()
            .then(console.log)
            .catch(() => {})
        }
      >
        <Form form={form} autoComplete="off" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="用户名" name="userName" rules={[{ required: true }]}>
            <Input disabled={!!modifyUser?.id} />
          </Form.Item>
          {modifyUser?.id && (
            <Form.Item label="旧密码" name="old">
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item label="密码" name="psw" rules={[{ required: !modifyUser, whitespace: true }, { min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="newPsw"
            rules={[
              { required: !modifyUser, whitespace: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('psw') === value) return Promise.resolve()
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

        {modifyUser?.id && (
          <p>
            修改用户信息时，如果不修改密码，密码相关输入框就留空白。修改时后端逻辑这样判断：如果密码相关输入框为空，直接更新备注字段；如果密码相关输入框不为空，需通过密码相关的校验才可修改
          </p>
        )}
      </Modal>
    </section>
  )
}

export default MiUser
