export const clearFalsyFields = (params) => {
  const clearedData = {}

  Object.entries(params).forEach(([key, value]) => (!!value || value === 0) && (clearedData[key] = value))

  return clearedData
}
