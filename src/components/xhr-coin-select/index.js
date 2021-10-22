import React from 'react'
import { Select } from 'antd'
import { debounce } from 'lodash'

import { fetchCoinByINS } from '@/assets/xhr'

function XhrCoinSelect(props) {
  const [list, setList] = React.useState([])

  console.log(list,123)

  return (
    <Select
      allowClear
      showSearch
      placeholder="输入代币 ID、名称或符号查找"
      onSearch={debounce(
        (value) =>
          fetchCoinByINS(value)
            .then((res) => setList(res || []))
            .catch(() => {}),
        666
      )}
      {...props}
    >
      {list?.map((item) => (
        <Select.Option value={item.id} key={item.id}>
          {item.coinName} (${item.coinSymbol}) {item.id}
        </Select.Option>
      ))}
    </Select>
  )
}

export default XhrCoinSelect
