import axios from '@/utils/axios'
import { clearFalsyFields } from '@/utils/clearFalsyFields'

// 投票推广 api

export const addAutoVote = (params) => axios.post('/auto-vote/add', params)

export const fetchAutoVoteList = (params) => axios.post('/auto-vote/list', clearFalsyFields(params))

export const updateAutoVoteStatus = (params) => axios.post('/auto-vote/edit/status', params)

export const deleteAutoVote = (params) => axios.post('/auto-vote/delete', params)
