import React from 'react'
import { Divider, Input, message, Modal, Space } from 'antd'
import { updateCoinVotes } from '@/pages/coin/xhr'

function VotesModifyModal(props) {
  const { visible, current, onClose } = props

  const [state, setState] = React.useState({ loading: false, coinUpvotes: '', coinUpvotesToday: '' })
  const { loading, coinUpvotes, coinUpvotesToday } = state

  const onVoteChange = (e, key) => {
    const { value } = e.target
    if (!value || /^[1-9]\d*$/.test(value)) setState((state) => ({ ...state, [key]: value }))
  }

  const onOk = async () => {
    if (!coinUpvotes && !coinUpvotesToday) return onClose()

    setState((state) => ({ ...state, loading: true }))
    try {
      const params = {
        id: current.id,
        coinUpvotes: coinUpvotes || undefined,
        coinUpvotesToday: coinUpvotesToday || undefined,
      }
      await updateCoinVotes(params)
      setState((state) => ({ ...state, loading: false }))
      // hack
      current.coinUpvotes = coinUpvotes || current.coinUpvotes
      current.coinUpvotesToday = coinUpvotesToday || current.coinUpvotesToday
      message.success(`已成功修改【${current.coinName}】投票数！`)
      onClose()
    } catch (e) {
      setState((state) => ({ ...state, loading: false }))
    }
  }

  return (
    <Modal
      width={500}
      title={`修改【${current?.coinName}】投票数`}
      visible={visible}
      onOk={onOk}
      destroyOnClose
      onCancel={onClose}
      keyboard={!loading}
      closable={!loading}
      maskClosable={false}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      afterClose={() => setState((state) => ({ ...state, coinUpvotes: '', coinUpvotesToday: '' }))}
    >
      <Space align="center" style={{ display: 'flex', marginBottom: 16 }}>
        &emsp;当前总投票数&emsp;：<b>{current?.coinUpvotes || 0}</b>
      </Space>
      <Space align="center" style={{ display: 'flex' }}>
        &emsp;当前今日投票数：<b>{current?.coinUpvotesToday || 0}</b>
      </Space>

      <Divider />

      <Space align="center" style={{ display: 'flex', marginBottom: 16 }}>
        修改后总投票数&emsp;：
        <Input disabled={loading} value={coinUpvotes} onChange={(e) => onVoteChange(e, 'coinUpvotes')} />
      </Space>

      <Space align="center" style={{ display: 'flex' }}>
        修改后今日投票数：
        <Input disabled={loading} value={coinUpvotesToday} onChange={(e) => onVoteChange(e, 'coinUpvotesToday')} />
      </Space>
    </Modal>
  )
}

export default VotesModifyModal
