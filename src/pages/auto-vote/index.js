// import ss from './index.module.less'

import React from 'react'
import { Button, Modal, Space, Table, Form, DatePicker, Col, InputNumber, Popconfirm, Input } from 'antd'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import moment from 'moment'
import XhrCoinSelect from '@/components/xhr-coin-select'
import { autoVoteStatusList, autoVoteStatusMap } from './consts'

const data = [
  {
    id: 1,
    coinId: 112,
    coinName: 'FLOKI',
    coinSymbol: 'FLOKI',
    status: 10,
    autoVotes: 300,
    autoVotedVotes: 11,
    coinUpvotes: 33333,
    coinUpvotesToday: 2222,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-15 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 3,
    coinId: 115,
    coinName: 'FLOKI',
    coinSymbol: 'FLOKI',
    status: 20,
    autoVotes: 300,
    autoVotedVotes: 11,
    coinUpvotes: 33333,
    coinUpvotesToday: 2222,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-15 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 2,
    coinId: 115,
    coinName: 'FLOKI',
    coinSymbol: 'FLOKI',
    status: 30,
    autoVotes: 300,
    autoVotedVotes: 11,
    coinUpvotes: 33333,
    coinUpvotesToday: 2222,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-15 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 55,
    coinId: 115,
    coinName: 'FLOKI',
    coinSymbol: 'FLOKI',
    status: 40,
    autoVotes: 300,
    autoVotedVotes: 11,
    coinUpvotes: 33333,
    coinUpvotesToday: 2222,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-15 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 44,
    coinId: 115,
    coinName: 'FLOKI',
    coinSymbol: 'FLOKI',
    status: 50,
    autoVotes: 300,
    autoVotedVotes: 222,
    coinUpvotes: 33333,
    coinUpvotesToday: 2222,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-15 12:00:00',
    remark: '范德萨发个',
  },
]

const AutoVote = () => {
  const [state, setState] = React.useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinId: '',
    coinName: '',
    coinSymbol: '',
    remark: '',
    modalVisible: false,
    curCoinVoteStat: {},
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
    remark,
    modalVisible,
    curCoinVoteStat,
  } = state

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
    const { status } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current,
      pageSize,
      filteredStatus: status?.[0],
      sortedField: field,
      sortedOrder: order,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value }))

  const columns = [
    {
      title: '代币Id',
      dataIndex: 'coinId',
      fixed: 'left',
      width: 80,
      ...getColumnSearchProps('代币Id', 'coinId', handleInputSearch, coinId),
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
      width: 120,
      ...getColumnSearchProps('代币符号', 'coinSymbol', handleInputSearch, coinSymbol),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'startTime' ? sortedOrder : false,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'endTime' ? sortedOrder : false,
    },
    {
      title: '状态',
      width: 88,
      dataIndex: 'status',
      filteredValue: filteredStatus ? [filteredStatus] : null,
      filterMultiple: false,
      filters: autoVoteStatusList,
      render: (t) => autoVoteStatusMap[t]?.text,
    },
    {
      title: '添加票数',
      dataIndex: 'autoVotes',
      width: 120,
    },
    {
      title: '已添加票数',
      dataIndex: 'autoVotedVotes',
      width: 120,
    },
    {
      title: '总投票数',
      dataIndex: 'coinUpvotes',
      width: 120,
    },
    {
      title: '今日投票数',
      dataIndex: 'coinUpvotesToday',
      width: 120,
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
          <Popconfirm
            title={`激活 $${r.coinSymbol} ？`}
            disabled={+r.status !== 10}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="link" size="small" disabled={+r.status !== 10}>
              激活
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`取消 $${r.coinSymbol} ？`}
            disabled={+r.status === 50 || +r.status === 40}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="text" size="small" disabled={+r.status === 50 || +r.status === 40}>
              取消
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`删除 $${r.coinSymbol} ？`}
            disabled={+r.status !== 50 && +r.status !== 40}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="text" size="small" danger disabled={+r.status !== 50 && +r.status !== 40}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加自动投票
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

      {/* 自动投票设置 */}
      <Modal
        centered
        width={600}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title="添加自动投票"
        okText="添加"
        visible={modalVisible}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false }))}
        afterClose={() => {
          form.resetFields()
          setState((state) => ({ ...state, autoVoteEdit: null }))
        }}
        onOk={() => {
          form
            .validateFields()
            .then(console.log)
            .catch(() => {})
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          onValuesChange={(changedValues) => {
            if (Object.keys(changedValues || {})?.[0] !== 'coinId') return
            if (!changedValues?.coinId) {
              setState((state) => ({ ...state, curCoinVoteStat: {} }))
              return
            }
            setState((state) => ({ ...state, curCoinVoteStat: { coinUpvotes: 11122, coinUpvotesToday: 123 } }))
          }}
        >
          <Form.Item label="投票代币" name="coinId" rules={[{ required: true }]}>
            <XhrCoinSelect />
          </Form.Item>

          <Form.Item noStyle>
            <Col offset={5} style={{ marginBottom: 24 }}>
              <span>
                当前总投票数: <b>{curCoinVoteStat.coinUpvotes || '--'}</b>
              </span>
              &emsp;&emsp;
              <span>
                今日投票数: <b>{curCoinVoteStat.coinUpvotesToday || '--'}</b>
              </span>
            </Col>
          </Form.Item>
          <Form.Item label="添加投票数" name="autoVotes" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="输入正整数" />
          </Form.Item>
          <Form.Item label="投票时间段" name="timeRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:00"
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
              }}
            />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  )
}

export default AutoVote
