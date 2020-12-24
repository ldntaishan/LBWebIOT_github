import request from '@/utils/request'

// const serverBaseURL = 'http://localhost:8080/LBServerIOT_war_exploded'// 我的笔记本环境
// const serverBaseURL = "http://localhost:8080/LBServerIOT_github_war_exploded/";//我的台式机环境
const serverBaseURL = "http://39.106.55.120:8080";//线上服务器环境


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
  //--设备管理 片段-----------

//设备查询
export function seEquipmentList(query) {
    return request({
      url: serverBaseURL + '/eqmt/f_eqmtlist',
      method: 'get',
      params: { query }
    })
}
//创建设备
export function createEquipment(organization, equipmentName, equipmentType, equipmentNO, sysState) {
    return request({
      url: serverBaseURL + '/eqmt/crt_eqmt',
      method: 'get',
      params: { organization, equipmentName, equipmentType, equipmentNO, sysState }
    })
}
//删除设备
export function delEquipment(equipmentId) {
  return request({
    url: serverBaseURL + '/eqmt/del_eqmt',
    method: 'get',
    params: { equipmentId }
  })
}
//--传感器管理 片段-----------
export function seSensorList(query) {
  return request({
    url: serverBaseURL + '/ss/f_sslist',
    method: 'get',
    params: { query }
  })
}
export function list_monitoring(query) {
  return request({
    url: serverBaseURL + '/ss/list_monitoring',
    method: 'get',
    params: { query }
  })
}

export function update_useState(sensorId,useState) {
  return request({
    url: serverBaseURL + '/ss/update_useState',
    method: 'get',
    params: { sensorId,useState}
  })
}

//创建传感器
export function createSensor(equipmentId,sensorDescription,sensorType,devNo,warningValue,sysState) {
  return request({
    url: serverBaseURL + '/ss/crt_ss',
    method: 'get',
    params: { equipmentId,sensorDescription,sensorType,devNo,warningValue,sysState }
  })
}
//编辑传感器
export function updateSensor(equipmentId,sensorDescription,sensorType,devNo,warningValue,sysState,sensorId) {
  return request({
    url: serverBaseURL + '/ss/update_ss',
    method: 'get',
    params: {equipmentId,sensorDescription,sensorType,devNo,warningValue,sysState,sensorId}
  })
}
//查询全部风塔
export function f_eqmtlistall() {
  return request({
    url: serverBaseURL + '/eqmt/f_eqmtlistall',
    method: 'get'
  })
}
//在线监测页查询风塔概览
export function f_eqmtlistallcount() {
  return request({
    url: serverBaseURL + '/eqmt/f_eqmtlistallcount',
    method: 'get'
  })
}
//编辑风塔
export function update_eqmt(eqmt) {
  return request({
    url: serverBaseURL + '/eqmt/update_eqmt',
    method: 'get',
    // params: {'organization':eqmt.organization,
    //           'equipmentName':eqmt.equipmentName,
    //           'equipmentType':eqmt.equipmentType,
    //           'equipmentNO':eqmt.equipmentNO,
    //           'sysState':eqmt.sysState,
    //           'equipmentId':eqmt.equipmentId}
    params:eqmt
  })
}
export function index_sensor_number() {
  return request({
    url: serverBaseURL + '/ss/index_sensor_number',
    method: 'get'
  })
}
//传感器重置
export function sensor_reset(sensorId) {
  return request({
    url: serverBaseURL + '/ss/sensor_reset',
    method: 'get',
    params: { sensorId }
  })
}

  //-------------------------
