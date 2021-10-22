import React from 'react'
import { Button, Input, Popover, Space } from 'antd'

import { addOptionVotes } from '@/pages/vote-promo/xhr'

function VoteModifier(props) {
  const { No, optionId, cbSuccess } = props

  const [state, setState] = React.useState({ visible: false, voteNum: '', loading: false })
  const { visible, voteNum, loading } = state

  const onVoteChange = (e) => {
    const { value } = e.target
    if (!value || /^[1-9]\d*$/.test(value)) setState((state) => ({ ...state, voteNum: value }))
  }

  const onCancel = () => setState({ visible: false, voteNum: '', loading: false })

  const onConfirm = async () => {
    if (!voteNum) return
    setState((state) => ({ ...state, loading: true }))
    try {
      await addOptionVotes({ optionId: optionId, upvotes: +voteNum })
      cbSuccess()
      onCancel()
    } catch (err) {
      setState({ loading: false })
    }
  }

  const popContent = (
    <Space>
      <Input disabled={loading} placeholder={`选项${No} 添加多少票?`} value={voteNum} onChange={onVoteChange} />
      <Button size="small" onClick={onCancel} disabled={loading} style={{ width: 70 }}>
        取消
      </Button>
      <Button type="primary" size="small" onClick={onConfirm} loading={loading} style={{ width: 70 }}>
        确定
      </Button>
    </Space>
  )

  return (
    <Popover content={popContent} visible={visible} trigger="click">
      <Button
        type="link"
        size="small"
        disabled={loading}
        onClick={() => setState((state) => ({ ...state, visible: !state.visible }))}
      >
        添加投票数
      </Button>
    </Popover>
  )
}

export default VoteModifier
