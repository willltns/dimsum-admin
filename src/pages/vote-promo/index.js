import ss from './index.module.less'

import React from 'react'
import { Button, Modal, Space, Table, Form, Input, Radio, DatePicker, Col, Popconfirm, Divider } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import moment from 'moment'
import XhrCoinSelect from '@/components/xhr-coin-select'
import { votePromoTypeList, votePromoStatusList, votePromoTypeMap, votePromoStatusMap } from './consts'
import VoteModifier from '@/pages/vote-promo/VoteModifier'

const data = [
  {
    id: 1,
    voteTheme: '哪个代币获得两天免费推广？',
    type: 10,
    status: 10,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 2,
    voteTheme: '哪个代币获得两天免费推广？',
    type: 20,
    status: 20,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 4,
    voteTheme: '哪个代币获得两天免费推广？',
    type: 20,
    status: 30,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 5,
    voteTheme: '哪个代币获得两天免费推广？',
    type: 20,
    status: 40,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
  {
    id: 6,
    voteTheme: '哪个代币获得两天免费推广？',
    type: 20,
    status: 50,
    startTime: '2020-12-12 12:00:00',
    endTime: '2020-12-12 12:00:00',
    remark: '范德萨发个',
  },
]

const VotePromo = () => {
  const [state, setState] = React.useState({
    total: 50,
    current: 1,
    pageSize: 10,
    dataSource: data,
    filteredType: null,
    filteredStatus: null,
    sortedField: null,
    sortedOrder: null,
    voteTheme: '',
    remark: '',
    modalVisible: false,
    voteType: 10,
    voteDetail: null,
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
    voteTheme,
    remark,
    modalVisible,
    voteType,
    voteDetail,
  } = state

  const [form] = Form.useForm()

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
      filteredStatus: status?.[0],
      sortedField: field,
      sortedOrder: order,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value }))

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
    },
    {
      title: '主题',
      dataIndex: 'voteTheme',
      fixed: 'left',
      width: 150,
      ...getColumnSearchProps('投票主题', 'voteTheme', handleInputSearch, voteTheme),
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
      filteredValue: filteredStatus ? [filteredStatus] : null,
      filterMultiple: false,
      filters: votePromoStatusList,
      render: (t) => votePromoStatusMap[t]?.text,
    },
    {
      title: '备注',
      width: 200,
      dataIndex: 'remark',
      ...getColumnSearchProps('备注', 'remark', handleInputSearch, remark),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      width: 220,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => setState((state) => ({ ...state, voteDetail: { id: 1 } }))}>
            修改
          </Button>
          <Popconfirm
            title={`激活 id 为 ${r.id} 的投票 ？`}
            disabled={+r.status !== 10}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="link" size="small" disabled={+r.status !== 10}>
              激活
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`完成 id 为 ${r.id} 的投票 ？`}
            disabled={+r.status !== 30}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="link" size="small" disabled={+r.status !== 30}>
              完成
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`取消 id 为 ${r.id} 的投票 ？`}
            disabled={+r.status === 50}
            onConfirm={() => console.log(r.id)}
          >
            <Button type="text" size="small" disabled={+r.status === 50}>
              取消
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
        afterClose={form.resetFields}
        bodyStyle={{ height: 520, overflowY: 'auto' }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: null, voteType: 10 }))}
        onOk={() =>
          form
            .validateFields()
            .then(console.log)
            .catch(() => {})
        }
      >
        <Radio.Group
          style={{ margin: '0 0 32px 116px' }}
          onChange={(e) => {
            const voteType = +e.target.value
            form.resetFields()

            setTimeout(() => {
              form.setFieldsValue(voteType === 10 ? { theme: '哪个代币获得两天免费推广？' } : { theme: '' })
              setState((state) => ({ ...state, voteType }))
            })
          }}
          value={voteType}
        >
          <Radio value={10}>代币投票</Radio>
          <Radio value={20}>自定义投票</Radio>
        </Radio.Group>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ theme: '哪个代币获得两天免费推广？' }}
        >
          <Form.Item label="投票主题" name="theme" rules={[{ required: true }]}>
            <Input min={1} style={{ width: '100%' }} placeholder="请输入投票主题" />
          </Form.Item>
          <Form.List
            name="options"
            rules={[
              {
                validator: async (_, names) =>
                  names?.length < 2 ? Promise.reject(new Error('至少添加两个选项内容')) : Promise.resolve(),
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
                            return !value?.trim()
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
        visible={!!voteDetail?.id}
        onCancel={() => setState((state) => ({ ...state, voteDetail: null }))}
      >
        <div>投票主题：&emsp;哪个代币获得两天免费推广？</div>
        <p />
        <div>投票时间：&emsp;2022-10-10 11:00:00 ~ 2022-10-12 11:00:00</div>
        <Divider style={{ margin: '16px 0' }} />
        <p />
        <div className={ss.option}>
          <p>
            选项 1：<b>Baby Doge Coin ($BDC) 100</b>
          </p>
          <div>
            <span>
              百分比: <b>63.2%</b>
            </span>
            <span>
              投票数: <b>1121</b>
            </span>
            <VoteModifier coinId={100} sort={1} />
          </div>
        </div>
        <div className={ss.option}>
          <p>
            选项 2：<b>Baby Doge Coin ($BDC) 101</b>
          </p>
          <div>
            <span>
              百分比: <b>13.2%</b>
            </span>
            <span>
              投票数: <b>112</b>
            </span>
            <VoteModifier coinId={101} sort={2} />
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default VotePromo
