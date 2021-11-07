// import ss from './index.module.less'

import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { Observer, observer } from 'mobx-react'
import { Button, DatePicker, Form, Input, Modal, Select, Table, Space, Popconfirm } from 'antd'

import { adStatusList, adStatusMap, advertTypeList, advertTypeMap, fileDomain } from '@/consts'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { fetchBannerList, addBanner, updateBanner, updateBannerStatus } from '@/pages/advert/xhr'

import ImgUpload, { onPreview, handleFileUpload } from '@/components/img-upload'
import { useStore } from '@/utils/hooks/useStore'

const BannerMGMT = () => {
  const [state, setState] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredType: null,
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    coinName: '',
    contactEmail: '',
    contactTg: '',
    remark: '',
    modalVisible: false,
    curModify: null,
    tableLoading: false,
    editLoading: false,
  })
  const {
    total,
    current,
    pageSize,
    dataSource,
    filteredType,
    filteredStatus,
    sortedField,
    sortedOrder,
    coinName,
    contactEmail,
    contactTg,
    remark,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
  } = state

  const { common } = useStore()

  const handleBannerList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      type: filteredType,
      status: filteredStatus,
      sortedField,
      sortedOrder,
      coinName,
      contactEmail,
      contactTg,
      remark,
    }

    fetchBannerList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list, total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [
    current,
    pageSize,
    filteredType,
    filteredStatus,
    sortedField,
    sortedOrder,
    coinName,
    contactEmail,
    contactTg,
    remark,
  ])

  useEffect(() => {
    handleBannerList()
  }, [handleBannerList])

  const [form] = Form.useForm()

  const handleEditOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const { timeRange, bannerUrl, ...params } = values

      params.shelfTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss')
      params.offShelfTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss')
      params.bannerUrl = bannerUrl[0]?.response || (await handleFileUpload(bannerUrl[0]?.originFileObj))

      curModify?.id && (params.id = curModify.id)
      curModify?.id ? await updateBanner(params) : await addBanner(params)
      setState((state) => ({ ...state, editLoading: false, modalVisible: false, curModify: null }))
      handleBannerList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      await updateBannerStatus({ id, status })
      setState((state) => ({ ...state, editLoading: false }))
      handleBannerList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const pagination = {
    total,
    current,
    pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 30],
    showTotal: (total) => `共 ${total} 条查询结果`,
  }

  const onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { type, status } = filters
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current: state.pageSize === pageSize ? current : 1,
      pageSize,
      filteredType: type?.join(','),
      filteredStatus: status?.join(','),
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    //{ title: 'ID', dataIndex: 'id', fixed: 'left', width: 80 },
    {
      title: '代币名称',
      dataIndex: 'coinName',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('代币名称', 'coinName', handleInputSearch, coinName),
    },
    {
      title: '横幅链接',
      dataIndex: 'bannerUrl',
      align: 'center',
      width: 80,
      // prettier-ignore
      render: (t) => (<Button type="link" onClick={() => onPreview({ response: t })}>预览</Button>),
    },
    { title: '跳转链接', dataIndex: 'linkUrl', width: 200, ellipsis: true },
    {
      title: '横幅类型',
      dataIndex: 'type',
      width: 120,
      filteredValue: filteredType?.split(',') || null,
      filters: advertTypeList,
      render: (t) => advertTypeMap[t]?.text,
    },
    {
      title: '上架时间',
      dataIndex: 'shelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'shelfTime' ? sortedOrder : false,
      render: (t, r) => (
        <Observer
          render={() => (
            <div
              style={
                +r.status === 10 &&
                moment(r.shelfTime, 'YYYY-MM-DD HH:mm:ss').unix() <= common.unixTS &&
                moment(r.offShelfTime, 'YYYY-MM-DD HH:mm:ss').unix() >= common.unixTS
                  ? { color: '#00d62f', fontWeight: 500 }
                  : undefined
              }
            >
              {t}
            </div>
          )}
        />
      ),
    },
    {
      title: '下架时间',
      dataIndex: 'offShelfTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'offShelfTime' ? sortedOrder : false,
      render: (t, r) => (
        <Observer
          render={() => (
            <div
              style={
                +r.status === 20 && moment(r.offShelfTime, 'YYYY-MM-DD HH:mm:ss').unix() <= common.unixTS
                  ? { color: 'red', fontWeight: 500 }
                  : undefined
              }
            >
              {t}
            </div>
          )}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 88,
      filteredValue: filteredStatus?.split(',') || null,
      filters: adStatusList,
      render: (t) => adStatusMap[t]?.text,
    },
    { title: '价格', dataIndex: 'price', width: 120 },
    {
      title: '联系邮箱',
      dataIndex: 'contactEmail',
      width: 200,
      ...getColumnSearchProps('联系邮箱', 'contactEmail', handleInputSearch, contactEmail),
    },
    {
      title: '联系电报',
      dataIndex: 'contactTg',
      width: 200,
      ...getColumnSearchProps('联系电报', 'contactTg', handleInputSearch, contactTg),
    },
    {
      title: '备注',
      width: 200,
      dataIndex: 'remark',
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
    },
    {
      title: '新建时间',
      dataIndex: 'createTime',
      width: 170,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      width: 160,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setState((state) => ({ ...state, modalVisible: true, curModify: r }))
              const fields = { ...r }
              fields.timeRange = [moment(r.shelfTime), moment(r.offShelfTime)]
              // prettier-ignore
              fields.bannerUrl = [{ response: fields.bannerUrl, uid: '1', status: 'done', name: '', thumbUrl: fileDomain + fields.bannerUrl },]

              setTimeout(() => form.setFieldsValue({ ...fields }))
            }}
          >
            修改
          </Button>
          <Popconfirm
            title={`上架 ${r.coinName} ？`}
            disabled={+r.status === 20 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="link" size="small" disabled={+r.status === 20 || editLoading}>
              上架
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`下架 ${r.coinName} ？`}
            disabled={+r.status === 30 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 30)}
          >
            <Button type="text" size="small" disabled={+r.status === 30 || editLoading}>
              下架
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  if (!common.auditorAuth) columns.pop()

  return (
    <>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加横幅广告
      </Button>
      <Space style={{ width: '100%' }}>
        <br />
      </Space>
      <Table
        bordered
        rowKey="id"
        size="small"
        columns={columns}
        loading={tableLoading}
        pagination={pagination}
        dataSource={dataSource}
        onChange={onTableChange}
        scroll={{ x: columns.reduce((t, { width, fixed }) => (fixed || !width ? t : t + width), 0) }}
      />

      {/* 编辑弹窗 */}
      <Modal
        centered
        width={600}
        keyboard={false}
        maskClosable={false}
        title={curModify?.id ? '修改广告' : '添加广告'}
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, curModify: null }))}
        afterClose={form.resetFields}
        onOk={handleEditOk}
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <Form.Item label="名称" name="coinName" rules={[{ required: true }]}>
            <Input placeholder="输入代币名称（通常）" />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Select placeholder="选择广告类型">
              {advertTypeList.map((item) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="横幅"
            name="bannerUrl"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: '请上传横幅图片' }]}
          >
            <ImgUpload fileMaxSize={8} />
          </Form.Item>
          <Form.Item label="链接" name="linkUrl" rules={[{ required: true }]}>
            <Input placeholder="点击广告 banner 时的跳转链接" />
          </Form.Item>
          <Form.Item
            label="价格"
            name="price"
            validateTrigger="onBlur"
            rules={[{ required: true }, { pattern: /^[0-9]+(.[0-9]{1,4})?$/, message: '请输入正确价格' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="上架时间段" name="timeRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:00"
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
              }}
            />
          </Form.Item>
          <Form.Item label="邮箱" name="contactEmail">
            <Input placeholder="联系邮箱" />
          </Form.Item>
          <Form.Item label="电报" name="contactTg">
            <Input placeholder="联系电报" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default observer(BannerMGMT)
