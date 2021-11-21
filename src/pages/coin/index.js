// import ss from './index.module.less'

import React, { useEffect, useCallback } from 'react'
import { observer } from 'mobx-react'
import { Button, Modal, Space, Table, Popconfirm, Row, message } from 'antd'

import { addCoin, updateCoin, fetchCoinList, updateCoinStatus, deleteCoin } from '@/pages/coin/xhr'
import { coinStatusList, coinStatusMap } from '@/consts'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { useStore } from '@/utils/hooks/useStore'

import UniqueUrlCol from './UniqueUrlCol'
import CoinForm from '@/components/coin-form'
import ChainMGMT from '@/components/chain-mgmt'
import { fetchChainList } from '@/components/chain-mgmt/xhr'
import { handleFileUpload } from '@/components/img-upload'

const CoinMGMT = () => {
  const { common } = useStore()
  const [state, setState] = React.useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredChainType: null,
    filteredAuditStatus: null,
    filteredPromoted: null,
    sortedField: null,
    sortedOrder: null,
    id: '',
    coinName: '',
    coinSymbol: '',
    coinUniqueUrl: '',
    contactEmail: '',
    contactTg: '',
    remark: '',
    modalVisible: false,
    curModify: null,
    tableLoading: false,
    editLoading: false,
    coinChainList: [],
  })
  const {
    total,
    current,
    pageSize,
    dataSource,
    filteredChainType,
    filteredCoinStatus,
    filteredPromoted,
    sortedField,
    sortedOrder,
    id,
    coinName,
    coinSymbol,
    coinUniqueUrl,
    contactEmail,
    contactTg,
    remark,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
    coinChainList,
  } = state

  useEffect(() => {
    fetchChainList()
      .then((res) => setState((state) => ({ ...state, coinChainList: res?.list || [] })))
      .catch(() => {})
  }, [])

  const updateChainList = useCallback((list) => setState((state) => ({ ...state, coinChainList: list })), [])

  const handleCoinList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      coinStatus: filteredCoinStatus,
      coinChain: filteredChainType,
      promoted: filteredPromoted,
      sortedField,
      sortedOrder,
      id,
      coinName,
      coinSymbol,
      coinUniqueUrl,
      contactEmail,
      contactTg,
      remark,
    }

    fetchCoinList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [
    current,
    pageSize,
    filteredCoinStatus,
    filteredChainType,
    filteredPromoted,
    sortedField,
    sortedOrder,
    id,
    coinName,
    coinSymbol,
    coinUniqueUrl,
    contactEmail,
    contactTg,
    remark,
  ])

  useEffect(() => {
    handleCoinList()
  }, [handleCoinList])

  const handleEditOk = async (params, id) => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      params.coinLogo = params.coinLogo[0]?.response || (await handleFileUpload(params.coinLogo[0]?.originFileObj))
      id ? await updateCoin({ ...params, id }) : await addCoin(params)
      setState((state) => ({ ...state, editLoading: false, modalVisible: false }))
      handleCoinList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status, coin) => {
    if (status === 30 && coin.coinSearchPromo) {
      message.warn('该代币当前为推荐搜索代币，请先取消推荐搜索，再进行下市操作')
      return
    }
    setState((state) => ({ ...state, editLoading: true }))

    try {
      // status 未传时，调用删除接口
      status ? await updateCoinStatus({ id, status }) : await deleteCoin({ id })
      setState((state) => ({ ...state, editLoading: false }))
      handleCoinList()
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
    const { coinChain, coinStatus, promoted } = filters
    const { field, order } = sorter

    // TODO 排序时重置页码，新建重置？
    // const pageNo = field === sortedField && order === sortedOrder ? current : 1

    setState((state) => ({
      ...state,
      current,
      pageSize,
      filteredChainType: coinChain?.join(','),
      filteredCoinStatus: coinStatus?.join(','),
      filteredPromoted: promoted?.join(','),
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    {
      title: '代币ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      ...getColumnSearchProps('代币ID', 'id', handleInputSearch, id),
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
      filteredValue: filteredChainType?.split(',') || null,
      filters: coinChainList?.map((item) => ({ text: item.chainName, value: item.id })) || [],
      render: (t) => coinChainList?.find((item) => +item.id === +t)?.chainName,
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
      title: 'Unique Url',
      dataIndex: 'coinUniqueUrl',
      width: 120,
      ...getColumnSearchProps('Unique Url', 'coinUniqueUrl', handleInputSearch, contactEmail),
      render: (_, r) => <UniqueUrlCol record={r} afterEdit={handleCoinList} editable={!common.inputorAuth} />,
    },
    {
      title: '推广',
      dataIndex: 'promoted',
      width: 66,
      filteredValue: filteredPromoted?.split(',') || null,
      filterMultiple: false,
      filters: [
        { text: '是', value: 1 },
        { text: '否', value: 0 },
      ],
      render: (t) => (+t === 1 ? '是' : '否'),
    },
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
      width: 200,
      dataIndex: 'remark',
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
    },
    {
      title: '上市时间',
      dataIndex: 'shelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'shelfTime' ? sortedOrder : false,
    },
    {
      title: '下市时间',
      dataIndex: 'offShelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'offShelfTime' ? sortedOrder : false,
    },
    {
      title: '新建时间',
      dataIndex: 'createTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'createTime' ? sortedOrder : false,
    },
    {
      title: '状态',
      dataIndex: 'coinStatus',
      width: 66,
      fixed: 'right',
      filteredValue: filteredCoinStatus?.split(',') || null,
      filters: coinStatusList,
      render: (t) => coinStatusMap[t]?.text,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      width: common.inputorAuth ? 55 : 160,
      fixed: 'right',
      render: (_, r) =>
        common.inputorAuth ? (
          +r.coinStatus === 10 && (
            <Button
              type="link"
              size="small"
              onClick={() => setState((state) => ({ ...state, modalVisible: true, curModify: r }))}
            >
              修改
            </Button>
          )
        ) : (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => setState((state) => ({ ...state, modalVisible: true, curModify: r }))}
            >
              {+r.coinStatus === 10 ? '审核' : '修改'}
            </Button>

            <Popconfirm
              title={`上市 ${r.coinSymbol} ？`}
              disabled={+r.coinStatus === 20}
              onConfirm={() => handleUpdateStatus(r.id, 20)}
            >
              <Button type="link" size="small" disabled={+r.coinStatus === 20}>
                上市
              </Button>
            </Popconfirm>

            <Popconfirm
              title={`${+r.coinStatus === 10 ? '拒绝' : ''}${+r.coinStatus === 20 ? '下市' : ''}${
                +r.coinStatus === 30 ? '删除' : ''
              } ${r.coinSymbol} ？`}
              onConfirm={() => handleUpdateStatus(r.id, +r.coinStatus === 20 ? 30 : undefined, r)}
              disabled={+r.coinStatus === 30 && r.promoted}
            >
              <Button danger type="text" size="small" disabled={+r.coinStatus === 30 && r.promoted}>
                {+r.coinStatus === 10 ? '拒绝' : ''}
                {+r.coinStatus === 20 ? '下市' : ''}
                {+r.coinStatus === 30 ? '删除' : ''}
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

        {!common.inputorAuth && <ChainMGMT updateChainList={updateChainList} />}
      </Row>

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

      {/* 编辑弹窗 */}
      <Modal
        centered
        width={1440}
        footer={null}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        visible={modalVisible}
        closable={!editLoading}
        title={curModify ? (common.inputorAuth || +curModify.coinStatus !== 10 ? '修改代币' : '审核代币') : '添加代币'}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, curModify: null }))}
        bodyStyle={{ height: '80vh', overflowY: 'auto' }}
      >
        <CoinForm
          coinInfo={curModify}
          loading={editLoading}
          onOk={handleEditOk}
          coinChainList={coinChainList}
          commonStore={common}
        />
      </Modal>
    </section>
  )
}

export default observer(CoinMGMT)
