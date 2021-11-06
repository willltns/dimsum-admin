import ss from './index.module.less'

import React, { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, Select, Modal } from 'antd'

import zh from './lang/zh.json'
import en from './lang/en.json'
import { fileDomain, urlReg } from '@/consts'
import { descPH, presalePH, airdropPH, presaleTemplate, airdropTemplate, additionalLinkPH } from './const'
import ImgUpload from '@/components/img-upload'

// 是否中文
const ifZh = (lang) => lang === 'zh'

// 日期格式校验 2022-22-22 22:22
const dateReg =
  /^(((20\d{2})-(0(1|[3-9])|1[012])-(0[1-9]|[12]\d|30))|((20\d{2})-(0[13578]|1[02])-31)|((20\d{2})-02-(0[1-9]|1\d|2[0-8]))|(((20([13579][26]|[2468][048]|0[48]))|(2000))-02-29))\s([0-1][0-9]|2[0-3]):([0-5][0-9])$/

function CoinForm(props) {
  const { coinInfo, loading, onOk, coinChainList } = props

  const uploadBtnRef = useRef(null)
  const linkTipRef = useRef(null)

  const [state, setState] = useState({
    lang: 'zh',
    coinPresaleInfo: '',
    coinAirdropInfo: '',
    presaleModalVisible: false,
    airdropModalVisible: false,
    canEdit: true,
  })
  const { lang, coinPresaleInfo, coinAirdropInfo, presaleModalVisible, airdropModalVisible, canEdit } = state

  useEffect(() => {
    if (!coinInfo?.id) return
    setState((state) => ({
      ...state,
      coinPresaleInfo: coinInfo.coinPresaleInfo || '',
      coinAirdropInfo: coinInfo.coinAirdropInfo || '',
      canEdit: +coinInfo.coinStatus !== +10,
    }))
  }, [coinInfo])

  const tt = ifZh(lang) ? zh : en

  const onFinish = (values) => {
    const { linkWebsite, linkChineseTg, linkEnglishTg, linkTwitter, linkMedium, linkDiscord, linkAdditionalInfo } =
      values
    if (
      [linkWebsite, linkChineseTg, linkEnglishTg, linkTwitter, linkMedium, linkDiscord, linkAdditionalInfo].every(
        (i) => !i
      )
    ) {
      linkTipRef.current.style.opacity = 1
      linkTipRef.current.parentNode.scrollIntoView()
      return
    }

    const params = { ...values, coinPresaleInfo, coinAirdropInfo, linkAdditionalInfo: linkAdditionalInfo?.trim() || '' }
    params.coinPresaleDate = params.coinPresaleDate || ''
    params.coinAirdropDate = params.coinAirdropDate || ''

    onOk(params, coinInfo?.id || undefined)
  }

  const onFinishFailed = ({ values, errorFields }) => {
    if (!values.coinLogo?.[0]) uploadBtnRef.current.parentNode.parentNode.style = 'border-color: #ff4d4f'

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
        validateMessages={{ required: ' ', whitespace: ' ', pattern: { mismatch: ` ` }, types: { email: ` ` } }}
        onValuesChange={(changedValue, allValues) => {
          // prettier-ignore
          const atLeastOne = ['linkWebsite', 'linkChineseTg', 'linkEnglishTg', 'linkTwitter', 'linkMedium', 'linkDiscord', 'linkAdditionalInfo']
          if (!atLeastOne.includes(Object.keys(changedValue)[0])) return
          linkTipRef.current.style.opacity = atLeastOne.every((key) => !allValues[key]) ? 1 : 0
        }}
        initialValues={
          coinInfo?.id
            ? {
                ...coinInfo,
                coinLogo: coinInfo.coinLogo
                  ? // prettier-ignore
                    [{ response: coinInfo.coinLogo, uid: '1', status: 'done', name: '', thumbUrl:  fileDomain + coinInfo.coinLogo }]
                  : undefined,
                coinLaunchDate: coinInfo.coinLaunchDate?.slice(0, -3),
                coinPresaleDate: coinInfo.coinPresaleDate?.slice(0, -3) || '',
                coinAirdropDate: coinInfo.coinAirdropDate?.slice(0, -3) || '',
              }
            : {
                coinLaunchDate: '2021-00-00 00:00',
                coinPresaleDate: '2021-00-00 00:00',
                coinAirdropDate: '2021-00-00 00:00',
              }
        }
      >
        <Row className={ifZh(lang) ? ss.zhMode : ss.enMode}>
          <Col>
            <Form.Item noStyle>
              <h2>{tt.coinInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.name} name="coinName" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="e.g. Bitcoin" />
            </Form.Item>
            <Form.Item label={tt.symbol} name="coinSymbol" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="e.g. BTC" />
            </Form.Item>
            <Form.Item
              label={tt.logo}
              name="coinLogo"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              valuePropName="fileList"
              rules={[{ required: true }]}
            >
              <ImgUpload
                iconRef={uploadBtnRef}
                onClick={() => (uploadBtnRef.current.parentNode.parentNode.style = '')}
              />
            </Form.Item>
            <Form.Item label={tt.description} name="coinDescription" rules={[{ required: true, whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 8 }} placeholder={descPH} />
            </Form.Item>
            <Form.Item
              label={tt.launchDate}
              name="coinLaunchDate"
              validateTrigger="onBlur"
              rules={[{ required: true }, { pattern: dateReg, message: ' ' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm" />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contractInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.chain} name="coinChain" rules={[{ required: true }]}>
              <Select placeholder="Select..." getPopupContainer={(tri) => tri.parentNode}>
                {coinChainList.map(({ chainName, id }) => (
                  <Select.Option value={id + ''} key={id}>
                    {chainName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={tt.contractAddress} name="coinAddress" rules={[{ whitespace: true }]}>
              <Input placeholder="0x0000...." />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.presale_airdrop}</h2>
              <div className={ss.paBtns}>
                {/* 预售信息填写 */}
                <div>
                  <Button
                    className={`${coinPresaleInfo ? ss.infoFilled : ''}`}
                    onClick={() => setState((state) => ({ ...state, presaleModalVisible: true }))}
                  >
                    {tt.presaleInformation}
                  </Button>
                  {!!coinPresaleInfo && (
                    <Form.Item
                      label="预售开始时间"
                      name="coinPresaleDate"
                      validateTrigger="onBlur"
                      rules={[{ required: true }, { pattern: dateReg, message: ' ' }]}
                    >
                      <Input placeholder="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                  )}
                </div>

                {/* 空投信息填写 */}
                <div>
                  <Button
                    className={`${coinAirdropInfo ? ss.infoFilled : ''}`}
                    onClick={() => setState((state) => ({ ...state, airdropModalVisible: true }))}
                  >
                    {tt.airdropInformation}
                  </Button>
                  {!!coinAirdropInfo && (
                    <Form.Item
                      label="空投参与时间"
                      name="coinAirdropDate"
                      validateTrigger="onBlur"
                      rules={[{ required: true }, { pattern: dateReg, message: ' ' }]}
                    >
                      <Input placeholder="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                  )}
                </div>
              </div>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item noStyle>
              {/* prettier-ignore */}
              <h2>{tt.linkTitle}<span className={ss.linkTip} ref={linkTipRef}>{tt.linkTip}</span></h2>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.website} name="linkWebsite" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.chineseTG} name="linkChineseTg" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.englishTG} name="linkEnglishTg" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.twitter} name="linkTwitter" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.medium} name="linkMedium" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.discord} name="linkDiscord" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." />
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.addLinkInfo} name="linkAdditionalInfo" rules={[{ whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 6 }} placeholder={additionalLinkPH} />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contactInfoTitle}</h2>
            </Form.Item>
            <Form.Item
              label={tt.contactEmail}
              name="contactEmail"
              validateTrigger="onBlur"
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input placeholder="contact@yydscoins.com" />
            </Form.Item>
            <Form.Item label={tt.contactTelegram} name="contactTg" rules={[{ whitespace: true }]}>
              <Input placeholder="@YYDSCoinsPromo" />
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 16, position: 'relative' }}>
          {canEdit ? (
            <Button htmlType="submit" className={ss.submitBtn} loading={loading}>
              {coinInfo?.id ? '修改' : '添加'}代币
            </Button>
          ) : (
            <Button
              type="link"
              style={{ position: 'absolute', left: 0 }}
              onClick={() => setState((state) => ({ ...state, canEdit: true }))}
            >
              进行审核调整
            </Button>
          )}
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
