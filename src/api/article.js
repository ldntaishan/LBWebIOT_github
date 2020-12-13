import request from '@/utils/request'

const serverBaseURL = 'http://localhost:8080/LBServerIOT_war_exploded'// 我的笔记本环境
// const serverBaseURL = "http://localhost:8080/LBServerIOT_github_war";//我的台式机环境
// const serverBaseURL = "http://39.106.55.120:8080";//线上服务器环境

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function seAllUserList(query) {
  return request({
    url: serverBaseURL + '/app/seAllUserList',
    method: 'get',
    params: { query }
  })
}

export function createUser(userName, userNickName, userEmail, userTel, userRole, userPassWord) {
  return request({
    url: serverBaseURL + '/app/userSignin',
    method: 'get',
    params: { userName, userNickName, userEmail, userTel, userRole, userPassWord }
  })
}

// export function createUser(msg,msg2) {
//   return request({
//     url: 'http://localhost:8080/LBServerIOT_github_war/app/t11',
//     method: 'get',
//     params: { msg ,msg2 }
//   })
// }
export function userDeleteObj(userBaseId) {
  return request({
    url: serverBaseURL + '/app/deluser',
    method: 'get',
    params: { userBaseId }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
