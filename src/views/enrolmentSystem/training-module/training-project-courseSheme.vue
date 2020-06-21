<template>
  <el-dialog
    class="t-dialog"
    title="设置培养方案"
    v-if="visible"
    :visible="visible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
  >
    <el-steps :active="active" finish-status="success" align-center>
      <el-step
        title="步骤1"
        :status="chooseValue.length>0?'success': 'process'"
        description="设置项目课程设置项目需要教授的课程"
      ></el-step>
      <el-step title="设置2" description="设置课程培养方案：课程节次，学分等信息"></el-step>
    </el-steps>
    <!-- 设置项目课程 -->
    <div v-if="active==0" class="t-margin-top">
      <transfer-div
        :dataList="courseLists"
        :alias="alias"
        :chooseValue="chooseValue"
        @saveTransfer="getTransferDate"
        :isMultiple="true"
      ></transfer-div>
    </div>
    <!-- 设置课程培养方案 -->
    <div v-else class="t-margin-top">
      <!-- 表格 -->
      <el-table
        class="t-table-list"
        ref="multipleTable"
        stripe
        size="small"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="hour" label="课时" width="130">
          <template slot-scope="scope">
            <div class="input-div">
              <el-input v-model.number="scope.row.hour" type="number" size="mini" min="0">
                <el-button slot="append">节</el-button>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creditHour" label="学分" width="130">
          <template slot-scope="scope">
            <div class="input-div">
              <el-input v-model.number="scope.row.creditHour" type="number" size="mini" min="0">
                <el-button slot="append">分</el-button>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="passScore" label="及格分数比" width="130">
          <template slot-scope="scope">
            <div class="input-div">
              <el-input
                v-model.number="scope.row.passScore"
                type="number"
                size="mini"
                min="0"
                max="100"
              >
                <el-button slot="append">%</el-button>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
      <div class="t-text-right t-margin-top">
        <el-button type="primary" size="small" @click="save">保 存</el-button>
      </div>
    </div>
    <!-- 操作按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">关 闭</el-button>
      <el-button size="small" @click="next(1)" v-if="active==0">下一步</el-button>
      <el-button size="small" @click="next(0)" v-else>上一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCourseList, getCourseComBox } from "@/server/basic-module"
import {
  setTrainingProgramsCourseScheme,
  getTrainingProgramsCourseSchemeInfo,
  getTrainingProgramsBindCourse,
  updateTrainingProgramsCourse
} from '@/server/training-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import transferDiv from '@/components/transfer-div'
export default {
  props: ['TrainingProgramsId', 'visible'],
  components: { pagination, transferDiv },
  data () {
    return {
      rules: {
        hour: [{ required: true, message: '请输入课时', trigger: 'blur' }],
        creditHour: [
          { required: true, message: '请输入学分', trigger: 'blur' }
        ],
        passScore: [
          { required: true, message: '请输入及格分数', trigger: 'blur' }
        ]
      },
      tableData: [],
      /* -------------------分页组件数据------------------- */
      pageSize,
      SkipCount: 0,
      total: 0,
      /* ------------------- 步骤条 ------------------- */
      active: 0,
      /* ------------------- 步骤条-设置项目课程 ------------------- */
      courseLists: [], // 课程列表
      alias: { key: 'id', label: 'name' },
      chooseValue: [], // 项目已绑定的课程集合
      renderFunc (h, option) {
        return <span>{ option.id } - { option.label }</span>;
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.active = 0
        this._getCourseComBox()
        if (this.TrainingProgramsId) {
          this._getTrainingProgramsBindCourse(this.TrainingProgramsId)
          this._getTrainingProgramsCourseSchemeInfo()
        }
      }
    },
    tableData: {
      handler (newVal) {
        if (newVal) {
          newVal.forEach(item => {
            if (item.hour < 0) {
              this.$set(item, 'hour', 0)
            }
            if (item.creditHour < 0) {
              this.$set(item, 'creditHour', 0)
            }
            if (item.passScore < 0) {
              this.$set(item, 'passScore', 0)
            }
            if (item.passScore > 100) {
              this.$set(item, 'passScore', 100)
            }
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /* ----------------------------------------------------右侧表格------------------------------------------- */
    // _getCourseList () { // 获取所有的课程列表
    //   this.courseLists = []
    //   getCourseList({MaxResultCount: 200}).then(result => {
    //     this.courseLists = result.items
    //     this.courseLists.forEach(item => {
    //       item.name = `${item.name}（${item.testingWay}）`
    //     })
    //   })
    // },
    // 获取所有的课程列表
    _getCourseComBox (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
        // name: this.TrainingProgramsId
      }
      this.courseLists = []
      getCourseComBox(data).then(result => {
        this.courseLists = result.items
        this.courseLists.forEach(item => {
          item.name = `${item.name}（${item.testingWay}）`
        })
      })
    },
    _getTrainingProgramsBindCourse (val) {
      // 获取项目绑定的课程列表
      getTrainingProgramsBindCourse(val).then(result => {
        this.chooseValue = []
        for (var item of result) {
          this.chooseValue.push(item.id)
        }
      })
    },
    /* 接收改变后每页多少条 */
    handleCourseSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getCourseComBox(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCourseCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getCourseComBox(SkipCount, pageSize)
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getTrainingProgramsCourseSchemeInfo(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this._getTrainingProgramsCourseSchemeInfo(SkipCount, pageSize)
    },
    queryList () {
      this._getTrainingProgramsCourseSchemeInfo(this.SkipCount, this.pageSize)
    },
    // 获取学习项目的课程培养方案
    _getTrainingProgramsCourseSchemeInfo (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        TrainingProgramsId: this.TrainingProgramsId
      }
      getTrainingProgramsCourseSchemeInfo(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
        if (this.total && this.total > 0) {
          this.active = 1
        }
      })
    },
    /* -----------------------------------------------操作---------------------------------------------- */
    next (num) {
      if (this.chooseValue.length === 0) {
        this.$alert('请先设置课程！')
        this.active = 0
        return
      }
      this.active = num
      if (this.active === 0) {
        this._getTrainingProgramsBindCourse(this.TrainingProgramsId)
      } else if (this.active === 1) {
        this._getTrainingProgramsCourseSchemeInfo()
      }
    },
    getTransferDate (data) {
      // 绑定课程
      updateTrainingProgramsCourse(this.TrainingProgramsId, data)
        .then(() => {
          this.$message.success('设置成功')
          this._getTrainingProgramsBindCourse(this.TrainingProgramsId)
          this._getTrainingProgramsCourseSchemeInfo()
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    save () {
      // 保存培养方案
      let data = this.tableData
      for (let i = 0; i < data.length; i++) {
        if (data[i].hour <= 0) {
          this.$alert(`课程【${data[i].courseName}】的 课时 必须是大于0的数字`)
          return
        }
        if (data[i].passScore <= 0) {
          this.$alert(
            `课程【${data[i].courseName}】的 及格学分 必须是大于0的数字`
          )
          return
        }
        if (data[i].creditHour < 0) {
          this.$alert(
            `课程【${data[i].courseName}】的 学分 必须是不得小于0的数字`
          )
          return
        }
      }
      setTrainingProgramsCourseScheme(this.TrainingProgramsId, this.tableData)
        .then(() => {
          this.$message.success('保存成功！')
          this.active = 2
          this.close()
          this.$emit('queryList')
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
.input-div {
  min-width: 100px;
  /deep/.el-input__inner {
    padding: 0 7px;
  }
  /deep/.el-button {
    padding: 12px 7px;
  }
}
</style>
