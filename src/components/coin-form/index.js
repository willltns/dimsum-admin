import ss from './index.module.less'

import React, { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, Select } from 'antd'

import zh from './lang/zh.json'
import en from './lang/en.json'
import { descPH } from './const'
import { fileDomain, urlReg, dateReg } from '@/consts'

import ImgUpload from '@/components/img-upload'
import ExtraLinkAdd from '@/components/extra-link-add'

// 是否中文
const ifZh = (lang) => lang === 'zh'

function CoinForm(props) {
  const { visible, coinInfo, loading, onOk, coinChainList, commonStore } = props

  const uploadBtnRef = useRef(null)
  const linkTipRef = useRef(null)

  const [state, setState] = useState({ lang: 'zh', presaleDateR: false, canEdit: true })
  const { lang, presaleDateR, canEdit } = state

  useEffect(() => {
    if (!coinInfo?.id) return
    setState((state) => ({
      ...state,
      presaleDateR: !!coinInfo.coinPresaleInfo,
      wlsDateR: !!coinInfo.coinAirdropInfo,
      canEdit: commonStore.inputorAuth || +coinInfo.coinStatus !== +10,
    }))
  }, [coinInfo, commonStore.inputorAuth])

  const tt = ifZh(lang) ? zh : en

  const [form] = Form.useForm()

  useEffect(() => !visible && form.resetFields(), [visible, form])

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

    const params = { ...values, linkAdditionalInfo: linkAdditionalInfo?.trim() || '' }
    params.coinLaunchDate = params.coinLaunchDate || (!coinInfo?.id ? '' : '1970-01-01 00:00')
    params.coinPresaleDate = params.coinPresaleDate || (!coinInfo?.id ? '' : '1970-01-01 00:00')
    params.coinAirdropDate = params.coinAirdropDate || (!coinInfo?.id ? '' : '1970-01-01 00:00')

    onOk(params, coinInfo?.id || undefined)
  }

  const onFinishFailed = ({ values, errorFields }) => {
    if (!values.coinLogo?.[0]) uploadBtnRef.current.parentNode.parentNode.style = 'border-color: #ff4d4f'

    const firstErrorLabel = errorFields?.[0]?.name
    if (!firstErrorLabel) return
    const errorEl = document.querySelector(`label[for="${firstErrorLabel}"]`)
    if (errorEl) errorEl.scrollIntoView()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onFinish(values)
    } catch (error) {
      onFinishFailed(error)
    }
  }

  return (
    <section className={ss.addCoin}>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        className={ss.form}
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
            : { coinLaunchDate: '2022-00-00 00:00' }
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
              <Input
                placeholder="e.g. BTC"
                onChange={(e) => form.setFieldsValue({ coinSymbol: e.target?.value?.trim() || '' })}
              />
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
            <Form.Item label="代币中文描述" name="coinDescription" rules={[{ required: true, whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 8 }} placeholder={descPH} allowClear />
            </Form.Item>
            <Form.Item label="代币英文描述" name="coinDescriptionEN" rules={[{ whitespace: true }]}>
              <Input.TextArea autoSize={{ minRows: 8 }} placeholder={descPH} allowClear />
            </Form.Item>
            <Form.Item
              label={tt.launchDate}
              name="coinLaunchDate"
              validateTrigger="onBlur"
              rules={[{ pattern: dateReg, message: ' ' }]}
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
              <Input
                placeholder="0x000000..."
                onChange={(e) => form.setFieldsValue({ coinAddress: e.target?.value?.trim() || '' })}
              />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item noStyle>
              <h2>{tt.presale_wls}</h2>
            </Form.Item>

            {/* prettier-ignore */}
            <Form.Item label={tt.presaleLink} name="coinPresaleInfo" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input
                placeholder="https://..."
                onBlur={e => {
                  const value = e.target?.value?.trim()
                  setState(state => ({...state, presaleDateR: urlReg.test(value)}))
                  if (value === '' || urlReg.test(value)) form.validateFields(['coinPresaleDate'])
                }}
                onChange={(e) => form.setFieldsValue({ coinPresaleInfo: e.target?.value?.trim() || '' })}
              />
            </Form.Item>
            <Form.Item
              label={tt.coinPresaleDate}
              name="coinPresaleDate"
              validateTrigger="onBlur"
              rules={[{ required: presaleDateR }, { pattern: dateReg, message: ' ' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm" />
            </Form.Item>

            {/* prettier-ignore */}
            <Form.Item label={tt.wlsLink} name="coinAirdropInfo" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..."  onChange={(e) => form.setFieldsValue({ coinAirdropInfo: e.target?.value?.trim() || '' })} />
            </Form.Item>
            <Form.Item
              label={tt.coinWlsDate}
              name="coinAirdropDate"
              validateTrigger="onBlur"
              rules={[{ pattern: dateReg, message: ' ' }]}
            >
              <Input placeholder="YYYY-MM-DD HH:mm" />
            </Form.Item>

            <Form.Item noStyle>
              {/* prettier-ignore */}
              <h2>{tt.linkTitle}<span className={ss.linkTip} ref={linkTipRef}>{tt.linkTip}</span></h2>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.website} name="linkWebsite" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkWebsite: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.chineseTG} name="linkChineseTg" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkChineseTg: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.englishTG} name="linkEnglishTg" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkEnglishTg: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.twitter} name="linkTwitter" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkTwitter: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.medium} name="linkMedium" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkMedium: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.discord} name="linkDiscord" rules={[{ whitespace: true }, { pattern: urlReg }]} validateTrigger="onBlur">
              <Input placeholder="https://..." onChange={(e) => form.setFieldsValue({ linkDiscord: e.target?.value?.trim() || '' })}/>
            </Form.Item>
            {/* prettier-ignore */}
            <Form.Item label={tt.addLinkInfo} name="linkAdditionalInfo">
              <ExtraLinkAdd />
            </Form.Item>

            <Form.Item noStyle>
              <h2>{tt.contactInfoTitle}</h2>
            </Form.Item>
            <Form.Item label={tt.contactEmail} name="contactEmail" validateTrigger="onBlur" rules={[{ type: 'email' }]}>
              <Input placeholder="xxxxx@gmail.com" />
            </Form.Item>
            <Form.Item label={tt.contactTelegram} name="contactTg" rules={[{ whitespace: true }]}>
              <Input placeholder="@Your contact telegram account" />
            </Form.Item>

            <Form.Item label="备注" name="remark">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: 16, marginBottom: 66, position: 'relative' }}>
          {canEdit ? (
            <Button className={ss.submitBtn} loading={loading} onClick={handleSubmit}>
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
    </section>
  )
}

export default CoinForm
