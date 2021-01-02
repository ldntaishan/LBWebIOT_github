<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        导出-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">

      <el-table-column label="角色" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userRole | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.userTel }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column label="登录密钥" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userPassWord }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userEmail }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="系统状态" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.userState" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <el-button type="primary" style="margin-right: 10px" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button v-if="row.userState!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button> -->
          <!-- <el-button v-if="row.userState!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-popconfirm title="确定删除吗？" @onConfirm="handleDelete(row,$index)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" placeholder="Please pick a date" />
        </el-form-item>

        <el-form-item label="密码" prop="userPassWord">
          <el-input v-model="temp.userPassWord" />
        </el-form-item>

        <el-form-item label="手机" prop="userTel">
          <el-input v-model="temp.userTel" />
        </el-form-item>

        <el-form-item label="昵称" prop="userNickName">
          <el-input v-model="temp.userNickName" />
        </el-form-item>

        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="temp.userEmail" />
        </el-form-item>

        <el-form-item label="角色" prop="userRole">
          <el-select v-model="temp.userRole" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->

        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <!-- <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
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

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelete">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import {
  seAllUserList,
  createUser,
  updateArticle,
  userDeleteObj
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

// arr to obj, such as { CN : "China", US : "USA" }
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
        userName: undefined
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
        userId: undefined,
        userName: '',
        userNickName: '',
        userEmail: '',
        userTel: '',
        userRole: '',
        userPassWord: '',
        createdate: '',
        userState: ''

        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // userName: '',
        // type: '',
        // status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      centerDialogVisible: false,
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
      seAllUserList(this.listQuery).then(response => {
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
        userId: undefined,
        userName: '',
        userNickName: '',
        userEmail: '',
        userTel: '',
        userRole: '',
        userPassWord: '',
        createdate: '',
        userState: ''
        // userState: ''

        // id: undefined,
        // importance: 1,
        // remark: '',
        // timestamp: new Date(),
        // title: '',
        // status: 'published',
        // type: ''
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
          createUser(
            this.temp.userName,
            this.temp.userNickName,
            this.temp.userEmail,
            this.temp.userTel,
            this.temp.userRole,
            this.temp.userPassWord
          ).then(response => {
            this.list.unshift(this.temp)
            this.updateTotal(1)
            this.dialogFormVisible = false
            Message({
              message: response.RequestMessage,
              type: 'success',
              duration: 5 * 1000
            })
            // this.$notify({
            //   title: 'Success',
            //   message: response.RequestMessage,
            //   type: 'success',
            //   duration: 2000
            // })
            // this.getList()
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

      userDeleteObj(this.temp.userId).then(() => {
        this.list.splice(index, 1)
        this.updateTotal(-1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      // this.centerDialogVisible = true
      // this.centerDialogVisible = false
    },
    doDelete() {

      // this.getList()
    },
    updateTotal(change) {
      // const oldPage=Math.ceil(this.total/this.listQuery.limit)
      this.total = this.total + change
      const newPage = Math.ceil(this.total / this.listQuery.limit)
      if (this.listQuery.page > newPage) {
        this.listQuery.page = newPage
        this.getList()
      }
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
