<template>
<el-dialog class="t-dialog" v-if="visible" :visible="visible" :close-on-click-modal="false" append-to-body @close="close" title="设置毕业要求证书" width="800px">
  <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
    <el-form-item label="证书名称">
      <el-select
        v-model="conditionForm.id"
        filterable
        remote
        reserve-keyword
        placeholder="可输入证书名称过滤"
        :remote-method="initDataList"
        :loading="loading">
        <el-option v-for="item in dataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="add">添加到下方</el-button>
    </el-form-item>
  </el-form>
  <el-divider content-position="left">已选择的证书类型</el-divider>
  <div>
    <span v-for="(item,i) of chooseLists" :key="i">
      <el-tag class="t-margin-bottom t-margin-right" closable :disable-transitions="false" @close="handleClose(item)">{{item.name}}</el-tag>
    </span>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
</el-dialog>
</template>
<script>
import {
  addRequiredCertificateToTrainingPrograms,
  getProgramRequiredCertificateTypes
} from '@/server/training-module'
import { getGraduationRequiredCertificateTypePullDown } from '@/server/graduation-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      dataList: [],
      chooseIds: [],
      chooseLists: [],
      conditionForm: {},
      loading: false,
      props: { multiple: true, value: 'id', label: 'name' }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.initDataList()
        if (this.dataForm.id) {
          this._getProgramRequiredCertificateTypes()
        }
      }
    }
  },
  methods: {
    /* *************************** 查询 *************************** */
    // 获取所有的毕业证书类型
    initDataList (query) {
      let filter = query ? query : ''
      let data = {
        filter: filter
      }
      getGraduationRequiredCertificateTypePullDown(data).then(result => {
        this.dataList = result
      })
    },
    // 获取培训项目绑定的毕业要求证书类型
    _getProgramRequiredCertificateTypes () {
      this.chooseIds = []
      this.chooseLists = []
      getProgramRequiredCertificateTypes(this.dataForm.id).then(res => {
        res.forEach(item => {
          this.chooseIds.push(item.id)
          this.chooseLists.push(item)
        })
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* *************************** 操作 *************************** */
    // 删除已选择的证书
    handleClose (item) {
      this.chooseLists.splice(item, 1)
      this.chooseIds.splice(item.id, 1)
    },
    // 添加
    add () {
      // 查询已选择数据中是否有该元素
      let findObj = this.chooseLists.find(item => {
        return item.id === this.conditionForm.id
      })
      // 从原有数组中查询到该元素的信息
      let obj = this.dataList.find(item => {
        return item.id === this.conditionForm.id
      })
      // 如果数组中没有该元素，则新增到下方显示
      if (!findObj) {
        this.chooseLists.push(obj)
        this.chooseIds.push(obj.id)
      } else {
        this.$message.warning('该证书已添加到下方的列表中')
      }
    },
    // 保存
    save () {
      addRequiredCertificateToTrainingPrograms(this.dataForm.id, this.chooseIds)
        .then(() => {
          this.$message.success('毕业要求证书类型设置成功！')
          // this.queryList()
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      this.close()
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
