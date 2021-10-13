import axios from '@/utils/axios'

export const fetchCoinByINS = (INS) => axios.post('/coin/list/ins', { INS })

export const login = (params) => axios.post('/user/login', params)

export const logout = () => axios.post('/user/logout')

export const getServerTime = () => axios.post('/getServerTime')
