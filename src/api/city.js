// 导入request.js
import request from '@/utils/request'
export default {
  getList() {
    return request({
      url: `/gathering/city`,
      method: 'get'
    })
  }
}
