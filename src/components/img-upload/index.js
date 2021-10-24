import ss from './index.module.less'

import React from 'react'
import { Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadFile } from '@/assets/xhr'
import { fileDomain } from '@/consts'

export async function handleFileUpload({ file, onError, onSuccess }) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await uploadFile(formData)
    onSuccess(res, file)
  } catch (err) {
    onError('上传出错，请重新尝试')
  }
}

function ImgUpload({ value, onChange, iconRef, onClick, ...restProps }) {
  const onPreview = ({ response }) =>
    Modal.info({
      icon: null,
      centered: true,
      closable: true,
      maskClosable: true,
      className: ss.previewImg,
      content: <img src={fileDomain + response} alt="logo" />,
    })

  return (
    <Upload
      name="logo"
      maxCount={1}
      listType="picture-card"
      accept=".png,.jpg,.jpeg,.gif,.svg"
      customRequest={handleFileUpload}
      className={ss.imgUpload}
      onPreview={onPreview}
      onChange={onChange}
      fileList={value}
      {...restProps}
    >
      <UploadOutlined ref={iconRef} onClick={onClick} />
    </Upload>
  )
}

export default ImgUpload

//
export const uploadErrorValidator = {
  validator: (rule, value) =>
    value?.[0]?.status === undefined || value?.[0]?.status === 'done'
      ? Promise.resolve()
      : Promise.reject('上传出错，请删除或重新上传'),
}
