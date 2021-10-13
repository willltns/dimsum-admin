import React from 'react'
import { Select } from 'antd'
import { debounce } from 'lodash'

import { fetchCoinByINS } from '@/assets/xhr'

function XhrCoinSelect(props) {
  const [list, setList] = React.useState([
    { id: '111', coinName: 'Baby Doge', coinSymbol: 'BD' },
    { id: '222', coinName: 'Baby Cake', coinSymbol: 'BC' },
  ])

  return (
    <Select
      allowClear
      showSearch
      placeholder="输入代币名称或符号查找"
      onSearch={debounce((value) => fetchCoinByINS(value).then().catch(), 600)}
      {...props}
    >
      {list.map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.coinName} (${item.coinSymbol}) {item.id}
        </Select.Option>
      ))}
    </Select>
  )
}

export default XhrCoinSelect
