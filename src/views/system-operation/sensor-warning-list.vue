<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.equipmentName" placeholder="所属风塔" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->

      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button> -->
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button> -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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

      <el-table-column label="报警阈值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.warningValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实时监控值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.absoluteValue }}</span>
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
            {{ row.useState | useNameFilter}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="监控状态" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.useState=='enable'&&row.monitoringState!=null" :type="row.monitoringState | monitoringStatusFilter">
            {{ row.monitoringState | monitoringNameFilter}}
          </el-tag>
          <!-- <span v-else>--</span> -->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          <el-button type="success" size="mini" @click="handleUpdate(row)">-->
          <!--            重置-->
          <!--          </el-button>-->
          <el-button v-if="row.useState!='disable'" size="mini" type="danger" @click="handleModifyStatus(row,'disable')">
            停用
          </el-button>
          <el-button v-if="row.useState!='enable'" size="mini" type="success" @click="handleModifyStatus(row,'enable')">
            启用
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import {
    list_monitoring,
    update_useState
  } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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

  export default {
    name: 'SensorWarningList',
    components: {
      Pagination
    },
    directives: {
      waves
    },
    filters: {
      useStatusFilter(status) {
        return useStatusMap[status] != undefined ? useStatusMap[status].type : ''
      },
      monitoringStatusFilter(status) {
        return monitoringStatusMap[status] != undefined ? monitoringStatusMap[status].type : ''
      },

      useNameFilter(useStatus) {
        return useStatusMap[useStatus] != undefined ? useStatusMap[useStatus].name : ''
      },
      monitoringNameFilter(monitoringStatus) {
        return monitoringStatusMap[monitoringStatus] != undefined ? monitoringStatusMap[monitoringStatus].name : ''
      }
    },

    data() {
      return {
        timer: null, //定时器
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        // 查询条件参数
        listQuery: {
          page: 1,
          limit: 10,
          useState: 'enable',
          monitoringState: 'alert'
        },
        useStatusTypeOptions,
        monitoringStatusTypeOptions,
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      this.timer = setInterval(() => {
        setTimeout(this.getList(), 0)
      }, 1000 * 10)
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      getList() {
        this.listLoading = true
        list_monitoring(this.listQuery).then(response => {
          this.list = response.callbackList
          this.total = response.total
          // this.total = response.data.total

          // Just to simulate the time of the request
          // setTimeout(() => {
          this.listLoading = false
          // }, 0.7 * 1000)
        })
      },
      // handleFilter() {
      //     this.listQuery.page = 1
      //     this.getList()
      // },
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
      // sortByID(order) {
      //     if (order === 'ascending') {
      //         this.listQuery.sort = '+id'
      //     } else {
      //         this.listQuery.sort = '-id'
      //     }
      //     this.handleFilter()
      // },
      // resetTemp() {
      //     this.temp = {
      //         sensorId:undefined,
      //         sensorDescription:'',
      //         sensorType:'',
      //         devNo:'',
      //         equipmentId:'',
      //         equipmentName:'',
      //         warningValue:'',
      //         allWarningId:'',
      //         nowTimeValue:'',
      //         absoluteValue:'',
      //         uploadTime:'',
      //         sysState:'',
      //         createdate:'',
      //         status: '1'

      //     }
      // },
      // handleCreate() {
      //     this.resetTemp()
      //     this.dialogStatus = 'create'
      //     this.dialogFormVisible = true
      //     this.$nextTick(() => {
      //         this.$refs['dataForm'].clearValidate()
      //     })
      // },
      // createData() {
      //     this.$refs['dataForm'].validate((valid) => {
      //         if (valid) {
      //             // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //             // this.temp.author = 'vue-element-admin'
      //             createSensor(
      //                 this.temp.equipmentId,
      //                 this.temp.sensorDescription,
      //                 this.temp.sensorType,
      //                 this.temp.devNo,
      //                 this.temp.warningValue,
      //                 this.temp.sysState
      //             ).then(() => {
      //                 this.list.unshift(this.temp)
      //                 this.dialogFormVisible = false
      //                 this.$notify({
      //                     title: 'Success',
      //                     message: '创建成功',
      //                     type: 'success',
      //                     duration: 2000
      //                 })
      //                 this.getList()
      //             })
      //         }
      //     })
      // },
      // handleUpdate(row) {
      //     this.temp = Object.assign({}, row) // copy obj
      //     this.temp.timestamp = new Date(this.temp.timestamp)
      //     this.dialogStatus = 'update'
      //     this.dialogFormVisible = true
      //     this.$nextTick(() => {
      //         this.$refs['dataForm'].clearValidate()
      //     })
      // },
      // updateData() {
      //     this.$refs['dataForm'].validate((valid) => {
      //         if (valid) {
      //             const tempData = Object.assign({}, this.temp)
      //             tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //             updateArticle(tempData).then(() => {
      //                 const index = this.list.findIndex(v => v.id === this.temp.id)
      //                 this.list.splice(index, 1, this.temp)
      //                 this.dialogFormVisible = false
      //                 this.$notify({
      //                     title: 'Success',
      //                     message: 'Update Successfully',
      //                     type: 'success',
      //                     duration: 2000
      //                 })
      //             })
      //         }
      //     })
      // },
      // handleDelete(row, index) {
      //     this.temp = Object.assign({}, row) // copy obj

      //     userEquipment(this.temp.equipmentId).then(() => {
      //         this.list.splice(index, 1)
      //         this.$notify({
      //             title: 'Success',
      //             message: 'Delete Successfully',
      //             type: 'success',
      //             duration: 2000
      //         })
      //     })
      //     this.getList()
      // },

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
