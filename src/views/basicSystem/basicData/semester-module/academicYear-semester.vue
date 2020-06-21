<template>
<div>
<el-row :gutter="10">
  <el-col :span="9">
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>学年信息</span>
        <el-tag type="danger" style="margin-left:20px;color:#f00;">提示：如果已有课表，请勿修改学年学期起始时间！</el-tag>
      </div>
      <academicYear-list @chooseRowDate="academicYearDate"></academicYear-list>
    </el-card>
  </el-col>
  <el-col :span="15">
    <el-card v-show="AcademicYearId" :style="style">     
      <div slot="header" class="t-box-card-header">
        <span>学期信息</span>
        <el-tag type="danger" style="margin-left:20px;color:#f00;">提示：如果已有课表，请勿修改学年学期起始时间！</el-tag>
      </div>
      <semester-List :AcademicYearId="AcademicYearId" :academicYearName="academicYearName" :academicYearBeginTime="academicYearBeginTime" :academicYearEndTime="academicYearEndTime"></semester-List>
    </el-card>
  </el-col>
</el-row>
</div>
</template>
<script>
import { getAcademicYearList, getSemesterList} from '@/server/basic-module'
import semesterList from './semester-list'
import academicYearList from './academicYear-list'
export default {
  name: 'academicYearSemester',
  data() {
    return {
      activeName: 'first',
      style: '',
      AcademicYearId: '', // 学年id，用于查询对应的学期信息
      academicYearName: '',
      academicYearBeginTime: '',  // 学年开始时间
      academicYearEndTime: '',  // 学年结束时间
      schoolYearData: [],
    }
  },
  components: {academicYearList,semesterList},
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    getAcademicYearList().then(result => {
      this.schoolYearData= result.items
    }).then(() => {
      if (this.schoolYearData.length!=0) {
        this.academicYearDate()
      }
    })
  },
  methods: {
    academicYearDate(data) {
      if (data) {
        this.AcademicYearId=data.id;
        this.academicYearName=data.academicYearName;
        this.academicYearBeginTime=data.academicYearBeginTime;
        this.academicYearEndTime=data.academicYearEndTime;
      }
    },
  }
}
</script>
<style lang="less" scoped>

</style>
