import ss from './index.module.less'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  Input,
  Radio,
  DatePicker,
  Col,
  Popconfirm,
  Divider,
  message,
  Tooltip,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { observer } from 'mobx-react'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import XhrCoinSelect from '@/components/xhr-coin-select'
import { votePromoTypeList, votePromoStatusList, votePromoTypeMap, votePromoStatusMap } from './consts'
import {
  addVotePromo,
  deleteVotePromo,
  fetchVotePromoDetail,
  fetchVotePromoList,
  updateVotePromoStatus,
} from '@/pages/vote-promo/xhr'

import VoteModifier from '@/pages/vote-promo/VoteModifier'

const VotePromo = () => {
  const [state, setState] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    filteredType: null,
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    voteName: '',
    remark: '',
    modalVisible: false,
    voteType: 10,
    votePromoDetail: null,
    tableLoading: false,
    editLoading: false,
    detailLoading: false,
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
    voteName,
    remark,
    modalVisible,
    voteType,
    votePromoDetail,
    tableLoading,
    editLoading,
    detailLoading,
  } = state

  const handleVotePromoList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      type: filteredType,
      status: filteredStatus,
      sortedField,
      sortedOrder,
      voteName,
      remark,
    }

    fetchVotePromoList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list, total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [current, pageSize, filteredType, filteredStatus, sortedField, sortedOrder, voteName, remark])

  useEffect(() => {
    handleVotePromoList()
  }, [handleVotePromoList])

  const [form] = Form.useForm()

  const handleAddOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const { timeRange, ...params } = values

      if (voteType === 10 && params.optionList?.length !== new Set(params.optionList)?.size) {
        message.warn('请确认选择的代币选项没有重复代币')
        setState((state) => ({ ...state, editLoading: false }))
        return
      }

      params.type = voteType
      params.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss')
      params.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss')

      await addVotePromo(params)
      setState((state) => ({ ...state, editLoading: false, modalVisible: false, voteType: 10 }))
      handleVotePromoList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    setState((state) => ({ ...state, editLoading: true }))

    try {
      status ? await updateVotePromoStatus({ id, status }) : await deleteVotePromo({ id })
      setState((state) => ({ ...state, editLoading: false }))
      handleVotePromoList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleVotePromoDetail = async (id) => {
    setState((state) => ({ ...state, detailLoading: true }))
    try {
      const res = await fetchVotePromoDetail({ id })
      setState((state) => ({ ...state, detailLoading: false, votePromoDetail: res }))
    } catch (err) {
      setState((state) => ({ ...state, detailLoading: false }))
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
      current,
      pageSize,
      filteredType: type?.[0],
      filteredStatus: status?.join(','),
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 80 },
    {
      title: '投票主题',
      dataIndex: 'voteName',
      fixed: 'left',
      width: 222,
      ellipsis: true,
      ...getColumnSearchProps('投票主题', 'voteName', handleInputSearch, voteName),
    },
    {
      title: '类型',
      width: 100,
      dataIndex: 'type',
      filteredValue: filteredType ? [filteredType] : null,
      filterMultiple: false,
      filters: votePromoTypeList,
      render: (t) => votePromoTypeMap[t]?.text,
    },
    {
      title: '投票开始时间',
      dataIndex: 'startTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'startTime' ? sortedOrder : false,
    },
    {
      title: '投票结束时间',
      dataIndex: 'endTime',
      width: 170,
      sorter: true,
      sortOrder: sortedField === 'endTime' ? sortedOrder : false,
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      filteredValue: filteredStatus?.split(',') || null,
      filters: votePromoStatusList,
      render: (t) => votePromoStatusMap[t]?.text,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 222,
      ellipsis: true,
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
      render: (t) => (
        <Tooltip title={t} placement="left">
          {t}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      width: 160,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" disabled={detailLoading} onClick={() => handleVotePromoDetail(r.id)}>
            详情
          </Button>
          <Popconfirm
            title={`激活 id 为 ${r.id} 的投票 ？`}
            disabled={+r.status === 20 || editLoading}
            onConfirm={() => handleUpdateStatus(r.id, 20)}
          >
            <Button type="link" size="small" disabled={+r.status === 20 || editLoading}>
              激活
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`取消 id 为 ${r.id} 的投票 ？`}
            disabled={editLoading}
            onConfirm={() => handleUpdateStatus(r.id, +r.status !== 30 ? 30 : undefined)}
          >
            <Button type="text" size="small" disabled={editLoading}>
              {+r.status !== 30 ? '取消' : '删除'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加投票推广
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

      {/* 设置投票推广 */}
      <Modal
        centered
        width={600}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        title="添加投票推广"
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        bodyStyle={{ height: 520, overflowY: 'auto' }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: null, voteType: 10 }))}
        afterClose={form.resetFields}
        onOk={handleAddOk}
      >
        <Radio.Group
          style={{ margin: '0 0 32px 116px' }}
          onChange={(e) => {
            const voteType = +e.target.value
            form.resetFields()

            setTimeout(() => {
              form.setFieldsValue(
                voteType === 10
                  ? { voteName: '哪个代币获得两天免费推广？🚀$$$Which coin to get 2 days free promo? 🚀' }
                  : { voteName: '' }
              )
              setState((state) => ({ ...state, voteType }))
            })
          }}
          value={voteType}
        >
          {votePromoTypeList.map((item) => (
            <Radio value={item.value} key={item.value}>
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ voteName: '哪个代币获得两天免费推广？🚀$$$Which coin to get 2 days free promo? 🚀' }}
        >
          <Form.Item label="投票主题" name="voteName" rules={[{ required: true, whitespace: true }]}>
            <Input min={1} style={{ width: '100%' }} placeholder="请输入投票主题" />
          </Form.Item>
          <Form.List
            name="optionList"
            rules={[
              {
                validator: async (_, optionList) =>
                  !optionList || optionList?.length < 2
                    ? Promise.reject(new Error('至少添加两个选项内容'))
                    : Promise.resolve(),
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item label={`选项 ${index + 1}`} required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      noStyle
                      rules={[
                        {
                          validator(_, value) {
                            return value === undefined || !(value + '').trim()
                              ? Promise.reject(new Error(voteType === 10 ? '请选择代币' : '请输入选项内容或删除该选项'))
                              : Promise.resolve()
                          },
                        },
                      ]}
                    >
                      {voteType === 10 ? (
                        <XhrCoinSelect style={{ width: '90%' }} />
                      ) : (
                        <Input placeholder={`请输入选项 ${index + 1} 内容`} style={{ width: '90%' }} />
                      )}
                    </Form.Item>
                    {fields.length > 2 ? (
                      <MinusCircleOutlined style={{ marginLeft: 16 }} onClick={() => remove(field.name)} />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item noStyle>
                  <Button type="dashed" onClick={() => add()} style={{ marginLeft: 116 }} icon={<PlusOutlined />}>
                    添加选项
                  </Button>

                  <Col offset={5}>
                    <Form.ErrorList errors={errors} />
                  </Col>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Space style={{ width: '100%' }}>
            <br />
          </Space>
          <Form.Item label="投票时间段" name="timeRange" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:00"
              showTime={{
                format: 'HH:mm',
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
              }}
            />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看选项和修改投票数 */}
      <Modal
        width={600}
        footer={null}
        title="投票详情"
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        visible={!!votePromoDetail}
        onCancel={() => setState((state) => ({ ...state, votePromoDetail: null }))}
      >
        <div>投票主题：&emsp;{votePromoDetail?.voteName}</div>
        <p />
        <div>
          投票时间：&emsp;{votePromoDetail?.startTime} ~ {votePromoDetail?.endTime}
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <p />

        {votePromoDetail?.voteItems?.map((item, index) => (
          <div className={ss.option} key={item.optionId}>
            <p>
              选项 {index + 1}：
              <b>
                {+votePromoDetail?.type === 10
                  ? `${item.coinName} (${item.coinSymbol}) ${item.coinId}`
                  : item.optionDesc}
              </b>
            </p>
            <div>
              <span>
                百分比: <b>{(item.percentage * 100).toFixed(0)} %</b>
              </span>
              <span>
                投票数: <b>{item.upvotes}</b>
              </span>
              <VoteModifier
                No={index + 1}
                status={votePromoDetail?.status}
                optionId={item.optionId}
                cbSuccess={() => handleVotePromoDetail(votePromoDetail.id)}
              />
            </div>
          </div>
        ))}
      </Modal>
    </section>
  )
}

export default observer(VotePromo)
