<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.equipmentName" placeholder="所属风塔" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.useState" style="width: 140px" class="filter-item" clearable placeholder="工作状态">
        <el-option v-for="item in useStatusTypeOptions" :key="item.useState" :label="item.name" :value="item.useState" />
      </el-select>
      <el-select
        v-model="listQuery.monitoringState"
        style="width: 140px;margin-left: 10px;"
        class="filter-item"
        clearable
        placeholder="监控状态"
      >
        <el-option v-for="item in monitoringStatusTypeOptions" :key="item.monitoringState" :label="item.name" :value="item.monitoringState" />
      </el-select>
      <!-- monitoringState -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left:15px;" @click="handleFilter">
        查询
      </el-button>
      <!--      <el-button class="filter-item" style="margin-left: 15px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        创建-->
      <!--      </el-button>-->
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;">
        控制操作
      </el-checkbox>
      <el-checkbox v-model="rvscan" class="filter-item" style="margin-left:15px;">
        实时监控
      </el-checkbox>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">

      <el-table-column label="所属风塔" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.equipmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="传感器描述" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sensorDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column label="型号" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sensorType }}</span>
        </template>
      </el-table-column>

      <el-table-column label="唯一码" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.devNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="报警阈值" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.warningValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="监控值" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="color: #ff750d">{{ row.absoluteValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="数据更新时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uploadTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="工作状态" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.useState" :type="row.useState | useStatusFilter">
            {{ row.useState | useNameFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="监控状态" min-width="90px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.useState=='enable'&&row.monitoringState!=null" :type="row.monitoringState | monitoringStatusFilter">
            {{ row.monitoringState | monitoringNameFilter }}
          </el-tag>
          <!-- <span v-else>--</span> -->
        </template>
      </el-table-column>

      <el-table-column v-if="showReviewer" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--          <el-button type="success" size="mini" @click="handleUpdate(row)">-->
          <!--            重置-->
          <!--          </el-button>-->
          <el-button v-if="row.useState!='disable'" size="mini" type="danger" @click="handleModifyStatus(row,'disable')">
            停用
          </el-button>
          <el-button v-if="row.useState!='enable'" size="mini" type="success" @click="handleModifyStatus(row,'enable')">
            启用
          </el-button>
          <el-button v-if="row.useState!='enable'" type="primary" size="mini" @click="handleSensorReset(row)">
            重置
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">

        <el-form-item label="所属风塔" prop="organization">
          <el-input v-model="temp.equipmentId" placeholder="请输入所属风场名称" />
        </el-form-item>

        <el-form-item label="传感器描述" prop="equipmentName">
          <el-input v-model="temp.sensorDescription" />
        </el-form-item>

        <el-form-item label="传感器型号" prop="equipmentType">
          <el-input v-model="temp.sensorType" />
        </el-form-item>

        <el-form-item label="传感器唯一码" prop="equipmentNO">
          <el-input v-model="temp.devNo" />
        </el-form-item>

        <el-form-item label="自定松动值" prop="organization">
          <el-input v-model="temp.warningValue" placeholder="请输入所属风场名称" />
        </el-form-item>

        <!--        <el-form-item label="统一松动值" prop="equipmentName">-->
        <!--          <el-input v-model="temp.equipmentName" />-->
        <!--        </el-form-item>-->

        <el-form-item label="系统状态" prop="equipmentType">
          <el-input v-model="temp.sysState" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  list_monitoring,
  update_useState,
  createSensor,
  updateArticle,
  userEquipment,
  sensor_reset
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import {
  parseTime
} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [{
  key: '1',
  display_name: '超级管理员'
},
{
  key: '2',
  display_name: '管理员'
}
]
/**
   * 工作状态
   * 停用 0 （初始化）disable
   * 启用 1   enable
   */
const useStatusTypeOptions = [{
  useState: 'disable',
  type: 'info',
  name: '已停止'
},
{
  useState: 'enable',
  type: 'primary',
  name: '监控中'
}
]
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

const useStatusMap = useStatusTypeOptions.reduce((acc, use) => {
  acc[use.useState] = {}
  acc[use.useState].type = use.type
  acc[use.useState].name = use.name
  return acc
}, {})

const monitoringStatusMap = monitoringStatusTypeOptions.reduce((acc, monitoring) => {
  acc[monitoring.monitoringState] = {}
  acc[monitoring.monitoringState].type = monitoring.type
  acc[monitoring.monitoringState].name = monitoring.name
  return acc
}, {})

// arr to obj, such as { 1 : "超级管理员", 2 : "管理员" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'SensorList',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    useStatusFilter(status) {
      return useStatusMap[status] !== undefined ? useStatusMap[status].type : ''
    },
    monitoringStatusFilter(status) {
      return monitoringStatusMap[status] !== undefined ? monitoringStatusMap[status].type : ''
    },

    useNameFilter(useStatus) {
      return useStatusMap[useStatus] !== undefined ? useStatusMap[useStatus].name : ''
    },
    monitoringNameFilter(monitoringStatus) {
      return monitoringStatusMap[monitoringStatus] !== undefined ? monitoringStatusMap[monitoringStatus].name : ''
    }
  },
  data() {
    return {
      sensorListTimer: null, // 定时器
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 查询条件参数
      listQuery: {
        page: 1,
        limit: 10,
        useState: undefined,
        monitoringState: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      useStatusTypeOptions,
      monitoringStatusTypeOptions,
      sortOptions: [{
        label: 'ID Ascending',
        key: '+id'
      }, {
        label: 'ID Descending',
        key: '-id'
      }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      rvscan: false, // 是否实时刷新
      temp: {
        sensorId: undefined,
        sensorDescription: '',
        sensorType: '',
        devNo: '',
        equipmentId: '',
        equipmentName: '',
        warningValue: '',
        allWarningId: '',
        nowTimeValue: '',
        absoluteValue: '',
        uploadTime: '',
        sysState: '',
        createdate: '',
        status: '1'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{required: true,message: 'type is required',trigger: 'change'}],
        // timestamp: [{type: 'date',required: true,message: 'timestamp is required',trigger: 'change'}],
        userName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        userPassWord: [{
          required: true,
          message: '请设定密码',
          trigger: 'blur'
        }],
        userTel: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }],
        userRole: [{
          required: true,
          message: '请选择用户角色',
          trigger: 'change'
        }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.sensorListTimer = setInterval(() => {
      setTimeout(this.timeoutRefresh(), 0)
    }, 1000 * 6)
  },

  beforeDestroy() {
    clearInterval(this.sensorListTimer)
    this.sensorListTimer = null
  },
  methods: {
    getList() {
      // this.listLoading = true
      this.listLoading = false
      list_monitoring(this.listQuery).then(response => {
        this.list = response.callbackList
        this.total = response.total
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          // this.listLoading = false
        }, 0.7 * 1000)
      })
    },
    timeoutRefresh() {
      if (this.rvscan) {
        this.getList()
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, useState) {
      this.listLoading = true
      update_useState(row.sensorId, useState).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.useState = useState
        this.listLoading = false
      })
    },
    handleSensorReset(row) {
      this.listLoading = true
      sensor_reset(row.sensorId).then(response => {
        row.absoluteValue = response.absoluteValue
        row.monitoringState = response.monitoringState
        row.uploadTime = response.uploadTime

        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.listLoading = false
      })
    },
    sortChange(data) {
      const {
        prop,
        order
      } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        sensorId: undefined,
        sensorDescription: '',
        sensorType: '',
        devNo: '',
        equipmentId: '',
        equipmentName: '',
        warningValue: '',
        allWarningId: '',
        nowTimeValue: '',
        absoluteValue: '',
        uploadTime: '',
        sysState: '',
        createdate: '',
        status: '1'

      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createSensor(
            this.temp.equipmentId,
            this.temp.sensorDescription,
            this.temp.sensorType,
            this.temp.devNo,
            this.temp.warningValue,
            this.temp.sysState
          ).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.temp = Object.assign({}, row) // copy obj

      userEquipment(this.temp.equipmentId).then(() => {
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      this.getList()
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
