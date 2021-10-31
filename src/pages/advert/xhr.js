import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

// 横幅广告 api

export const fetchBannerList = (params) => axios.post('/advert/banner/list', clearFalsyFields(params))

export const addBanner = (params) => axios.post('/advert/banner/add', params)

export const updateBanner = (params) => axios.post('/advert/banner/edit', params)

export const updateBannerStatus = (params) => axios.post('/advert/banner/edit/status', params)

// -------

// 推广代币 api

export const fetchPromoCoinList = (params) => axios.post('/coin/list', clearFalsyFields({ ...params, promoted: 1 }))

export const updatePromoCoin = (params) => axios.post('/advert/promo-coin/edit', params)

export const updatePromoCoinStatus = (params) => axios.post('/advert/promo-coin/edit/status', params)

export const getSearchPromo = () => axios.post('/coin/search/promo', {})
