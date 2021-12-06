import { message } from 'antd'

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    msg === 'successful' ? message.success('已复制: ' + text) : message.error('复制失败: ' + text)
    // console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    message.error('复制失败: ' + text)
    // console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}
export function copy(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      message.success('已复制: ' + text)
      // console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      message.error('复制失败: ' + text)
      // console.error('Async: Could not copy text: ', err)
    }
  )
}
