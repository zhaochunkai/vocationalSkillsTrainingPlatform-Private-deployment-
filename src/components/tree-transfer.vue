<template>
<div>
  <div class="t-header-title" v-show="title">
    <span>{{title}}</span>
  </div>
  <el-row :gutter="20">
    <el-col style="margin-bottom:20px;" :offset="6">
      <el-tag v-if="!isMultiple" type="danger" style="padding:0 30px;color:#fff;background:#ff3f05;font-size:14px;">注意：只能选择一条数据！</el-tag>
      <el-tag v-else type="danger" style="padding:0 30px;color:#fff;background:#ff3f05;font-size:14px;">注意：支持多选！</el-tag>
    </el-col>
    <el-col :span="6">
      <!-- 树 -->
      <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>
    </el-col>
    <el-col :span="18">
      <!-- 引入模态框类型的穿梭框组件:title-标题，dataList-所有角色，chooseValue-已分配的角色，alias-穿梭框匹配的id和那么，saveTransfer-保存已选择的数据,isMultiple-是否多选 false-单选 true-多选 -->
      <!-- <transfer-div :title="title" :dataList="transferData" :alias="alias" :chooseValue="chooseValue" @saveTransfer="getTransferDate" :isMultiple="isMultiple"></transfer-div> -->
      <el-transfer  :title="title" filterable :filter-method="filterMethod" filter-placeholder="请输入名称检索" v-model="value" :data="transferData" :props="alias" :titles="['未分配', '已分配']" @change="changeMethod"></el-transfer>
    </el-col>
  </el-row>
</div>

</template>
<script>
import {
  getSchoolTree, getGradeTree, getWarehouseTree, getTrainingProgramsTree, getBuildingTree,
  getCourseTree, getChapterTree, getSectionTree, getKnowledgeTree, getSiteListByBuilding
} from '@/server/basic-module'
import { getCourseCatalogList } from '@/server/online-module'
import { getUserListByAttach } from '@/server/identity-module'
import orgTree from '@/components/orgTree'
import transferDiv from '@/components/transfer-div.vue'
export default {
  data () {
    return {
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      userType: 'Faculty', // 用于判断用户类型是企业还是学校。默认学校用户
      nameList: [],
      newTransferData: [],
      // courseId: '-1',
      TreeData: [], // 树结构数据
      transferData: [],
      value: [],
      filterMethod (query, item) {
        if (item.title) {
          item.name = item.title
        }
        return item.name.indexOf(query) > -1
      },
      courseCatalogLevel: null // 章-1，节-2，知识点-3
    }
  },
  props: ['chooseValue', 'title', 'alias', 'isMultiple', 'TreeType', 'courseId'],
  components: {orgTree, transferDiv},
  watch: {
    chooseValue (newVal) { // 将父组件的数据当做默认值赋值给已分配列表
      this.value = newVal
    },
    TreeType (newVal) {
      /* 树+穿梭框。根据 TreeType 判断需要什么树形结构:
        resource-资源树,    user-用户树（学校+企业）,
        programs-项目树,    Knowledge-知识点树,
        grade-班级树,       place-教室
      */
      if (newVal) {
        if (newVal === 'user') {
          this._getTeachTreeData()
        } else if (newVal === 'resource') {
          this._getWarehouseTree()
        } else if (newVal === 'programs') {
          this._getTrainingProgramsTree()
        } else if (newVal === 'Knowledge') {
          if (this.courseId) {
            this._getCourseTree()
          }
        } else if (newVal === 'grade') {
          this._getGradeTree()
        } else if (newVal === 'place') {
          this._getBuildingTree()
        }
      }
    },
    courseId (newVal) {
      if (newVal) {
        this._getCourseTree()
      }
    }
  },
  // created () {
  //   if (this.TreeType === 'user') {
  //     this._getTeachTreeData()
  //     return
  //   } else if (this.TreeType === 'resource') {
  //     this._getWarehouseTree()
  //     return
  //   } else if (this.TreeType === 'programs') {
  //     this._getTrainingProgramsTree()
  //     return
  //   } else if (this.TreeType === 'Knowledge') {
  //     if (this.courseId) {
  //       this._getCourseTree()
  //     }
  //     return
  //   } else if (this.TreeType === 'grade') {
  //     this._getGradeTree()
  //     return
  //   } else if (this.TreeType === 'place') {
  //     this._getBuildingTree()
  //     return
  //   }
  // },
  activated () {
    if (this.TreeType === 'user') {
      this._getTeachTreeData()
    } else if (this.TreeType === 'resource') {
      this._getWarehouseTree()
    } else if (this.TreeType === 'programs') {
      this._getTrainingProgramsTree()
    } else if (this.TreeType === 'Knowledge') {
      if (this.courseId) {
        this._getCourseTree()
      }
    } else if (this.TreeType === 'grade') {
      this._getGradeTree()
    } else if (this.TreeType === 'place') {
      this._getBuildingTree()
    }
  },
  methods: {
    /* ------------------------------------------------------------左侧树结构数据-------------------------- */
    _getCourseTree () { // 获取课程树
      this.TreeData = []
      getCourseTree().then(result => {
        let obj = result.find(item => {
          return item.id === this.courseId
        })
        this.TreeData.push(obj)
        this._getChapterTree(obj)
      })
    },
    _getChapterTree (node) { // 获取 章列表 树
      let data = {
        courseId: node.id
      }
      getChapterTree(data).then(result => {
        node.children = result
      })
    },
    _getSectionTree (node) { // 获取 节列表 树
      let data = {
        chapterId: node.id
      }
      getSectionTree(data).then(result => {
        node.children = result
      })
    },
    _getKnowledgeTree (node) { // 获取 知识点列表 树
      let data = {
        sectionId: node.id
      }
      getKnowledgeTree(data).then(result => {
        node.children = result
      })
    },
    _getTeachTreeData () { // ----------------用户树（学校+企业）
      this.TreeData = []
      getSchoolTree().then(result => {
        this.TreeData.push(result)
      })
    },
    _getGradeTree () { // --------------------班级树
      this.TreeData = []
      getGradeTree().then(result => {
        this.TreeData.push(result)
      })
    },
    _getWarehouseTree () { // ----------------资源库树
      this.TreeData = []
      getWarehouseTree().then(result => {
        this.TreeData.push(result)
      })
    },
    _getTrainingProgramsTree () { // ----------------学习项目树
      this.TreeData = []
      getTrainingProgramsTree().then(result => {
        this.TreeData.push(result)
      })
    },
    _getBuildingTree () { // ------------------------楼栋教室树
      this.TreeData = []
      getBuildingTree().then(result => {
        this.TreeData.push(result)
      })
    },
    /* ------------------------------------------------------------右侧数据列表--初始化-------------------------- */
    usersDataList () { // ----------------获取用户列表，传递数据给穿梭框
      this.transferData = []
      let data = {
        id: this.nodeId,
        type: this.userType
      }
      getUserListByAttach(data).then(result => {
        this.transferData = result
      })
    },
    placeDataList () { // ----------------获取教室列表，传递数据给穿梭框
      this.transferData = []
      getSiteListByBuilding(this.nodeId).then(result => {
        this.transferData = result
        this.transferData.forEach(item => {
          item.name = `${item.name}（${item.storey}楼）`
        })
      })
    },
    _getCourseCatalogList (SkipCount = 0, pageSize = this.pageSize) { // ---获取章/节列表列表，传递数据给穿梭框
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ParentId: this.nodeId,
        courseId: this.courseId, // 课程id
        CourseCatalogLevel: this.courseCatalogLevel // 节点类型
      }
      this.transferData = []
      getCourseCatalogList(data).then(result => {
        this.transferData = result.items
        this.transferData.forEach(item => {
          item.name = item.title
          item.idLevel = item.id + '|chapter'
        })
      })
    },
    /* -------------------------------------------------------------右侧数据列表--默认值--------------------------- */
    // _getTrainingProgramsBindCourse (val) { // 获取已分配的数据，传递给穿梭框为默认选中值
    //   getTrainingProgramsBindCourse(val).then(result => {
    //     this.chooseValue = []
    //     for (var item of result) {
    //       this.chooseValue.push(item.id)
    //     }
    //   })
    // },
    /* ----------------------------------------------------------树节点选择--------------------------------- */
    haddleOrganizationNode (node) { /* 选择的树节点。根据树的不同，加载不同的数据 */
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (this.TreeType === 'user') {
        if (this.nodeLevel === '企业') {
          this.userType = 'EnterpriseUser'
        } else {
          this.userType = 'Faculty'
        }
        if (node.level != null) {
          this.usersDataList()
        }
      // } else if (this.TreeType === 'resource') {
      // } else if (this.TreeType === 'programs') {
      } else if (this.TreeType === 'Knowledge') {        
        if (this.nodeLevel === '课程') {
          this._getChapterTree(node) // 获取课程下的章列表树
          this.courseCatalogLevel = 'Chapter'
        } else if (this.nodeLevel.indexOf('章') !== -1) {
          this._getSectionTree(node) // 获取章下的节列表树
          this.courseCatalogLevel = 'Section'
        } else if (this.nodeLevel.indexOf('节') !== -1) {
          this.courseCatalogLevel = 'KnowledgePoint'
        }
        this._getCourseCatalogList()
      // } else if (this.TreeType === 'grade') {
      } else if (this.TreeType === 'place') {
        if (node.level === '楼栋') {
          this.placeDataList()
        }
      }
    },
    changeMethod (item) { // 跟踪穿梭框数据变化
      if (!this.isMultiple) {
        if (item.length > 1) {
          this.$alert('能且只能选择一项数据！数据已清空，请重新选择！')
          this.value = []
          return
        }
      }
      this.$emit('saveTransfer', this.value)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-transfer {
  max-width: 90%;
  margin-bottom: 20px;
}
/deep/.el-transfer__buttons{
  padding:0 10px;
}
.t-header-title{
  font-size: 14px;
}
</style>
