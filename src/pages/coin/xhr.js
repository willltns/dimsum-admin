import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

// 代币 api

export const addCoin = (params) => axios.post('/coin/add', params)

export const updateCoin = (params) => axios.post('/coin/edit', params)

export const fetchCoinList = (params) => axios.post('/coin/list', clearFalsyFields(params))

export const updateCoinStatus = (params) => axios.post('/coin/edit/status', params)

export const deleteCoin = (params) => axios.post('/coin/delete', params)
