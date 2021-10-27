import ss from './index.module.less'

import React from 'react'
import { message, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadFile } from '@/assets/xhr'
import { fileDomain } from '@/consts'

const acceptList = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

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

const onPreview = ({ response }) =>
  Modal.info({
    icon: null,
    centered: true,
    closable: true,
    maskClosable: true,
    className: ss.previewImg,
    content: <img src={fileDomain + response} alt="logo" />,
  })

const beforeUpload = (file, fileList) => {
  if (fileList.length > 1) {
    message.warn('Please select only one file.')
    return Upload.LIST_IGNORE
  }

  if (!acceptList.some((type) => file.type.includes(type.slice(1)))) {
    message.warn(`Image extension error, only support ${acceptList.join(' / ')}`)
    return Upload.LIST_IGNORE
  }

  if (file.size / 1024 / 1024 > 0.1) {
    message.warn('Image size should be less than 0.1 MB.')
    return Upload.LIST_IGNORE
  }

  return true
}

function ImgUpload({ value, onChange, iconRef, onClick, ...restProps }) {
  return (
    <Upload
      name="logo"
      maxCount={1}
      listType="picture-card"
      accept={acceptList.join(',')}
      customRequest={handleFileUpload}
      beforeUpload={beforeUpload}
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
