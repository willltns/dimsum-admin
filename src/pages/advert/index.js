import ss from './index.module.less'

import React from 'react'
import { Tabs, Button, Modal, Popconfirm } from 'antd'

import { getSearchPromo } from './xhr'
import { updateCoin } from '@/pages/coin/xhr'
import { useStore } from '@/utils/hooks/useStore'

import BannerMGMT from './banner-mgmt'
import PromoCoinMGMT from './promo-coin-mgmt'
import XhrCoinSelect from '@/components/xhr-coin-select'

const Home = () => {
  const { common } = useStore()

  const [state, setState] = React.useState({
    visible: false,
    loading: false,
    selected: null,
    searchPromoData: undefined,
  })
  const { visible, loading, searchPromoData, selected } = state

  const fetchSearchPromo = () => {
    getSearchPromo()
      .then((res) => setState((state) => ({ ...state, searchPromoData: res })))
      .catch(() => setState((state) => ({ ...state, searchPromoData: null })))
  }

  const updateCoinSearchPromo = async (params) => {
    setState((state) => ({ ...state, loading: true }))

    try {
      await updateCoin(params)
      if (params.coinSearchPromo)
        setState((state) => ({ ...state, loading: false, searchPromoData: selected, selected: null }))
      else setState((state) => ({ ...state, loading: false, searchPromoData: null }))
    } catch (err) {
      setState((state) => ({ ...state, loading: false }))
    }
  }

  // 搜索框推广代币信息弹窗可见性触发
  React.useEffect(() => {
    if (visible) fetchSearchPromo()
  }, [visible])

  const tabsRight = common.auditorAuth && (
    <Button type="primary" onClick={() => setState((state) => ({ ...state, visible: true }))}>
      代币推荐搜索
    </Button>
  )

  return (
    <section>
      <Tabs tabBarExtraContent={{ right: tabsRight }}>
        <Tabs.TabPane tab="横幅广告" key="1">
          <BannerMGMT />
        </Tabs.TabPane>
        <Tabs.TabPane tab="推广代币" key="2">
          <PromoCoinMGMT />
        </Tabs.TabPane>
      </Tabs>

      {/* 前台代币搜索框推广代币信息弹窗 */}
      <Modal
        footer={null}
        destroyOnClose
        visible={visible}
        title="代币推荐搜索信息"
        closable={!loading}
        onCancel={() => setState((state) => ({ ...state, visible: false, searchPromoData: undefined, selected: null }))}
        maskClosable={false}
      >
        <div className={ss.curSearchPromo}>
          <span>
            当前推荐搜索代币：{searchPromoData?.coinName || '-'} - {searchPromoData?.id || '-'}
          </span>
          {searchPromoData?.id && (
            <Popconfirm
              disabled={loading}
              title="取消"
              onConfirm={() => updateCoinSearchPromo({ coinSearchPromo: 0, id: searchPromoData.id })}
            >
              <Button disabled={loading} type="link">
                取消
              </Button>
            </Popconfirm>
          )}
        </div>

        <div className={ss.nextSearchPromo}>
          <XhrCoinSelect
            value={selected?.id}
            onSelect={(id, list) => setState((state) => ({ ...state, selected: list.find((i) => i.id === id) }))}
          />
          <Button
            size="small"
            type="primary"
            disabled={!selected?.id}
            loading={loading}
            onClick={() => updateCoinSearchPromo({ coinSearchPromo: 1, id: selected.id })}
          >
            设置
          </Button>
        </div>
      </Modal>
    </section>
  )
}

export default Home
