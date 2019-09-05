// 在这里实现发送axios
import axios from '@/utils/myaxios'

export const getAllgoodlist = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
