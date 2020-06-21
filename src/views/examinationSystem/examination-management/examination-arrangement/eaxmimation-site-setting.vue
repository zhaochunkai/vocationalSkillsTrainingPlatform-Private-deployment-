<template>
<el-dialog class="t-dialog" v-if="visible" :visible="visible" title="考场设置" :close-on-click-modal="false" append-to-body width="70%" @close="close" >
  <!-- 考场设置 -->
  <div class="t-header-title">
    <span style="background:#c6e3f7;">所属课程：{{dataForm.courseName}}</span>
  </div>
  <el-form class="t-form-block" ref="form" :model="form" :inline="true" label-width="70px" size="small">
    <el-form-item label="考试场地" prop="examinationPlaceId">
      <el-select v-model="form.examinationPlaceId" filterable placeholder="请选择考场"
        remote
        :remote-method="_getSiteDropdown"
        reserve-keyword
      >
        <el-option v-for="(item,i) of siteDropdown" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="warning" size="small" @click="add">添加到表格中</el-button>
    </el-form-item>
    <el-form-item>
      <el-tag type="danger" style="color:#f00;font-weight:600;">请在选择【考试场地】后，对每个考场设置相应的【监考老师】</el-tag>
    </el-form-item>
  </el-form>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
    <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="examinationPlaceName" label="考试场地" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="teacherNames" label="监考老师"></el-table-column>
    <el-table-column prop="numberOfPeople" sortable label="考试人数" width="150" align="center">
      <template slot-scope="scope">
        <div class="input-div">
          <el-input class="input-append" size="mini" min="0" max="200" v-model.number="scope.row.numberOfPeople" type="number">
            <el-button slot="append" size="small">人</el-button>
          </el-input>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="remark" sortable label="备注" width="300" align="center">
      <template slot-scope="scope">
        <el-input class="input-append" v-model="scope.row.remark" size="mini" type="textarea" :autosize="{ minRows: 1, maxRows: 3}"></el-input>
      </template>
    </el-table-column>
    <el-table-column  fixed="right" label="操作" width="220" align="center">
      <template slot-scope="scope">
        <el-button @click.native.prevent="chooseTeacher(scope.row)" type="success" size="small" style="background-color: #40bb04;">设置监考老师</el-button>
        <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">从列表中移除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保存</el-button>
  </div>
  <!-- 选取监考老师 -->
  <tree-transfer :visible.sync="showTeachers" TreeType="user" :title="'当前教室：'+form.examinationPlaceName" :alias="alias" :chooseValue="chooseValue" isMultiple="true" @saveTransfer="getNewTransfer"></tree-transfer>
</el-dialog>
</template>
<script>
import treeTransfer from '@/components/tree-transfer-dialog.vue'
import { getSiteDropdown } from '@/server/basic-module'
import { getIdentityUserList } from '@/server/identity-module'
import { pageSize } from '@/config.js'
export default {
  components: { treeTransfer },
  props: ['dataList', 'visible', 'dataForm'],
  data () {
    return {
      pageSize,
      // ----选取监考老师
      siteId: '', // 教室id
      userLists: [],
      showTeachers: false,
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      transferData: [],
      chooseValue: [],
      title: '选取课程',
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() > _now
        }
      },
      // ------考场选取
      siteDropdown: [],
      form: {},
      teacherNames: '', // 监考老师
      // ------考场安排列表
      tableData: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._getSiteDropdown()
        this._getIdentityUserList()
        this.tableData = this.dataForm.examinationPlaceConfig
      }
    },
    'form.examinationPlaceId' (newVal) {
      if (newVal) {
        let obj = this.siteDropdown.find(item => {
          return item.id === newVal
        })
        this.$set(this.form, 'numberOfPeople', obj.capacity)
        this.$set(this.form, 'examinationPlaceName', obj.name)
      }
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------
    _getIdentityUserList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        // MaxResultCount: pageSize,
        MaxResultCount: 200
      }
      getIdentityUserList(data).then(result => {
        this.userLists = result.items
      })
    },
    _getSiteDropdown (query) {
      const data = {
        filter: query
      }
      getSiteDropdown(data).then(result => {
        this.siteDropdown = result
        if (Array.isArray(result)) {
          this.$set(this.form, 'examinationPlaceId', result[0].id)
        }
      })
    },
    // -----------------------------------------操作-----------------------------------
    chooseTeacher (row) { // 选取老师
      this.siteId = row.examinationPlaceId
      this.chooseValue = []
      if (row.teacherIds) {
        row.teacherIds.forEach(item => {
          this.chooseValue.push(item.teacherId)
        })
      }
      this.showTeachers = true
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      for (let i = 0; i < this.tableData.length; i++) {
        let obj = this.tableData[i]
        if (obj.numberOfPeople < 0) {
          this.$alert('请考场人数不能是小于0的数字！')
          return
        }
      }
      this.$emit('save', this.tableData, this.dataForm.courseId)
      this.close()
    },
    add () { // 添加数据到表格中
      if (!this.form.examinationPlaceId) {
        this.$alert('请选择考试场地')
        return
      }
      let obj = false
      if (this.tableData) {
        obj = this.tableData.find(item => {
          return item.examinationPlaceId === this.form.examinationPlaceId
        })
      } else {
        this.tableData = []
      }
      if (!obj) {
        this.tableData.push(JSON.parse(JSON.stringify(this.form)))
      }
    },
    getNewTransfer (ids, name) { // 获得监考老师的数据
      let teacherIds = []
      let teacherStr = ''
      this.userLists.forEach(item => {
        if (ids.indexOf(item.id) !== -1) {
          teacherStr += item.name + '（' + name + '） '
          let obj = {
            teacherId: item.id
          }
          teacherIds.push(obj)
        }
      })
      this.tableData.forEach(item => {
        if (item.examinationPlaceId === this.siteId) {
          this.$set(item, 'teacherNames', teacherStr)
          this.$set(item, 'teacherIds', teacherIds)
        }
      })
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.input-div{
  min-width:100px;
  /deep/.el-input__inner{
    padding:0 7px;
  }
  /deep/.el-button{
    padding:12px 7px;
  }
}
</style>
