import ss from './index.module.less'

import React from 'react'
import { Input, AutoComplete } from 'antd'
import { observer } from 'mobx-react'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

import { bscOpt, commonOpt } from './linkOptions'
import { urlReg } from '@/consts'

const link = { name: '', url: '' }

const ExtraLinkAdd = (props) => {
  const { value, onChange } = props

  const [links, setLinks] = React.useState([{ ...link }])

  React.useEffect(() => {
    if (!value) return
    const links = value
      ?.split('\n')
      .map((s) => {
        if (!s?.trim()) return undefined
        const [name, url] = s.split('$$$')
        return { name, url }
      })
      .filter(Boolean)

    setLinks(links)
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    let value = ''
    links.forEach((item) => item.name?.trim() && urlReg.test(item.url) && (value += `${item.name}$$$${item.url}\n`))
    onChange(value)
    // eslint-disable-next-line
  }, [links])

  return (
    <>
      {links.map((item, index) => (
        <Input.Group className={ss.iptGrp} key={index}>
          <AutoComplete
            value={item.name}
            spellCheck={false}
            placeholder="Select or input link title."
            options={[...bscOpt, ...commonOpt]}
            style={{ width: 180, flex: 'none' }}
            onChange={(value) => {
              if (value?.[0] === ' ') return
              const newLink = { ...links[index], name: value }
              const newLinks = [...links]
              newLinks.splice(index, 1, newLink)
              setLinks(newLinks)
            }}
            filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
          />
          &nbsp;:&nbsp;
          <Input
            value={item.url}
            placeholder="https://..."
            bordered={false}
            onChange={(e) => {
              const newLink = { ...links[index], url: e.target?.value?.trim() || '' }
              const newLinks = [...links]
              newLinks.splice(index, 1, newLink)
              setLinks(newLinks)
            }}
          />
          <MinusCircleOutlined
            className={ss.delBtn}
            onClick={() => {
              const newLinks = [...links]
              newLinks.splice(index, 1)
              setLinks(newLinks)
            }}
          />
        </Input.Group>
      ))}

      <PlusCircleOutlined className={ss.plusBtn} onClick={() => setLinks([...links, { ...link }])} />
    </>
  )
}

export default observer(ExtraLinkAdd)
