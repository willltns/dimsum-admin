import ss from './index.module.less'

import React from 'react'
import { Input, AutoComplete } from 'antd'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'

import { bscOpt, commonOpt } from './linkOptions'
import { urlReg } from '@/consts'

const genLink = () => ({ name: '', url: '', key: Math.random() })

const ExtraLinkAdd = (props) => {
  const { value, onChange } = props

  const [links, setLinks] = React.useState([{ ...genLink() }])

  React.useEffect(() => {
    if (!value) return
    const links = value
      ?.split('\n')
      .map((s) => {
        if (!s?.trim()) return undefined
        const [name, url] = s.split('$$$')
        return { name, url, key: Math.random() }
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
        <Input.Group className={ss.iptGrp} key={item.key}>
          <AutoComplete
            value={item.name}
            spellCheck={false}
            placeholder="选择或输入链接标题"
            options={[...bscOpt, ...commonOpt]}
            style={{ width: 180, flex: 'none' }}
            getPopupContainer={(tri) => tri.parentNode}
            onChange={(value) => {
              if (value === ' ') return
              const newLink = { ...links[index], name: value || '' }
              const newLinks = [...links]
              newLinks.splice(index, 1, newLink)
              setLinks(newLinks)
            }}
            filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
            onFocus={(e) => (e.target.parentNode.parentNode.style.backgroundColor = '#fff')}
            onBlur={(e) =>
              !e.target.value && (e.target.parentNode.parentNode.style.backgroundColor = 'rgba(255,77,79, 0.05)')
            }
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
            onFocus={(e) => (e.target.style.backgroundColor = '#fff')}
            onBlur={(e) => !urlReg.test(e.target.value) && (e.target.style.backgroundColor = 'rgba(255,77,79, 0.05)')}
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

      <PlusCircleOutlined className={ss.plusBtn} onClick={() => setLinks([...links, { ...genLink() }])} />
    </>
  )
}

export default ExtraLinkAdd
