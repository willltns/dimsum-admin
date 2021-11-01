import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

// 投票推广 api

export const addVotePromo = (params) => axios.post('/vote-promo/add', params)

export const fetchVotePromoList = (params) => axios.post('/vote-promo/list', clearFalsyFields(params))

export const fetchVotePromoDetail = (params) => axios.post('/vote-promo/detail', params)

export const deleteVotePromo = (params) => axios.post('/vote-promo/delete', params)

export const addOptionVotes = (params) => axios.post('/vote-promo/edit/option-upvotes', params)

export const updateVotePromoStatus = (params) => axios.post('/vote-promo/edit/status', params)
