import React, { useState, useEffect } from 'react'
import { Button, Checkbox, DatePicker, Modal, Row, Space } from 'antd'

import axios from '@/utils/axios'
import { advertTypeList } from '@/consts'

const fetchProfit = (params) => axios.post('/getChargeByCond', params)

const typeList = [...advertTypeList, { text: '推广代币', value: 0 }, { text: '其他', value: -1 }]

function ProfitCalc() {
  const [state, setState] = useState({ visible: false, type: '', timeRange: [], loading: false, $: null })
  const { visible, type, timeRange, loading, $ } = state

  const getProfit = async () => {
    setState((state) => ({ ...state, loading: true }))

    const params = { type: type || undefined }
    if (timeRange?.length) {
      params.startTime = timeRange[0].format('YYYY-MM-DD 00:00:00')
      params.endTime = timeRange[1].format('YYYY-MM-DD 23:59:59')
    }
    try {
      const res = await fetchProfit(params)
      setState((state) => ({ ...state, $: res, loading: false }))
    } catch (err) {
      setState((state) => ({ ...state, loading: false }))
    }
  }

  useEffect(() => {
    if (visible) getProfit()
    if (!visible) setState({ visible: false, type: '', timeRange: [], loading: false, $: null })
    // eslint-disable-next-line
  }, [visible])

  return (
    <>
      <Button onClick={() => setState((state) => ({ ...state, visible: true }))}>Profit Calculator</Button>

      <Modal
        width={600}
        footer={null}
        visible={visible}
        title="Profit Calculator"
        onCancel={() => setState((state) => ({ ...state, visible: false }))}
      >
        <Space direction="vertical" size="large" style={{ padding: 48 }}>
          <Checkbox.Group
            value={type.split(',')}
            onChange={(value) => setState((state) => ({ ...state, type: value.join(',') }))}
          >
            {typeList.map(({ text, value }) => (
              <Checkbox value={value + ''} key={value}>
                {text}
              </Checkbox>
            ))}
          </Checkbox.Group>
          <DatePicker.RangePicker
            value={timeRange}
            style={{ width: 368 }}
            onChange={(timeRange) => setState((state) => ({ ...state, timeRange }))}
          />
          <Row justify="space-between">
            <Button loading={loading} onClick={getProfit}>
              Get Profit
            </Button>
            <h1 style={{ color: '#ff8200' }}>{$} BNB</h1>
          </Row>
        </Space>
      </Modal>
    </>
  )
}

export default React.memo(ProfitCalc)
