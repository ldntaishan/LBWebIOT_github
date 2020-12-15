<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.equipmentName" placeholder="所属风塔" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">

      <el-table-column label="所属风塔" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.equipmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="传感器描述" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sensorDescription }}</span>
        </template>
      </el-table-column>

      <el-table-column label="型号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sensorType }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备编码" min-width="120px">
        <template slot-scope="{row}">
          <span >{{ row.devNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="自定义阈值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.warningValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="系统默认阈值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.warningValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实时值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nowTimeValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="绝对值" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.absoluteValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uploadTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="系统状态" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sysState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.userState!='2'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="所属风场" prop="organization">
          <el-input v-model="temp.organization" placeholder="请输入所属风场名称" />
        </el-form-item>

        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="temp.equipmentName" />
        </el-form-item>

        <el-form-item label="设备型号" prop="equipmentType">
          <el-input v-model="temp.equipmentType" />
        </el-form-item>

        <el-form-item label="设备编号" prop="equipmentNO">
          <el-input v-model="temp.equipmentNO" />
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
        seSensorList,
        createEquipment,
        updateArticle,
        userEquipment
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

    // arr to obj, such as { 1 : "超级管理员", 2 : "管理员" }
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name
        return acc
    }, {})

    export default {
        name: 'ComplexTable',
        components: {
            Pagination
        },
        directives: {
            waves
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'info',
                    deleted: 'danger'
                }
                return statusMap[status]
            },
            typeFilter(userRole) {
                return calendarTypeKeyValue[userRole]
            }
        },

        data() {
            return {
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                // 查询条件参数
                listQuery: {
                    page: 1,
                    limit: 10,
                    // importance: undefined,
                    equipmentName: undefined
                    // type: undefined
                },
                importanceOptions: [1, 2, 3],
                calendarTypeOptions,
                sortOptions: [{
                    label: 'ID Ascending',
                    key: '+id'
                }, {
                    label: 'ID Descending',
                    key: '-id'
                }],
                statusOptions: ['published', 'draft', 'deleted'],
                showReviewer: false,
                temp: {
                    sensorId:undefined,
                    sensorDescription:'',
                    sensorType:'',
                    devNo:'',
                    equipmentName:'',
                    warningValue:'',
                    allWarningId:'',
                    nowTimeValue:'',
                    absoluteValue:'',
                    uploadTime:'',
                    sysState:'',
                    createdate:''
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
                    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    userPassWord: [{ required: true, message: '请设定密码', trigger: 'blur' }],
                    userTel: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                    userRole: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
                },
                downloadLoading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                seSensorList(this.listQuery).then(response => {
                    this.list = response.callbackList
                    this.total = response.total
                    // this.total = response.data.total

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 0.7 * 1000)
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleModifyStatus(row, status) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                row.status = status
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
                    sensorId:undefined,
                    sensorDescription:'',
                    sensorType:'',
                    devNo:'',
                    equipmentName:'',
                    warningValue:'',
                    allWarningId:'',
                    nowTimeValue:'',
                    absoluteValue:'',
                    uploadTime:'',
                    sysState:'',
                    createdate:''

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
                        createEquipment(
                            this.temp.organization,
                            this.temp.equipmentName,
                            this.temp.equipmentType,
                            this.temp.equipmentNO,
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
