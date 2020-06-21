<template>
<el-dialog :append-to-body="true" class="t-dialog" title="添加用户" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">
  <el-tag type="danger" style="padding:0 30px;color:#fff;background:#ff3f05;font-size:14px;margin-bottom:10px;">班主任老师有且只能有一位！</el-tag>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </span>
  <el-row :gutter="10">
    <el-col :span="6">
      <!-- 树 -->
      <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>   
    </el-col>
    <el-col :span="18">
      <!-- 引入模态框类型的穿梭框组件:title-标题，dataList-所有角色，chooseValue-已分配的角色，alias-穿梭框匹配的id和那么，saveTransfer-保存已选择的数据,isMultiple-是否多选 false-单选 true-多选 -->
      <transfer-div :title="title" :dataList="transferData" :alias="alias" :chooseValue="chooseValue" @saveTransfer="getTransferDate" :isMultiple="isMultiple"></transfer-div>
    </el-col>
  </el-row>
</el-dialog>
</template>
<script>
import { getUserListByAttach} from '@/server/identity-module'
import orgTree from '@/components/orgTree'
import transferDiv from "@/components/transfer-div.vue"
export default {
  props: ['dataForm', 'visible','TreeData'],
  data () {
    return {
      form: {},
      // ---------树节点数据
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      userType: 'Faculty', // 用于判断用户类型是企业还是学校。默认学校用户
      /* -------------------穿梭框传递数据------------------- */
      title: '',
      transferData: [],
      alias: {key: 'id',label: 'name'},
      chooseValue: [], // 穿梭框默认选中列表，由alias.key组成的数组
      transferString: '',
      itemId: '',
      newTransferData: [],
      nameList: [],
      isMultiple:false, // 是否多选，false-单选，true-多选
    }
  },
  components: {orgTree,transferDiv},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm);
      }
    },
  },
  methods: {
		/* -------------------穿梭框------------------- */
		showTransfer(data) {
			this.itemId=data.id;
			this._getTrainingProgramsBindCourse(this.itemId);
		},
    getTransferDate(data) { // 获得穿梭框的数据,保存起来
      this.newTransferData=data;
      this.nameList= []
      this.transferData.forEach((item,i) => {        
        data.find((val) => {
          if (item.id==val) {
            this.nameList.push(item.name)
          }
        })
      })
      
		},   
    initDataList() { // 获取学生列表，传递数据给穿梭框
      this.transferData= []
      let data={
        id: this.nodeId,
        type: this.userType
      }
      getUserListByAttach(data).then(result => {
        this.transferData=result;
      })
		},
		_getTrainingProgramsBindCourse(val) { // 获取已分配的数据，传递给穿梭框为默认选中值
			// getTrainingProgramsBindCourse(val).then(result => {
			// 	this.chooseValue= []
			// 	for(var item of result) {
			// 		this.chooseValue.push(item.id)
			// 	}
			// })
		},
		/* ------------------------------------------------- */
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      this.$emit('save', this.newTransferData,this.nameList);
      this.close()
    },
    /*选择的树节点*/
    haddleOrganizationNode (node) {
      this.nodeSelect=node;
      this.nodeId = node.id
      this.nodeName=node.label;        
      this.nodeLevel = node.level        
      if (this.nodeSelect.level=='企业') {   
        this.userType='EnterpriseUser';
      }
      this.initDataList()
    },
    
  }
}
</script>
