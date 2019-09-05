import axios from '@/utils/myaxios'

export const getallLevel = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 获取左边菜单
export const getLeftMenu = (type) => {
  return axios({
    url: 'menus'
  })
}
