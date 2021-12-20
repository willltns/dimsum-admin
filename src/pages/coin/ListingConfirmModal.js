import React from 'react'
import { Modal, Table } from 'antd'

import { fetchCoinList } from '@/pages/coin/xhr'
import { coinStatusMap, fileDomain } from '@/consts'

function ListingConfirmModal(props) {
  const { visible, current = {}, onCancel, okLoading, onOk } = props

  const [list, setList] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchList = async () => {
    const params = { pageNo: 1, pageSize: 20 }

    try {
      const [res1, res2, res3] = await Promise.all([
        fetchCoinList({ ...params, coinSymbol: current.coinSymbol }),
        fetchCoinList({ ...params, coinName: current.coinName }),
        fetchCoinList({ ...params, coinName: current.coinName.replace(/\x20/g, '') }),
      ])
      const list = []
      res1?.list?.forEach((item) => !list.some((i) => i.id === item.id) && list.push(item))
      res2?.list?.forEach((item) => !list.some((i) => i.id === item.id) && list.push(item))
      res3?.list?.forEach((item) => !list.some((i) => i.id === item.id) && list.push(item))
      setList(list.filter((item) => item.id !== current.id))
      setLoading(false)
    } catch (err) {}
  }

  React.useEffect(() => {
    if (!visible) {
      setList([])
      setLoading(true)
      return
    }

    current.id && fetchList()
    // eslint-disable-next-line
  }, [visible])

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'coinName' },
    { title: 'Symbol', dataIndex: 'coinSymbol' },
    {
      title: 'Logo',
      dataIndex: 'coinLogo',
      render: (t) => <img src={fileDomain + t} alt="logo" style={{ width: 28, height: 28, objectFit: 'cover' }} />,
    },
    { title: '状态', dataIndex: 'coinStatus', render: (t) => coinStatusMap[t]?.text },
  ]

  return (
    <Modal
      width={666}
      okText="确认上市"
      visible={visible}
      closable={!okLoading}
      keyboard={!okLoading}
      maskClosable={!okLoading}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{ disabled: loading, loading: okLoading }}
      cancelButtonProps={{ disabled: okLoading }}
      title={`上市 ${current.coinName} (${current.coinSymbol}) ？`}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>当前操作代币：</span>
        {current.id} (ID)&emsp;-&emsp;{current.coinName} (Name)&emsp;-&emsp;{current.coinSymbol} (Symbol)&emsp;-&emsp;
        <img src={fileDomain + current.coinLogo} alt="logo" style={{ width: 28, height: 28, objectFit: 'cover' }} />
      </div>
      <h2 style={{ margin: '16px 0' }}>上市前请确认是否有重复代币！！</h2>
      <Table
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        scroll={{ y: 244 }}
      />
    </Modal>
  )
}

export default ListingConfirmModal
