import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

export const fetchPromoApplyList = (params) => axios.post('/promo-request/list', clearFalsyFields(params))

export const updatePromoRequestStatus = (params) => axios.post('/promo-request/edit', params)

export const deletePromoRequest = (params) => axios.post('/promo-request/delete', params)
