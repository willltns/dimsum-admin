// import ss from './index.module.less'

import React, { useCallback, useEffect } from 'react'
import { Button, Modal, Space, Table, Form, DatePicker, Col, InputNumber, Popconfirm, Input } from 'antd'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import moment from 'moment'
import XhrCoinSelect from '@/components/xhr-coin-select'
import { autoVoteStatusList, autoVoteStatusMap } from './consts'
import { addAutoVote, fetchAutoVoteList, updateAutoVoteStatus, deleteAutoVote } from '@/pages/auto-vote/xhr'

const AutoVote = () => {
  const [state, setState] = React.useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinId: '',
    coinName: '',
    coinSymbol: '',
    remark: '',
    modalVisible: false,
    tableLoading: false,
    editLoading: false,
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
    tableLoading,
    editLoading,
    curCoinVoteStat,
  } = state

  const handleAutoVoteList = useCallback(() => {
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
      remark,
    }

    fetchAutoVoteList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [current, pageSize, filteredStatus, sortedField, sortedOrder, coinId, coinName, coinSymbol, remark])

  useEffect(() => {
    handleAutoVoteList()
  }, [handleAutoVoteList])

  const [form] = Form.useForm()

  const handleAddOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const { timeRange, ...params } = values

      params.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss')
      params.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss')

      await addAutoVote(params)
      setState((state) => ({ ...state, editLoading: false }))
      handleAutoVoteList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      // status 未传时，调用删除接口
      status ? await updateAutoVoteStatus({ id, status }) : await deleteAutoVote({ id })
      setState((state) => ({ ...state, editLoading: false }))
      handleAutoVoteList()
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
      current,
      pageSize,
      filteredStatus: status?.join(','),
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

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
      filteredValue: filteredStatus?.split(',') || null,
      filters: autoVoteStatusList,
      render: (t) => autoVoteStatusMap[t]?.text,
    },
    { title: '添加票数', dataIndex: 'votes', width: 120 },
    { title: '已添加票数', dataIndex: 'votedVotes', width: 120 },
    { title: '总投票数', dataIndex: 'coinUpvotes', width: 120 },
    { title: '今日投票数', dataIndex: 'coinUpvotesToday', width: 120 },
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
            disabled={+r.status !== 10 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="link" size="small" disabled={+r.status !== 10 || editLoading}>
              激活
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`取消 $${r.coinSymbol} ？`}
            disabled={+r.status === 50 || +r.status === 40 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 50)}
          >
            <Button type="text" size="small" disabled={+r.status === 50 || +r.status === 40 || editLoading}>
              取消
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`删除 $${r.coinSymbol} ？`}
            disabled={(+r.status !== 50 && +r.status !== 40) || editLoading}
            onConfirm={() => handleUpdateStatus(r.id)}
          >
            <Button type="text" size="small" danger disabled={(+r.status !== 50 && +r.status !== 40) || editLoading}>
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
        loading={tableLoading}
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
        okText="添加"
        title="添加自动投票"
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false }))}
        afterClose={() => {
          form.resetFields()
          setState((state) => ({ ...state, autoVoteEdit: null }))
        }}
        onOk={handleAddOk}
      >
        <Form
          form={form}
          labelCol={{ span: 7 }}
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
            <Col offset={7} style={{ marginBottom: 24 }}>
              <span>
                当前总投票数: <b>{curCoinVoteStat.coinUpvotes || '--'}</b>
              </span>
              &emsp;&emsp;
              <span>
                今日投票数: <b>{curCoinVoteStat.coinUpvotesToday || '--'}</b>
              </span>
            </Col>
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
          <Form.Item label="单次最小时间间隔(秒)" name="intervalTimeMin" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="输入正整数" />
          </Form.Item>
          <Form.Item label="单次最大时间间隔(秒)" name="intervalTimeMax" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="输入正整数" />
          </Form.Item>
          <Form.Item label="单次最小数" name="perTimeVotesMin" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="输入正整数" />
          </Form.Item>
          <Form.Item label="单次最大数" name="perTimeVotesMax" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="输入正整数" />
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
