import axios from '@/utils/axios'

// 代币主网 api

export const fetchChainList = () => axios.post('/coin-chain/list')

export const addChain = (params) => axios.post('/coin-chain/add', params)

export const editChain = (params) => axios.post('/coin-chain/edit', params)
