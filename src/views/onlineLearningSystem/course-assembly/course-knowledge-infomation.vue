<template>
<el-dialog
  class="t-dialog"
  :title="title"
  v-if="visible"
  :visible="visible"
  :close-on-click-modal="false"
  fullscreen
  @close="close"
  append-to-body
  style="overflow:scroll;">
<div class="prevBox">
  <!-- 课程知识点预览-全屏 -->
  <div style="margin-bottom:1rem;">
    <el-button size="small" @click="close">关 闭</el-button>
    <el-button type="success" size="small" icon="el-icon-refresh" @click="refresh">刷 新</el-button>
  </div>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card :style="`height:${height-140}px;overflow:scroll;`">
        <!-- 课程知识点树 -->
        <el-tree :data="resourceTree" ref="tree" node-key="id"  @node-click="haddleOrganizationNode" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18" >
      <el-card :style="`height:${height-140}px;overflow:scroll;`">
        <div slot="header" class="t-box-card-header">
          <div class="title">{{nodeName}}</div>
        </div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="5">
              <div :style="`height:${height-180}px;overflow:scroll;`">
                <div v-for="(item,i) of tableData" :key="i"  @click="fileLearning(item)" class="cardList"              >
                  <el-card :style="`background-color:${colors[item.typecode]?colors[item.typecode]: '#48bdff'}`">
                    <div class="t-type">资源类型：{{item.type}}</div>
                    <div class="t-title">{{item.title}}</div>
                    <div class="t-time">要求学习：{{item.hh}}时{{item.mm}}分{{item.ss}}秒</div>
                  </el-card>
                </div>
              </div>
            </el-col>
            <el-col :span="18">
              <div :style="`height:${height-180}px;overflow:scroll;`">
                <file-preview ref="preview" :fileKey="fileKey"></file-preview>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <div class="t-tbs-fixed">
      <div><el-button type="success" size="medium" @click="toOtherNode(prevId,prevNode)">上一知识点</el-button></div>
      <div><el-button type="success" size="medium" @click="toOtherNode(nextId,nextNode)">下一知识点</el-button></div>
    </div>
  </el-row>
</div>
</el-dialog>
</template>
<script>
import { getCourseCatalogOrderResources } from '@/server/online-module'
import {
  getDictionaryItems,
  getCourseTree,
  getChapterTree,
  getSectionTree,
  getKnowledgeTree
} from '@/server/basic-module'
import orgTree from '@/components/orgTree.vue'
import filePreview from '@/components/filePreview.vue'
export default {
  props: ['visible', 'courseId', 'title'],
  name: 'knowledgeInformation',
  data () {
    return {
      resourceTree: [],
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      parentNode: {},
      resourceId: '',
      resourceDate: {},
      fileKey: '',
      height: 400,
      TreeIds: [], // 树的id集合
      tableData: [], // 资源列表
      colors: ['#f79646', '#8064a2', '#88a44d', '#4bacc6', '#e489e1', '#98a1fd', '#7dd196', '#7bab6b', '#e8c674', '#8097ba', '#9ea987', '#d69f8e'],
      // -------上下级节点id和lable-----
      prevId: null,
      prevLabel: '',
      nextId: null,
      nextLabel: '',
      sublingNodes: [],
      /* -------------- 数据字典- 字典码 -------------- */
      dicJudgeName: {
        ZYLX: 'ZYLX' // 资源类型
      },
      dictionary: []
    }
  },
  components: {orgTree, filePreview},
  activated () {
    this.height = document.documentElement.clientHeight
    /* -------------- 数据字典- 获取数据字典下拉数据 -------------- */
    getDictionaryItems(this.dicJudgeName.ZYLX).then(result => {
      this.dictionary = result
    })
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.courseId) {
          this._getCourseTree()
          sessionStorage.setItem('courseId', this.courseId)
        }
      }
    },
    fileKey (newVal) {
      if (newVal) {
        setTimeout(() => {
          // this.$refs.preview._getPreviewFile()
        }, 1)
      }
    },
    nodeId (newVal) {
      this.sublingNodes.forEach((item, i) => {
        if (newVal === item.id) {
          this.prevId = i === 0 ? null : this.sublingNodes[i - 1].id
          this.prevNode = i === 0 ? null : this.sublingNodes[i - 1]
          this.prevLabel = i === 0 ? null : this.sublingNodes[i - 1].label
          this.nextId = i === this.sublingNodes.length - 1 ? null : this.sublingNodes[i + 1].id
          this.nextNode = i === this.sublingNodes.length - 1 ? null : this.sublingNodes[i + 1]
          this.nextLabel = i === this.sublingNodes.length - 1 ? null : this.sublingNodes[i + 1].label
        }
      })
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span v-show={data.level.split(', ').length > 1 && data.level.split(', ')[1] === 'True'} class="iconfont icon-charulianjie" style="
            font-size:1rem;
            margin-right:0.3rem;
            color:#0a0;"></span>
          <span v-show={data.level.split(', ').length > 1 && data.level.split(', ')[1] === 'False'} class="iconfont icon-quxiaolianjie" style="
            font-size:1rem;
            margin-right:0.3rem;
            color:#bbb;"></span>
          <el-button style="color:#666" type="text" title={node.label} on-click={() => this.getNode(node)}>{node.label}</el-button>
        </span>
      )
    },
    /* ------------------------------- 查询 ------------------------------- */
    _getCourseTree () { // 获取课程树
      this.resourceTree = []
      getCourseTree().then(result => {
        let obj = result.find(item => {
          return item.id === this.courseId
        })
        this.resourceTree.push(obj)
      }).then(() => {
        this.resourceTree.forEach(item => {
          this._getChapterTree(item)
        })
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
    _getCourseCatalogOrderResources () { // 获取 章|节 下绑定的资源
      this.tableData = []
      getCourseCatalogOrderResources(this.nodeId).then(result => {
        console.log('sdsds')
        if (!result) return
        result.items.forEach(item => {
          let typeObj = this.dictionary.find(el => {
            return el.name === item.type
          })
          let obj = {
            resourceId: item.id,
            fileKey: item.fileKey,
            title: item.title,
            type: item.type,
            typecode: typeObj.code,
            hh: Math.floor(item.requiredLearningTime / 3600),
            mm: Math.floor((item.requiredLearningTime / 60 % 60)),
            ss: Math.floor((item.requiredLearningTime % 60))
          }
          this.tableData.push(obj)
        })
      })
    },
    /* ------------------------------- 操作 ------------------------------- */
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeLevel = node.level
      this.nodeId = node.id
      this.nodeName = node.label
      this.tableData = []
      if (node.level === '课程') {
        this._getChapterTree(node) // 获取课程下的章列表树
      } else {
        if (node.level.indexOf('章') !== -1) {
          this._getSectionTree(node) // 获取章下的节列表树
        } else if (node.level.indexOf('节') !== -1) {
          this._getKnowledgeTree(node) // 获取节下的知识点列表树
        } else if (node.level.indexOf('知识点') !== -1) {
          delete (node.children)
        }
        this._getCourseCatalogOrderResources() // 获取知识点下绑定的资源
      }
      this.fileKey = ''
    },
    getNode (node) { // 获取当前节点的兄弟节点
      this.parentNode = node.parent.data
      this.sublingNodes = []
      node.parent.childNodes.forEach(item => {
        this.sublingNodes.push(item.data)
      })
    },
    toOtherNode (nodeId, node) { // 点击切换上下知识点
      if (!nodeId) {
        this.$alert('已经是第一个/最后一个节点了')
        return
      }
      this.nodeId = nodeId
      this.haddleOrganizationNode(node)
      this.$refs.tree.setCurrentKey(nodeId) // 设置新节点被选中
    },
    fileLearning (row) { // 获取资源路径
      this.fileKey = row.fileKey
    },
    refresh () {
      this._getCourseTree()
    },
    close () {
      this.$emit('update:visible', false)
      sessionStorage.removeItem('courseId')
    }
  },
  beforeDestroy () { // 文件销毁前清楚localStorage中的courseId
    sessionStorage.removeItem('courseId')
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog.is-fullscreen{
  max-height:100vh;
}
.title{
  text-align:center;
  font-size:24px;
  // font-weight:600;
}
.cardList{
  margin-bottom:10px;
  /deep/.el-card__body {
    padding:20px 10px;
  }
  .t-type,
  .t-title,
  .t-time{
    color:#000;
    text-align: center;
  }
  .t-title{
    font-weight: 600;
    line-height:1.4;
    margin:0.6rem 0;
    color:#fff;
  }
  .t-time{
    font-size:12px;
  }
}
.prevBox{
  width:100%;height:100%;position: relative;
}
.t-tbs-fixed{
  position: absolute;
  right:10px;
  top:50%;
  div{
    margin-bottom:10px;
  }
}
</style>
