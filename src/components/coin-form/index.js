import ss from './index.module.less'

import React, { useRef, useState } from 'react'
import { Form, Input, Upload, Button, Row, Col, Select, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import zh from './lang/zh.json'
import en from './lang/en.json'
import { chainEnum } from '@/consts'
import { descPH, presalePH, airdropPH, presaleTemplate, airdropTemplate, additionalLinkPH } from './const'

import Footer from '@/components/footer'

const ifZh = (lang) => lang === 'zh'

const dateReg =
  /^(((20\d{2})-(0(1|[3-9])|1[012])-(0[1-9]|[12]\d|30))|((20\d{2})-(0[13578]|1[02])-31)|((20\d{2})-02-(0[1-9]|1\d|2[0-8]))|(((20([13579][26]|[2468][048]|0[48]))|(2000))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9])$/

function CoinForm() {
  const uploadBtnRef = useRef(null)
  const linkTipRef = useRef(null)

  const [state, setState] = useState({
    lang: 'zh',
    presaleInput: '',
    airdropInput: '',
    presaleModalVisible: false,
    airdropModalVisible: false,
  })
  const { lang, presaleInput, airdropInput, presaleModalVisible, airdropModalVisible } = state

  const tt = ifZh(lang) ? zh : en

  const onFinish = (values) => {
    const { website, englishTG, chineseTG, twitter, discord, addLink } = values
    if ([website, englishTG, chineseTG, twitter, discord, addLink].every((i) => !i)) {
      linkTipRef.current.style.opacity = 1
      linkTipRef.current.parentNode.scrollIntoView()
      return
    }

    console.log(values, presaleInput, airdropInput)
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
          const atLeastOne = ['website', 'englishTG', 'chineseTG', 'twitter', 'discord', 'addLink']
          if (!atLeastOne.includes(Object.keys(changedValue)[0])) return
          linkTipRef.current.style.opacity = atLeastOne.every((key) => !allValues[key]) ? 1 : 0
        }}
        initialValues={{ launchDate: '2021-00-00 00:00' }}
      >
        <Row className={ifZh(lang) ? ss.zhMode : ss.enMode}>
          <Col>
            <Form.Item noStyle>
              <h2>{tt.coinInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.name} name="name" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.symbol} name="symbol" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label={tt.logo}
              name="logo"
              getValueFromEvent={(e) => {
                console.log('Upload event:', e)
                if (Array.isArray(e)) {
                  return e
                }
                return e && e.fileList
              }}
              valuePropName="fileList"
              rules={[{ required: true }]}
            >
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button
                  ref={uploadBtnRef}
                  icon={<UploadOutlined />}
                  onClick={() => (uploadBtnRef.current.style.borderColor = '')}
                >
                  {tt.clickToUpload}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label={tt.description} name="description" rules={[{ required: true, whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 6 }} placeholder={descPH} />
            </Form.Item>
            <Form.Item
              label={tt.launchDate}
              name="launchDate"
              validateTrigger="onBlur"
              rules={[{ required: true }, { pattern: dateReg, message: ' ' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contractAddressTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.chain} name="chain" rules={[{ required: true }]}>
              <Select>
                {chainEnum.map((chain) => (
                  <Select.Option value={chain} key={chain}>
                    {chain}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={tt.contractAddress} name="contractAddress" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.presale_airdrop}</h2>
              <div className={ss.paBtns}>
                <Button
                  className={`${presaleInput ? ss.infoFilled : ''}`}
                  onClick={() => setState((state) => ({ ...state, presaleModalVisible: true }))}
                >
                  {tt.presaleInformation}
                </Button>

                <Button
                  className={`${airdropInput ? ss.infoFilled : ''}`}
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
            <Form.Item label={tt.website} name="website" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.chineseTG} name="chineseTG" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.englishTG} name="englishTG" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.twitter} name="twitter" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.discord} name="discord" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.addLinkInfo} name="extraLink" rules={[{ whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 6 }} placeholder={additionalLinkPH} />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contactInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.contactEmail} name="contractEmail" rules={[{ required: true, whitespace: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={tt.contactTelegram} name="contractTG" rules={[{ whitespace: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button htmlType="submit" className={ss.submitBtn}>
            {tt.addCoin}
          </Button>
        </div>
      </Form>

      {/* 预售信息补充弹窗 */}
      <Modal footer={null} closable={false} keyboard={false} className={ss.paModal} visible={presaleModalVisible}>
        <div className={ss.modalHead}>
          <p>{tt.presaleInformation}</p>
          <Button
            type="link"
            disabled={!!presaleInput.trim()}
            onClick={() => setState((state) => ({ ...state, presaleInput: presaleTemplate }))}
          >
            {tt.injectTemplate}
          </Button>
        </div>
        <Input.TextArea
          value={presaleInput}
          placeholder={presalePH}
          onChange={(e) => setState((state) => ({ ...state, presaleInput: e.target.value }))}
          autoSize={{ minRows: 10 }}
        />
        {/* prettier-ignore */}
        <Button type="primary" onClick={() => setState((state) => ({ ...state, presaleInput: state.presaleInput.trim(), presaleModalVisible: false }))}>OK</Button>
      </Modal>

      {/* 空投信息补充弹窗 */}
      <Modal footer={null} closable={false} keyboard={false} className={ss.paModal} visible={airdropModalVisible}>
        <div className={ss.modalHead}>
          <p>{tt.airdropInformation}</p>
          <Button
            type="link"
            disabled={!!airdropInput.trim()}
            onClick={() => setState((state) => ({ ...state, airdropInput: airdropTemplate }))}
          >
            {tt.injectTemplate}
          </Button>
        </div>
        <Input.TextArea
          value={airdropInput}
          placeholder={airdropPH}
          onChange={(e) => setState((state) => ({ ...state, airdropInput: e.target.value }))}
          autoSize={{ minRows: 10 }}
        />
        {/* prettier-ignore */}
        <Button type="primary" onClick={() => setState((state) => ({ ...state, airdropInput: state.airdropInput.trim(), airdropModalVisible: false }))}>{tt.okBtnText}</Button>
      </Modal>
    </section>
  )
}

export default CoinForm
