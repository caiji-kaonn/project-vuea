import axios from '@/utils/myaxios'

export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色权限
export const delekyalakuta = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 角色权限更新
export const kyalakutaupdata = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 添加角色
export const addkyara = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 删除角色
export const deleid = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
