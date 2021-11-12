// import ss from './index.module.less'

import React, { useState, useEffect, useCallback } from 'react'
import { Button, Form, Input, Modal, Table, Space, Popconfirm, message } from 'antd'

import { fetchOtherFeeList, addOtherFee, updateOtherFee, deleteOtherFee } from '@/pages/advert/xhr'
import { getColumnSearchProps } from '@/utils/getColumnSearchProps'
import { useStore } from '@/utils/hooks/useStore'

const OtherFeeMGMT = () => {
  const { common } = useStore()

  const [state, setState] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
    dataSource: [],
    sortedField: null,
    sortedOrder: null,
    info: '',
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
    sortedField,
    sortedOrder,
    info,
    remark,
    modalVisible,
    curModify,
    tableLoading,
    editLoading,
  } = state

  const handleOtherFeeList = useCallback(() => {
    setState((state) => ({ ...state, tableLoading: true }))
    const params = {
      pageNo: current,
      pageSize,
      sortedField,
      sortedOrder,
      info,
      remark,
    }

    fetchOtherFeeList(params)
      .then((res) =>
        setState((state) => ({ ...state, tableLoading: false, dataSource: res?.list || [], total: res?.total || 0 }))
      )
      .catch(() => setState((state) => ({ ...state, tableLoading: false })))
  }, [current, pageSize, sortedField, sortedOrder, info, remark])

  useEffect(() => {
    handleOtherFeeList()
  }, [handleOtherFeeList])

  const [form] = Form.useForm()

  const handleEditOk = async () => {
    setState((state) => ({ ...state, editLoading: true }))
    try {
      const values = await form.validateFields()
      const params = { ...values }
      curModify?.id && (params.id = curModify.id)
      curModify?.id ? await updateOtherFee(params) : await addOtherFee(params)
      setState((state) => ({ ...state, editLoading: false, modalVisible: false, curModify: null }))
      handleOtherFeeList()
    } catch (err) {
      setState((state) => ({ ...state, editLoading: false }))
    }
  }

  const handleDelete = (id) => {
    setState((state) => ({ ...state, editLoading: true }))
    deleteOtherFee(id)
      .then(handleOtherFeeList)
      .catch(() => {})
      .finally(() => setState((state) => ({ ...state, editLoading: false })))
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
    const { field, order } = sorter

    setState((state) => ({
      ...state,
      current: state.pageSize === pageSize ? current : 1,
      pageSize,
      sortedOrder: order,
      sortedField: order ? field : null,
    }))
  }

  const handleInputSearch = (key, value) => setState((state) => ({ ...state, [key]: value, current: 1 }))

  const columns = [
    { title: 'ID', dataIndex: 'id', fixed: 'left', width: 80 },
    {
      title: '联系信息',
      dataIndex: 'info',
      fixed: 'left',
      width: 200,
      ...getColumnSearchProps('联系信息', 'info', handleInputSearch, info),
    },
    {
      title: '费用',
      dataIndex: 'price',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
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
      width: 110,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setState((state) => ({ ...state, modalVisible: true, curModify: r }))
              setTimeout(() => form.setFieldsValue({ ...r }))
            }}
          >
            修改
          </Button>

          {common.godAuth && (
            <Popconfirm
              title={`删除 ID 为 ${r.id} 的数据 ？`}
              onConfirm={() => {
                if (!r.price) handleDelete(r.id)
                else message.warn(`当前数据有计费用 ${r.price}，请确认清空费用`)
              }}
            >
              <Button danger type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Button type="primary" onClick={() => setState((state) => ({ ...state, modalVisible: true }))}>
        添加其他费用
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

      {/* 编辑额外费用弹窗 */}
      <Modal
        centered
        width={600}
        keyboard={false}
        maskClosable={false}
        title={curModify?.id ? '修改其他费用' : '添加其他费用'}
        visible={modalVisible}
        closable={!editLoading}
        okButtonProps={{ loading: editLoading }}
        cancelButtonProps={{ disabled: editLoading }}
        onCancel={() => setState((state) => ({ ...state, modalVisible: false, curModify: null }))}
        afterClose={form.resetFields}
        onOk={handleEditOk}
      >
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
          <Form.Item label="联系信息" name="info">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="费用"
            name="price"
            validateTrigger="onBlur"
            rules={[{ required: true }, { pattern: /^(-)?\d+(\.\d+)?$/, message: '请输入正确费用' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default OtherFeeMGMT
