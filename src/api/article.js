import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function seAllUserList(query) {
  return request({
    // url: 'http://39.106.55.120:8080/app/seAllUserList',
    url: 'http://localhost:8080/LBServerIOT_github_war/app/seAllUserList',
    method: 'get',
    params: {query}
  })
}

export function createUser(userName,userNickName,userEmail,userTel,userRole,userPassWord) {
  return request({
    url: 'http://localhost:8080/LBServerIOT_github_war/app/userSignin',
    method: 'get',
    params: { userName,userNickName,userEmail,userTel,userRole,userPassWord }
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
    url: 'http://localhost:8080/LBServerIOT_github_war/app/deluser',
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
