import React from 'react'
// import Highlighter from "react-highlight-words";

import { Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export const getColumnSearchProps = (title, dataIndex, handleSearch, searchValue) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        autoFocus
        placeholder={`搜索 ${title}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => {
          confirm()
          const value = selectedKeys[0]?.trim() || ''
          setSelectedKeys([value])
          handleSearch(dataIndex, value)
        }}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          onClick={() => {
            clearFilters()
            handleSearch(dataIndex, '')
          }}
          size="small"
          style={{ width: 90 }}
        >
          重置
        </Button>
        <Button
          type="primary"
          onClick={() => {
            confirm()
            const value = selectedKeys[0]?.trim() || ''
            setSelectedKeys([value])
            handleSearch(dataIndex, value)
          }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          搜索
        </Button>
      </Space>
    </div>
  ),
  filtered: !!searchValue,
  filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#ff8200' : undefined }} />,
  // render: (text) =>
  //   this.state.searchedColumn === dataIndex ? (
  //     <Highlighter
  //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
  //       searchWords={[this.state.searchText]}
  //       autoEscape
  //       textToHighlight={text ? text.toString() : ""}
  //     />
  //   ) : (
  //     text
  //   ),
})
