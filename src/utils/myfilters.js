import moment from 'moment'
export const timeforma = (time) => {
  time = new Date(time * 1000)
  return moment().format('YYYY-MM-DD HH:mm:ss')
}
