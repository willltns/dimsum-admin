import ss from './index.module.less'

import React, { useRef, useState } from 'react'
import { Form, Input, Upload, Button, Row, Col, Select, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import zh from './lang/zh.json'
import en from './lang/en.json'
import { chainTypeList } from '@/consts'
import { descPH, presalePH, airdropPH, presaleTemplate, airdropTemplate, additionalLinkPH } from './const'

// 是否中文
const ifZh = (lang) => lang === 'zh'

// 日期格式校验 2022-22-22 22:22
const dateReg =
  /^(((20\d{2})-(0(1|[3-9])|1[012])-(0[1-9]|[12]\d|30))|((20\d{2})-(0[13578]|1[02])-31)|((20\d{2})-02-(0[1-9]|1\d|2[0-8]))|(((20([13579][26]|[2468][048]|0[48]))|(2000))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9])$/

function CoinForm(props) {
  const { coinInfo, loading, onOk } = props

  const uploadBtnRef = useRef(null)
  const linkTipRef = useRef(null)

  const [state, setState] = useState({
    lang: 'zh',
    coinPresaleInfo: '',
    coinAirdropInfo: '',
    presaleModalVisible: false,
    airdropModalVisible: false,
  })
  const { lang, coinPresaleInfo, coinAirdropInfo, presaleModalVisible, airdropModalVisible } = state

  const tt = ifZh(lang) ? zh : en

  const onFinish = (values) => {
    const { linkWebsite, linkChineseTg, linkEnglishTg, linkTwitter, linkDiscord, linkAdditionalInfo } = values
    if ([linkWebsite, linkChineseTg, linkEnglishTg, linkTwitter, linkDiscord, linkAdditionalInfo].every((i) => !i)) {
      linkTipRef.current.style.opacity = 1
      linkTipRef.current.parentNode.scrollIntoView()
      return
    }
    // TODO logo
    const params = { ...values, coinPresaleInfo, coinAirdropInfo }

    onOk(params, coinInfo?.id || undefined)
  }

  const onFinishFailed = ({ values, errorFields }) => {
    if (!values?.logo?.[0]) uploadBtnRef.current.style.borderColor = '#ff4d4f'

    const firstErrorLabel = errorFields?.[0]?.name
    if (!firstErrorLabel) return
    const errorEl = document.querySelector(`label[for="${firstErrorLabel}"]`)
    if (errorEl) errorEl.scrollIntoView()
  }

  return (
    <section className={ss.addCoin}>
      <Form
        layout="vertical"
        autoComplete="off"
        className={ss.form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateMessages={{ required: ' ', whitespace: ' ' }}
        onValuesChange={(changedValue, allValues) => {
          // prettier-ignore
          const atLeastOne = ['linkWebsite', 'linkChineseTg', 'linkEnglishTg', 'linkTwitter', 'linkDiscord', 'linkAdditionalInfo']
          if (!atLeastOne.includes(Object.keys(changedValue)[0])) return
          linkTipRef.current.style.opacity = atLeastOne.every((key) => !allValues[key]) ? 1 : 0
        }}
        initialValues={coinInfo?.id ? { ...coinInfo } : { coinLaunchDate: '2021-00-00 00:00' }}
      >
        <Row className={ifZh(lang) ? ss.zhMode : ss.enMode}>
          <Col>
            <Form.Item noStyle>
              <h2>{tt.coinInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.name} name="coinName" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.symbol} name="coinSymbol" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label={tt.logo}
              name="coinLogo"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              valuePropName="fileList"
              rules={[{ required: true }]}
            >
              <Upload name="logo" action="/upload.do" listType="picture" maxCount={1}>
                <Button
                  ref={uploadBtnRef}
                  icon={<UploadOutlined />}
                  onClick={() => (uploadBtnRef.current.style.borderColor = '')}
                >
                  {tt.clickToUpload}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label={tt.description} name="coinDescription" rules={[{ required: true, whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 6 }} placeholder={descPH} />
            </Form.Item>
            <Form.Item
              label={tt.launchDate}
              name="coinLaunchDate"
              validateTrigger="onBlur"
              rules={[{ required: true }, { pattern: dateReg, message: ' ' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contractAddressTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.chain} name="coinChain" rules={[{ required: true }]}>
              <Select getPopupContainer={(tri) => tri.parentNode}>
                {chainTypeList.map(({ value, text }) => (
                  <Select.Option value={value} key={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={tt.contractAddress} name="coinAddress" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.presale_airdrop}</h2>
              <div className={ss.paBtns}>
                <Button
                  className={`${coinPresaleInfo ? ss.infoFilled : ''}`}
                  onClick={() => setState((state) => ({ ...state, presaleModalVisible: true }))}
                >
                  {tt.presaleInformation}
                </Button>

                <Button
                  className={`${coinAirdropInfo ? ss.infoFilled : ''}`}
                  onClick={() => setState((state) => ({ ...state, airdropModalVisible: true }))}
                >
                  {tt.airdropInformation}
                </Button>
              </div>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item noStyle>
              <h2>
                {tt.linkTitle}
                <span className={ss.linkTip} ref={linkTipRef}>
                  {tt.linkTip}
                </span>
              </h2>
            </Form.Item>
            <Form.Item label={tt.website} name="linkWebsite" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.chineseTG} name="linkChineseTg" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.englishTG} name="linkEnglishTg" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.twitter} name="linkTwitter" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.discord} name="linkDiscord" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.addLinkInfo} name="linkAdditionalInfo" rules={[{ whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 6 }} placeholder={additionalLinkPH} />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contactInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.contactEmail} name="contactEmail" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.contactTelegram} name="contactTg" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button htmlType="submit" className={ss.submitBtn} loading={loading}>
            {coinInfo?.id ? '修改' : '添加'}代币
          </Button>
        </div>
      </Form>

      {/* 预售信息补充弹窗 */}
      <Modal footer={null} closable={false} keyboard={false} className={ss.paModal} visible={presaleModalVisible}>
        <div className={ss.modalHead}>
          <p>{tt.presaleInformation}</p>
          <Button
            type="link"
            disabled={!!coinPresaleInfo.trim()}
            onClick={() => setState((state) => ({ ...state, coinPresaleInfo: presaleTemplate }))}
          >
            {tt.injectTemplate}
          </Button>
        </div>
        <Input.TextArea
          value={coinPresaleInfo}
          placeholder={presalePH}
          onChange={(e) => setState((state) => ({ ...state, coinPresaleInfo: e.target.value }))}
          autoSize={{ minRows: 10 }}
        />
        {/* prettier-ignore */}
        <Button type="primary" onClick={() => setState((state) => ({ ...state, coinPresaleInfo: state.coinPresaleInfo.trim(), presaleModalVisible: false }))}>OK</Button>
      </Modal>

      {/* 空投信息补充弹窗 */}
      <Modal footer={null} closable={false} keyboard={false} className={ss.paModal} visible={airdropModalVisible}>
        <div className={ss.modalHead}>
          <p>{tt.airdropInformation}</p>
          <Button
            type="link"
            disabled={!!coinAirdropInfo.trim()}
            onClick={() => setState((state) => ({ ...state, coinAirdropInfo: airdropTemplate }))}
          >
            {tt.injectTemplate}
          </Button>
        </div>
        <Input.TextArea
          value={coinAirdropInfo}
          placeholder={airdropPH}
          onChange={(e) => setState((state) => ({ ...state, coinAirdropInfo: e.target.value }))}
          autoSize={{ minRows: 10 }}
        />
        {/* prettier-ignore */}
        <Button type="primary" onClick={() => setState((state) => ({ ...state, coinAirdropInfo: state.coinAirdropInfo.trim(), airdropModalVisible: false }))}>{tt.okBtnText}</Button>
      </Modal>
    </section>
  )
}

export default CoinForm
