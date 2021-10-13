// import ss from './index.module.less'

import React, { useState, useEffect, useCallback } from 'react'
import { Button, DatePicker, Form, Input, Modal, Table, Space, Popconfirm } from 'antd'
import { promoCoinStatusList, promoCoinStatusMap } from '@/consts'
import moment from 'moment'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import XhrCoinSelect from '@/components/xhr-coin-select'
import { fetchPromoCoinList, addPromoCoin, updatePromoCoin, updatePromoCoinStatus } from '@/pages/advert/xhr'

const PromoCoinMGMT = () => {
  const [state, setState] = useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinName: '',
    coinSymbol: '',
    contactEmail: '',
    contactTelegram: '',
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
    sortedField,
    sortedOrder,
    coinId,
    coinName,
    coinSymbol,
    contactEmail,
    contactTg,
    remark,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
  } = state

  const handlePromoCoinList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      status: filteredStatus,
      sortedField,
      sortedOrder,
      coinId,
      coinName,
      coinSymbol,
      contactEmail,
      contactTg,
      remark,
    }

    fetchPromoCoinList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [
    current,
    pageSize,
    filteredStatus,
    sortedField,
    sortedOrder,
    coinId,
    coinName,
    coinSymbol,
    contactEmail,
    contactTg,
    remark,
  ])

  useEffect(() => {
    handlePromoCoinList()
  }, [handlePromoCoinList])

  const [form] = Form.useForm()

  const handleEditOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const { timeRange, ...params } = values

      params.shelfTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss')
      params.offShelfTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss')

      curModify?.id && (params.id = curModify.id)
      curModify?.id ? await updatePromoCoin(params) : await addPromoCoin(params)
      setState((state) => ({ ...state, editLoading: false, modalVisible: false, curModify: null }))
      handlePromoCoinList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      await updatePromoCoinStatus({ id, status })
      setState((state) => ({ ...state, editLoading: false }))
      handlePromoCoinList()
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
      filteredStatus: status?.join(','),
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    //{ title: 'id', dataIndex: 'id', fixed: 'left', width: 80 },
    {
      title: '代币id',
      dataIndex: 'coinId',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('代币名称', 'coinId', handleInputSearch, coinId),
    },
    {
      title: '代币名称',
      dataIndex: 'coinName',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('代币名称', 'coinName', handleInputSearch, coinName),
    },
    {
      title: '代币符号',
      dataIndex: 'coinSymbol',
      width: 200,
      ...getColumnSearchProps('代币符号', 'coinSymbol', handleInputSearch, coinSymbol),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 88,
      filteredValue: filteredStatus?.split(',') || null,
      filters: promoCoinStatusList,
      render: (t) => promoCoinStatusMap[t]?.text,
    },
    {
      title: '上架时间',
      dataIndex: 'shelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'shelfTime' ? sortedOrder : false,
    },
    {
      title: '下架时间',
      dataIndex: 'offShelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'offShelfTime' ? sortedOrder : false,
    },

    { title: '价格', dataIndex: 'price', width: 120 },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      width: 200,
      ...getColumnSearchProps('联系邮箱', 'contactEmail', handleInputSearch, contactEmail),
    },
    {
      title: '联系电报',
      dataIndex: 'contactTg',
      width: 200,
      ...getColumnSearchProps('联系电报', 'contactTg', handleInputSearch, contactTg),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
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
              const fields = { ...r }
              fields.timeRange = [moment(r.shelfTime), moment(r.offShelfTime)]
              setTimeout(() => form.setFieldsValue({ ...fields }))
            }}
          >
            修改
          </Button>
          <Popconfirm
            title={`上架 $${r.coinSymbol} ？`}
            disabled={+r.status === 20 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="link" size="small" disabled={+r.status === 20 || editLoading}>
              上架
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`下架 $${r.coinSymbol} ？`}
            disabled={+r.status === 30 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 30)}
          >
            <Button type="text" size="small" disabled={+r.status === 30 || editLoading}>
              下架
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加推广代币
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

      {/* 编辑推广代币弹窗 */}
      <Modal
        centered
        width={600}
        keyboard={false}
        maskClosable={false}
        title={curModify?.id ? '修改推广代币' : '添加推广代币'}
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, curModify: null }))}
        afterClose={form.resetFields}
        onOk={handleEditOk}
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <Form.Item label="代币" name="coinId" rules={[{ required: true }]}>
            <XhrCoinSelect disabled={!!curModify?.id} />
          </Form.Item>

          <Form.Item label="上架时间段" name="timeRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:00"
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
              }}
            />
          </Form.Item>

          <Form.Item label="价格" name="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PromoCoinMGMT
