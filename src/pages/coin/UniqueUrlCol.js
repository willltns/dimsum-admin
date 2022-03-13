import ss from './index.module.less'

import React, { useState } from 'react'
import { Input, message, Modal, Tooltip } from 'antd'

import { updateCoin } from '@/pages/coin/xhr'
import { copy } from '@/utils/copyToClipboard'

function UniqueUrlCol(props) {
  const { record, afterEdit, editable } = props
  const [state, setState] = useState({ visible: false, uniqueVal: '', loading: false })
  const { visible, uniqueVal, loading } = state

  const handleOk = async () => {
    if (/^[1-9]\d*$/.test(uniqueVal)) {
      message.warn('不能使用全数字作为 Unique Url')
      return
    }

    setState((state) => ({ ...state, loading: true }))

    const coinUniqueUrl = uniqueVal.replace(/\s+/g, '').toLowerCase()
    try {
      await updateCoin({ id: record.id, coinUniqueUrl: coinUniqueUrl || 'null' })
      setState((state) => ({ ...state, visible: false, loading: false }))
      afterEdit()
    } catch (err) {
      setState((state) => ({ ...state, loading: false }))
    }
  }

  const UIUrl = 'https://www.yydscoins.com/coin/' + record.coinUniqueUrl

  return (
    <>
      <div className={ss.uniqueUrlCol}>
        <Tooltip title={record.coinUniqueUrl}>
          {record.coinUniqueUrl ? <span onClick={() => copy(UIUrl)}>{record.coinUniqueUrl}</span> : '--'}
        </Tooltip>
        {editable && (
          <i onClick={() => setState((state) => ({ ...state, visible: true, uniqueVal: record.coinUniqueUrl || '' }))}>
            编辑
          </i>
        )}
      </div>

      <Modal
        width={500}
        visible={visible}
        title="编辑 Unique Url"
        onOk={handleOk}
        destroyOnClose
        keyboard={!loading}
        closable={!loading}
        maskClosable={false}
        okButtonProps={{ loading }}
        cancelButtonProps={{ disabled: loading }}
        onCancel={() => setState((state) => ({ ...state, visible: false }))}
        afterClose={() => setState({ uniqueVal: '' })}
      >
        <h4 style={{ marginBottom: 24 }}>当前编辑代币：{`${record.coinName} (${record.coinSymbol}) ${record.id}`}</h4>
        <Input
          autoFocus
          value={uniqueVal}
          onChange={(e) => setState((state) => ({ ...state, uniqueVal: e.target.value.trim() }))}
        />
      </Modal>
    </>
  )
}

export default React.memo(UniqueUrlCol)
