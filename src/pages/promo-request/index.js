// import ss from './index.module.less'

import { observer } from 'mobx-react'
import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Space, Table, Form, Input, Popconfirm } from 'antd'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { reqStatusList, reqStatusMap } from './consts'
import { copy } from '@/utils/copyToClipboard'
import { fetchPromoApplyList, updatePromoRequestStatus, deletePromoRequest } from './xhr'

const MiUser = () => {
  const [state, setState] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredStatus: 10,
    username: '',
    remark: '',
    contactTg: '',
    coinInfo: '',
    promoService: '',
    source: '',
    referralCode: '',
    sortedField: null,
    sortedOrder: null,
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
    username,
    remark,
    contactTg,
    coinInfo,
    promoService,
    source,
    referralCode,
    sortedField,
    sortedOrder,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
  } = state

  const handlePromoApplyList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      username,
      remark,
      contactTg,
      coinInfo,
      promoService,
      source,
      referralCode,
      status: filteredStatus,
      sortedField,
      sortedOrder,
    }

    fetchPromoApplyList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [
    current,
    pageSize,
    username,
    remark,
    contactTg,
    coinInfo,
    promoService,
    source,
    referralCode,
    filteredStatus,
    sortedField,
    sortedOrder,
  ])

  useEffect(() => {
    handlePromoApplyList()
  }, [handlePromoApplyList])

  const [form] = Form.useForm()

  const handleEditOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const params = { ...values }
      params.id = curModify.id
      await updatePromoRequestStatus(params)

      setState((state) => ({ ...state, editLoading: false, modalVisible: false, curModify: null }))
      handlePromoApplyList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      status ? await updatePromoRequestStatus({ id, status }) : await deletePromoRequest({ id })
      setState((state) => ({ ...state, editLoading: false }))
      handlePromoApplyList()
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

  const onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { status } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current: state.pageSize === pageSize ? current : 1,
      pageSize,
      filteredStatus: status?.[0],
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 66 },
    {
      title: '广告申请服务',
      dataIndex: 'promoService',
      width: 240,
      ...getColumnSearchProps('广告申请服务', 'promoService', handleInputSearch, promoService),
      // prettier-ignore
      render: (t) => t?.split('$$$').reverse().map((i) => <div key={i}>{i}</div>),
    },
    {
      title: '申请用户',
      dataIndex: 'username',
      width: 150,
      ...getColumnSearchProps('申请用户', 'username', handleInputSearch, username),
    },
    {
      title: '用户联系电报',
      dataIndex: 'contactTg',
      width: 150,
      ...getColumnSearchProps('用户联系电报', 'contactTg', handleInputSearch, contactTg),
    },
    {
      title: '申请时间',
      width: 170,
      dataIndex: 'createTime',
      sorter: true,
      sortOrder: sortedField === 'createTime' ? sortedOrder : false,
    },
    {
      title: '备注',
      width: 200,
      dataIndex: 'remark',
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
    },
    {
      title: '代币或其他申请',
      dataIndex: 'coinInfo',
      width: 150,
      ...getColumnSearchProps('代币或其他申请', 'coinInfo', handleInputSearch, coinInfo),
    },
    {
      title: '推荐人 BSC',
      dataIndex: 'referrerBscAddress',
      width: 150,
      render: (t) => (t?.trim() ? <div onClick={() => copy(t)}>{t.slice(0, 6) + '...' + t.slice(-6)}</div> : ''),
    },
    {
      title: '推荐人 Code',
      dataIndex: 'referralCode',
      width: 150,
      ...getColumnSearchProps('推荐人 Code', 'referralCode', handleInputSearch, referralCode),
    },
    {
      title: '推荐人电报',
      dataIndex: 'referrerContactTg',
      width: 150,
    },
    {
      title: '推荐人',
      dataIndex: 'referrerUsername',
      width: 150,
    },
    {
      title: '认识 YYDS 的渠道',
      dataIndex: 'source',
      width: 155,
      ellipsis: true,
      ...getColumnSearchProps('认识 YYDS 的渠道', 'source', handleInputSearch, source),
    },
    {
      title: '状态',
      width: 66,
      align: 'center',
      dataIndex: 'status',
      fixed: 'right',
      filteredValue: filteredStatus ? [filteredStatus] : null,
      filterMultiple: false,
      filters: reqStatusList,
      render: (t) => (
        <span style={+t === 10 ? { color: '#00d62f', fontWeight: 500 } : undefined}>{reqStatusMap[t]?.text}</span>
      ),
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
            type="text"
            size="small"
            onClick={() => {
              setState((state) => ({ ...state, modalVisible: true, curModify: r }))
              setTimeout(() => form.setFieldsValue({ remark: r.remark }))
            }}
          >
            备注
          </Button>
          <Popconfirm
            title={`确定将 ID 为 ${r.id} 的数据置为已处理？`}
            disabled={+r.status === 20 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="link" size="small" disabled={+r.status === 20 || editLoading}>
              处理
            </Button>
          </Popconfirm>
          <Popconfirm title={`删除 ID 为 ${r.id} 的数据`} onConfirm={() => handleUpdateStatus(r.id)}>
            <Button type="text" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section>
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

      {/* 编辑用户信息 */}
      <Modal
        centered
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title={`ID ${curModify?.id} 的备注`}
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: null, curModify: null }))}
        afterClose={form.resetFields}
        onOk={handleEditOk}
      >
        <Form form={form} autoComplete="off" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  )
}

export default observer(MiUser)
