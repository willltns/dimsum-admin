// import ss from './index.module.less'

import React, { useState, useEffect } from 'react'
import { Button, DatePicker, Form, Input, Modal, Table, Space, Popconfirm } from 'antd'
import { promoCoinStatusList, promoCoinStatusMap } from '@/consts'
import moment from 'moment'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import XhrCoinSelect from '@/components/xhr-coin-select'

const data = [
  {
    id: 1,
    coinName: 'https://',
    coinSymbol: 'https://',
    promoStatus: 20,
    promoPrice: 10,
    promoRemark: 10,
    promoTime: '2020-12-20 22:00:00',
    unpromoTime: '2020-12-22 22:00:00',
    contactEmail: 'wwaaaa22ww@qq.com',
    contactTelegram: '@mc_show_er',
  },
  {
    id: 3,
    coinName: 'https://',
    coinSymbol: 'https://',
    promoStatus: 10,
    promoPrice: 10,
    promoRemark: 10,
    promoTime: '2020-12-20 22:00:00',
    unpromoTime: '2020-12-22 22:00:00',
    contactEmail: 'wwaaaa22ww@qq.com',
  },
  {
    id: 4,
    coinName: 'https://',
    coinSymbol: 'https://',
    promoStatus: 30,
    promoPrice: 10,
    promoRemark: 10,
    promoTime: '2020-12-20 22:00:00',
    unpromoTime: '2020-12-22 22:00:00',
    contactTelegram: '@mc_show_er',
  },
  {
    id: 5,
    coinName: 'https://',
    coinSymbol: 'https://',
    promoStatus: 20,
    promoPrice: 10,
    promoRemark: '123243r4ff',
    promoTime: '2020-12-20 22:00:00',
    unpromoTime: '2020-12-22 22:00:00',
    contactEmail: 'wwaaaa22ww@qq.com',
    contactTelegram: '@mc_show_er',
  },
]

const PromoCoinMGMT = () => {
  const [state, setState] = useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredPromoStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinName: '',
    coinSymbol: '',
    contactEmail: '',
    contactTelegram: '',
    promoRemark: '',
    modalVisible: false,
    modifyId: null,
  })
  const {
    total,
    current,
    pageSize,
    dataSource,
    filteredPromoStatus,
    sortedField,
    sortedOrder,
    coinName,
    coinSymbol,
    contactEmail,
    contactTelegram,
    promoRemark,
    modalVisible,
    modifyId,
  } = state

  useEffect(() => {
    console.log('request', state)
  }, [
    current,
    pageSize,
    filteredPromoStatus,
    sortedField,
    sortedOrder,
    coinName,
    coinSymbol,
    contactEmail,
    contactTelegram,
    promoRemark,
  ])

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

  const onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { promoStatus } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current,
      pageSize,
      filteredPromoStatus: promoStatus?.[0],
      sortedField: field,
      sortedOrder: order,
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
      dataIndex: 'promoStatus',
      width: 88,
      filteredValue: filteredPromoStatus ? [filteredPromoStatus] : null,
      filterMultiple: false,
      filters: promoCoinStatusList,
      render: (t) => promoCoinStatusMap[t]?.text,
    },
    {
      title: '上架时间',
      dataIndex: 'promoTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'promoTime' ? sortedOrder : false,
    },
    {
      title: '下架时间',
      dataIndex: 'unpromoTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'unpromoTime' ? sortedOrder : false,
    },

    {
      title: '价格',
      dataIndex: 'promoPrice',
      width: 120,
    },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      width: 200,
      ...getColumnSearchProps('联系邮箱', 'contactEmail', handleInputSearch, contactEmail),
    },
    {
      title: '联系电报',
      dataIndex: 'contactTelegram',
      width: 200,
      ...getColumnSearchProps('联系电报', 'contactTelegram', handleInputSearch, contactTelegram),
    },
    {
      title: '备注',
      dataIndex: 'promoRemark',
      width: 200,
      ...getColumnSearchProps('备注', 'promoRemark', handleInputSearch, promoRemark),
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
            onClick={() => setState((state) => ({ ...state, modalVisible: true, modifyId: r.id }))}
          >
            修改
          </Button>
          <Popconfirm
            title={`上架 $${r.coinSymbol} ？`}
            disabled={+r.promoStatus === 20}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="link" size="small" disabled={+r.promoStatus === 20}>
              上架
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`下架 $${r.coinSymbol} ？`}
            disabled={+r.promoStatus === 30}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="text" size="small" disabled={+r.promoStatus === 30}>
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
        title={modifyId ? '修改推广代币' : '添加推广代币'}
        visible={modalVisible}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, modifyId: null }))}
        afterClose={form.resetFields}
        onOk={() => {
          form
            .validateFields()
            .then((values) => console.log(values))
            .catch(() => {})
        }}
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <Form.Item label="代币" name="coinId" rules={[{ required: true }]}>
            <XhrCoinSelect disabled={!!modifyId} />
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

          <Form.Item label="价格" name="promoPrice" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="备注" name="promoRemark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default PromoCoinMGMT
