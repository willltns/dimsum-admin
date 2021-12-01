export const coinStatusMap = {
  10: { text: '待审核', value: 10, color: '#00d62f' },
  20: { text: '已上市', value: 20, color: '#2196f3' },
  30: { text: '已下市', value: 30, color: '#a8a8a8' },
}
export const coinStatusList = Object.values(coinStatusMap)

export const promoCoinStatusMap = {
  10: { text: '待确定', value: 10 },
  20: { text: '已上架', value: 20 },
  30: { text: '已下架', value: 30 },
}
export const promoCoinStatusList = Object.values(promoCoinStatusMap)
