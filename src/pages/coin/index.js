// import ss from './index.module.less'

import React from 'react'
import { Button, Modal, Space, Table, Popconfirm, Row } from 'antd'

import CoinForm from '@/components/coin-form'

import { chainTypeList, chainTypeMap, coinAuditStatusList, coinAuditStatusMap } from '@/consts'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import ChainMGMT from '@/components/chain-mgmt'

const data = [
  {
    coinId: 1,
    coinName: 'Baby Shark Doge',
    coinSymbol: 'BSD',
    coinChain: 20,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 10,

    auditStatus: 20,
    coinUpvotes: 1112,
    coinUpvotesToday: 656,
  },
  {
    coinId: 2,
    coinName: 'Baby Shark Doge',
    coinSymbol: 'BSD',
    coinChain: 20,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 10,
    auditStatus: 10,
    coinUpvotes: 1112,
    coinUpvotesToday: 656,
  },
  {
    coinId: 3,
    coinName: 'Baby Shark Doge',
    coinSymbol: 'BSD',
    coinChain: 10,
    picUrl: 'https://',
    linkUrl: 'https://',
    type: 10,
    auditStatus: 30,
    coinUpvotes: 1112,
    coinUpvotesToday: 656,
  },
]

const CoinMGMT = () => {
  const [state, setState] = React.useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredChainType: null,
    filteredAuditStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinId: '',
    coinName: '',
    coinSymbol: '',
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
    filteredChainType,
    filteredAuditStatus,
    sortedField,
    sortedOrder,
    coinId,
    coinName,
    coinSymbol,
    contactEmail,
    contactTelegram,
    remark,
    modalVisible,
    modifyId,
  } = state

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
    const { coinChain, auditStatus } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current,
      pageSize,
      filteredChainType: coinChain?.[0],
      filteredAuditStatus: auditStatus?.[0],
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
      ...getColumnSearchProps('代币 id', 'coinId', handleInputSearch, coinId),
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
      title: '主网',
      dataIndex: 'coinChain',
      width: 150,
      ellipsis: true,
      filteredValue: filteredChainType ? [filteredChainType] : null,
      filterMultiple: false,
      filters: chainTypeList,
      render: (t) => chainTypeMap[t]?.text,
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      width: 88,
      filteredValue: filteredAuditStatus ? [filteredAuditStatus] : null,
      filterMultiple: false,
      filters: coinAuditStatusList,
      render: (t) => coinAuditStatusMap[t]?.text,
    },
    {
      title: '投票数',
      dataIndex: 'coinUpvotes',
      width: 100,
      sorter: true,
      sortOrder: sortedField === 'coinUpvotes' ? sortedOrder : false,
    },
    {
      title: '今日投票数',
      dataIndex: 'coinUpvotesToday',
      width: 100,
      sorter: true,
      sortOrder: sortedField === 'coinUpvotesToday' ? sortedOrder : false,
    },

    {
      title: '审核时间（状态变更）',
      dataIndex: 'auditTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'auditTime' ? sortedOrder : false,
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
        <Space align="end">
          <Button
            type="link"
            size="small"
            onClick={() => setState((state) => ({ ...state, modalVisible: true, modifyId: r.id }))}
          >
            修改
          </Button>

          <Popconfirm
            title={`上市 $${r.coinSymbol} ？`}
            disabled={+r.auditStatus === 10}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="link" size="small" disabled={+r.auditStatus === 10}>
              上市
            </Button>
          </Popconfirm>

          <Popconfirm
            title={`下市 $${r.coinSymbol} ？`}
            disabled={+r.auditStatus === 20}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="text" size="small" disabled={+r.auditStatus === 20}>
              下市
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section>
      <Row justify="space-between">
        <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
          添加代币
        </Button>
        <ChainMGMT />
      </Row>

      <Space style={{ width: '100%' }}>
        <br />
      </Space>
      <Table
        bordered
        rowKey="coinId"
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
        width={1000}
        footer={null}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title={modifyId ? '修改代币' : '添加代币'}
        visible={modalVisible}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, modifyId: null }))}
        bodyStyle={{ height: '80vh', overflowY: 'auto' }}
      >
        <CoinForm />
      </Modal>
    </section>
  )
}

export default CoinMGMT
