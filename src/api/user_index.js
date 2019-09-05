import axios from '@/utils/myaxios'

export const getUserall = (params) => {
  return axios({
    url: 'users',
    params
  })
}

export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

export const edditUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

export const delteById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

export const updateUserState = (Id, type) => {
  return axios({
    url: `users/${Id}/state/${type}`,
    method: 'put'
  })
}

export const Userrole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
