import ss from './index.module.less'

import React from 'react'
import { message, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadFile } from '@/assets/xhr'
import { fileDomain } from '@/consts'

const acceptList = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

export async function handleFileUpload(file) {
  try {
    if (!file) throw new Error('')
    const formData = new FormData()
    formData.append('file', file)

    return await uploadFile(formData)
  } catch (err) {
    message.error('上传图片出错，请重新尝试')
    throw new Error('上传图片出错，请重新尝试')
  }
}

function ImgUpload({ value, onChange, fileMaxSize = 0.1, iconRef, onClick, ...restProps }) {
  const beforeUpload = (file, fileList) => {
    if (fileList.length > 1) {
      message.warn('Please select only one file.')
      return Upload.LIST_IGNORE
    }

    if (!acceptList.some((type) => file.type.includes(type.slice(1)))) {
      message.warn(`Image extension error, only support ${acceptList.join(' / ')}`)
      return Upload.LIST_IGNORE
    }

    if (file.size / 1024 / 1024 > fileMaxSize) {
      message.warn(`Image size should be less than ${fileMaxSize} MB.`)
      return Upload.LIST_IGNORE
    }

    return false
  }

  return (
    <Upload
      name="logo"
      maxCount={1}
      listType="picture-card"
      accept={acceptList.join(',')}
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

export function onPreview({ response, thumbUrl }) {
  Modal.info({
    icon: null,
    centered: true,
    closable: true,
    maskClosable: true,
    className: ss.previewImg,
    content: <img src={response ? fileDomain + response : thumbUrl} alt="logo" />,
  })
}
