import axios from '@/utils/axios'

export const fetchCoinByINS = (ins) => axios.post('/coin/ins', { ins })

export const login = (params) => axios.post('/user/login', params)

export const logout = () => axios.post('/user/logout')

export const uploadFile = (params) => axios.post('/file/upload', params)

export const getServerTime = () => axios.post('/getServerTime')
