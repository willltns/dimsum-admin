import ss from './index.module.less'

import React, { useState } from 'react'
import { Input, Modal, Tooltip } from 'antd'
import { updateCoin } from '@/pages/coin/xhr'

function UniqueUrlCol(props) {
  const { record, afterEdit } = props
  const [state, setState] = useState({ visible: false, uniqueVal: '', loading: false })
  const { visible, uniqueVal, loading } = state

  const handleOk = async () => {
    setState((state) => ({ ...state, loading: true }))

    try {
      await updateCoin({ id: record.id, coinUniqueUrl: uniqueVal })
      setState((state) => ({ ...state, visible: false, loading: false }))
      afterEdit()
    } catch (err) {
      setState((state) => ({ ...state, loading: false }))
    }
  }

  return (
    <>
      <div className={ss.uniqueUrlCol}>
        <Tooltip title={record.coinUniqueUrl}>{record.coinUniqueUrl || '--'}</Tooltip>
        <i onClick={() => setState((state) => ({ ...state, visible: true, uniqueVal: record.coinUniqueUrl || '' }))}>
          编辑
        </i>
      </div>

      <Modal
        visible={visible}
        title="编辑 URL"
        onOk={handleOk}
        destroyOnClose
        closable={!loading}
        maskClosable={false}
        okButtonProps={{ loading }}
        cancelButtonProps={{ disabled: loading }}
        onCancel={() => setState((state) => ({ ...state, visible: false }))}
        afterClose={() => setState({ uniqueVal: '' })}
      >
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