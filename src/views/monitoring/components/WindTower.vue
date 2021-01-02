<!-- <template>
  <el-row :gutter="20" class="wind-tower" style="padding: 14px;">
    <el-col v-for="(sensor, index) in sensorWarningList" align='middle' :key="sensor" :xs="8" :sm="8" :lg="4">
      <el-card shadow="hover" :body-style="{ padding: '5px' }">
        <img align="center" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          width="100%" class="image" :fit='scale-down'>

        <el-row type="flex" justify="start">
          <div >位置：{{sensor.equipmentName}}</div>
        </el-row>
        <el-row type="flex" justify="start">
          <div >点位：{{sensor.sensorDescription}}</div>
        </el-row>
        <el-row type="flex" justify="start">
          <div  v-if="sensor.monitoringState">状态：{{sensor.monitoringState | monitoringNameFilter}}</div>
          <div  v-else>状态：</div>
        </el-row>
        <el-row type="flex" justify="space-between">
          <div >偏移值：{{sensor.absoluteValue}}</div>
          <el-button type="text" class="button" @click="handleDetails(sensor)">详情</el-button>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template> -->

<template>
  <el-row :gutter="8" class="wind-tower">
    <el-col
      v-for="(eqmt) in eqmtlistall"
      :key="eqmt.equipmentId"
      :xs="{span: 24}"
      :sm="{span: 12}"
      :md="{span: 12}"
      :lg="{span: 6}"
      :xl="{span: 7}"
      style="margin-bottom:30px;max-width: 400px;min-width: 300px"
    >
      <el-card shadow="hover" class="box-card-component" style="margin-left:8px;">
        <div slot="header" class="box-card-header">
          <img src="@/assets/gifacc/fengche01.gif">
        </div>
        <div style="position:relative;">
          <mallki class-name="mallki-text" :text="eqmt.equipmentName" href="#/system-opeartion/sensor-list" />
          <!-- <pan-thumb :image="avatar" class="panThumb" align="left" /> -->
          <div align="justify" style="padding-top:40px;" class="progress-item">
            <span>总数:</span>
            <el-tag style="margin-left:10px;margin-right: 10px ">{{ eqmt.allTotal }}</el-tag>
            <span>正常:</span>
            <el-tag type="success" style="margin-left:10px ;margin-right: 10px">{{ eqmt.normalTotal }}</el-tag>
          </div>
          <div align="justify" style="padding-top:10px;" class="progress-item">
            <span>报警:</span>
            <el-tag type="danger" style="margin-left:10px;margin-right: 10px ">{{ eqmt.alertTotal }}</el-tag>
            <span>掉线:</span>
            <el-tag type="info" style="margin-left:10px ;margin-right: 10px">{{ eqmt.offlineTotal }}</el-tag>

          </div>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<!-- <template>
  <el-table v-if="sensorWarningList" :data="sensorWarningList" stripe style="width: 100%;padding-top: 15px;">
    <el-table-column label="风塔位置" min-width="130">
      <template slot-scope="{row}">
        {{row.equipmentName}}
      </template>
    </el-table-column>
    <el-table-column label="螺栓点位" width="150" align="center">
      <template slot-scope="{row}">
        {{row.sensorDescription}}
      </template>
    </el-table-column>
    <el-table-column label="监控状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag v-if="row.useState=='enable'&&row.monitoringState!=null" :type="row.monitoringState | monitoringStatusFilter">
          {{ row.monitoringState | monitoringNameFilter}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="偏移值" width="80" align="center">
      <template slot-scope="{row}">
        {{row.absoluteValue}}
      </template>
    </el-table-column>
  </el-table>
</template> -->

<script>
import {
  f_eqmtlistallcount
} from '@/api/article'
  // import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'
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
  name: 'WindTower',
  components: { Mallki },
  filters: {
    monitoringStatusFilter(status) {
      return monitoringStatusMap[status] !== undefined ? monitoringStatusMap[status].type : ''
    },
    monitoringNameFilter(monitoringStatus) {
      return monitoringStatusMap[monitoringStatus] !== undefined ? monitoringStatusMap[monitoringStatus].name : ''
    }
  },
  props: {
    monitoringState: String
  },
  data() {
    return {
      timer: null, // 定时器
      eqmtlistall: null,
      listLoading: true,
      // 查询条件参数
      listQuery: {
        page: 1,
        limit: 1000,
        useState: 'enable',
        monitoringState: this.$props.monitoringState
      },
      monitoringStatusTypeOptions
    }
  },
  created() {
    this.getSensorWarningList()
    this.timer = setInterval(() => {
      setTimeout(this.getSensorWarningList(), 0)
    }, 1000 * 6)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getSensorWarningList() {
      // console.log(this.$props.monitoringState);
      this.listLoading = true
      f_eqmtlistallcount().then(response => {
        this.eqmtlistall = response.callbackList
        this.listLoading = false
      })
    },
    // 查看报警螺栓的详情
    handleDetails(sensor) {

    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card-component {
    .box-card-header {
      position: relative;
      height: 220px;
      img {
        width: 100%;
        height: 100%;
        transition: all 0.2s linear;
        &:hover {
          transform: scale(1.1, 1.1);
          filter: contrast(130%);
        }
      }
    }
    .mallki-text {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      font-weight: bold;
    }
    .panThumb {
      z-index: 100;
      height: 70px!important;
      width: 70px!important;
      position: absolute!important;
      top: -45px;
      left: 0px;
      border: 5px solid #ffffff;
      background-color: #fff;
      margin: auto;
      box-shadow: none!important;
      ::v-deep .pan-info {
        box-shadow: none!important;
      }
    }
    .progress-item {
      margin-bottom: 10px;
      font-size: 14px;
    }
    // @media only screen and (max-width: 1510px){
    //   .mallki-text{
    //     display: none;
    //   }
    // }
  }
</style>
