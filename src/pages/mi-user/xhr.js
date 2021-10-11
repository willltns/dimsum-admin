import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

export const fetchUserList = (params) => axios.post('/user/list', clearFalsyFields(params))

export const addUser = (params) => axios.post('/user/add', params)

export const updateUser = (params) => axios.post('/user/edit', params)

export const updateUserStatus = (params) => axios.post('/user/edit/status', params)
