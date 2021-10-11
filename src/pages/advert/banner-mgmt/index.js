// import ss from './index.module.less'

import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Button, DatePicker, Form, Input, Modal, Select, Table, Upload, Space, Popconfirm } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { adStatusList, adStatusMap, advertTypeList, advertTypeMap } from '@/consts'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'

const data = [
  {
    id: 1,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 10,
    adStatus: 10,
  },
  {
    id: 2,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 20,
    adStatus: 20,
  },
  {
    id: 13,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 30,
    adStatus: 30,
  },
  {
    id: 4,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 10,
    adStatus: 30,
  },
]

const BannerMGMT = () => {
  const [state, setState] = useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredType: null,
    filteredAdStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinName: '',
    contactEmail: '',
    contactTelegram: '',
    remark: '',
    modalVisible: false,
    modifyId: null,
  })
  const {
    total,
    current,
    pageSize,
    dataSource,
    filteredType,
    filteredAdStatus,
    sortedField,
    sortedOrder,
    coinName,
    contactEmail,
    contactTelegram,
    remark,
    modalVisible,
    modifyId,
  } = state

  useEffect(() => {
    console.log('request', state)
  }, [
    current,
    pageSize,
    filteredType,
    filteredAdStatus,
    sortedField,
    sortedOrder,
    coinName,
    contactEmail,
    contactTelegram,
    remark,
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
    const { type, adStatus } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current,
      pageSize,
      filteredType: type?.[0],
      filteredAdStatus: adStatus?.[0],
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
      title: '横幅链接',
      dataIndex: 'picUrl',
      width: 200,
    },
    {
      title: '跳转链接',
      dataIndex: 'linkUrl',
      width: 200,
    },
    {
      title: '横幅类型',
      dataIndex: 'type',
      width: 120,
      filteredValue: filteredType ? [filteredType] : null,
      filterMultiple: false,
      filters: advertTypeList,
      render: (t) => advertTypeMap[t]?.text,
    },
    {
      title: '状态',
      dataIndex: 'adStatus',
      width: 88,
      filteredValue: filteredAdStatus ? [filteredAdStatus] : null,
      filterMultiple: false,
      filters: adStatusList,
      render: (t) => adStatusMap[t]?.text,
    },
    {
      title: '上架时间',
      dataIndex: 'putOnTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'putOnTime' ? sortedOrder : false,
    },
    {
      title: '下架时间',
      dataIndex: 'putOffTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'putOffTime' ? sortedOrder : false,
    },

    {
      title: '价格',
      dataIndex: 'price',
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
            onClick={() => setState((state) => ({ ...state, modalVisible: true, modifyId: r.id }))}
          >
            修改
          </Button>
          <Popconfirm title={`上架 ${r.coinName} ？`} disabled={+r.adStatus === 20} onConfirm={() => console.log(r.id)}>
            <Button type="link" size="small" disabled={+r.adStatus === 20}>
              上架
            </Button>
          </Popconfirm>
          <Popconfirm title={`下架 ${r.coinName} ？`} disabled={+r.adStatus === 30} onConfirm={() => console.log(r.id)}>
            <Button type="text" size="small" disabled={+r.adStatus === 30}>
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
        添加横幅广告
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

      {/* 编辑弹窗 */}
      <Modal
        centered
        width={600}
        keyboard={false}
        maskClosable={false}
        title={modifyId ? '修改广告' : '添加广告'}
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
          <Form.Item label="名称" name="coinName" rules={[{ required: true }]}>
            <Input placeholder="输入代币名称（通常）" />
          </Form.Item>
          <Form.Item label="类型" name="类型" rules={[{ required: true }]}>
            <Select placeholder="选择广告类型">
              {advertTypeList.map((item) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="图片"
            name="logo"
            getValueFromEvent={(e) => {
              console.log('Upload event:', e)
              if (Array.isArray(e)) {
                return e
              }
              return e && e.fileList
            }}
            valuePropName="fileList"
            rules={[{ required: true }]}
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="链接" name="linkUrl" rules={[{ required: true }]}>
            <Input placeholder="点击广告 banner 时的跳转链接" />
          </Form.Item>
          <Form.Item label="价格" name="price" rules={[{ required: true }]}>
            <Input />
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
          <Form.Item label="邮箱" name="contactEmail">
            <Input placeholder="联系邮箱" />
          </Form.Item>
          <Form.Item label="电报" name="contactTelegram">
            <Input placeholder="联系电报" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default BannerMGMT
