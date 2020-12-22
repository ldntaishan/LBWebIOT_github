<template>
  <el-row :gutter="20" class="wind-tower" style="padding: 14px;">
    <el-col v-for="(sensor, index) in sensorWarningList" align='middle' :key="sensor" :xs="8" :sm="8" :lg="4">
      <el-card shadow="hover" :body-style="{ padding: '5px' }">
        <img align="center" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          width="100%" class="image" :fit='scale-down'>


        <el-row type="flex" justify="start">
          <div >位置：{{sensor.equipmentName}}</div>
        </el-row>
        <el-row type="flex" justify="start">
          <div type="info">点位：{{sensor.sensorDescription}}</div>
        </el-row>
        <el-row type="flex" justify="start">
          <div  v-if="sensor.monitoringState">状态：{{sensor.monitoringState | monitoringNameFilter}}</div>
          <div  v-else>状态：</div>
        </el-row>
        <el-row type="flex" justify="space-between">
          <div type="info">偏移值：{{sensor.absoluteValue}}</div>
          <el-button type="text" class="button" @click="handleDetails(sensor)">详情</el-button>
        </el-row>


        <!-- <div style="padding: 14px;float: left;">
          <span>位置：{{sensor.equipmentName}}</span>
          <span>点位：{{sensor.sensorDescription}}</span>
          <div>
            <span v-if="sensor.monitoringState">状态：{{sensor.monitoringState | monitoringNameFilter}}</span>
            <span v-else>状态：</span>
          </div>
          <div justify='space-around' class="bottom clearfix">
            <span>偏移值：{{sensor.absoluteValue}}</span>
            <el-button type="text" class="button" @click="handleDetails(sensor)">详情</el-button>
          </div>
        </div> -->
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {
    list_monitoring
  } from '@/api/article'
  /**
   * 监控状态
   * 初始化 0 Initialize
   * 正常 绿色 1 normal
   * 掉线 灰色 2 offline
   * 松动 橙色 3 OrangeAlert
   * 松动 红色 4 RedAlert
   */
  const monitoringStatusTypeOptions = [{
      monitoringState: 'initialize',
      type: '',
      name: '初始化'
    },
    {
      monitoringState: 'normal',
      type: 'success',
      name: '正常'
    },
    {
      monitoringState: 'offline',
      type: 'info',
      name: '掉线'
    },
    {
      monitoringState: 'alert',
      type: 'danger',
      name: '松动'
    }
  ]
  const monitoringStatusMap = monitoringStatusTypeOptions.reduce((acc, monitoring) => {
    acc[monitoring.monitoringState] = {}
    acc[monitoring.monitoringState].type = monitoring.type
    acc[monitoring.monitoringState].name = monitoring.name
    return acc
  }, {})
  export default {
    name: 'windTower',
    filters: {
      monitoringStatusFilter(status) {
        return monitoringStatusMap[status] != undefined ? monitoringStatusMap[status].type : ''
      },
      monitoringNameFilter(monitoringStatus) {
        return monitoringStatusMap[monitoringStatus] != undefined ? monitoringStatusMap[monitoringStatus].name : ''
      }
    },
    data() {
      return {
        timer: null, //定时器
        sensorWarningList: null,
        listLoading: true,
        // 查询条件参数
        listQuery: {
          page: 1,
          limit: 1000,
          useState: 'enable',
          monitoringState: 'alert'
        },
        monitoringStatusTypeOptions
      }
    },
    created() {
      this.getSensorWarningList()
      this.timer = setInterval(() => {
        setTimeout(this.getSensorWarningList(), 0)
      }, 1000 * 10)
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      getSensorWarningList() {
        this.listLoading = true
        list_monitoring(this.listQuery).then(response => {
          this.sensorWarningList = response.callbackList
          this.listLoading = false
        })
      },
      //查看报警螺栓的详情
      handleDetails(sensor) {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    text-color: #e5e9f2;
  }

</style>
