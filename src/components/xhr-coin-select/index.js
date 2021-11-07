import React from 'react'
import { Select } from 'antd'
import { debounce } from 'lodash'

import { fetchCoinByINS } from '@/assets/xhr'

function XhrCoinSelect(props) {
  const { promo, onSelect, ...restProps } = props

  const [state, setState] = React.useState({ list: [], loading: false })
  const { list, loading } = state

  const handleSearch = debounce(
    (value) => {
      if (!value?.trim()) return

      setState((state) => ({ ...state, loading: true }))
      fetchCoinByINS(value.trimLeft())
        .then((res) => {
          let list = res || []
          if (promo) list = list.filter((item) => !item.promoted)
          setState({ list, loading: false })
        })
        .catch(() => setState((state) => ({ ...state, loading: false })))
    },

    666
  )

  return (
    <Select
      showSearch
      loading={loading}
      filterOption={false}
      onSearch={handleSearch}
      placeholder="输入代币ID、名称或符号查找"
      onSelect={typeof onSelect === 'function' ? (coinId) => onSelect(coinId, list) : undefined}
      {...restProps}
    >
      {list?.map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.coinName} (${item.coinSymbol}) {item.id}
        </Select.Option>
      ))}
    </Select>
  )
}

export default React.memo(XhrCoinSelect)
