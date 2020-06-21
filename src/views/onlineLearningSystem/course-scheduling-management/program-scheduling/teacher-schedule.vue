<template>
<div>
  <!-- 排课 -->
  <el-card>
    <div slot="header" class="t-box-card-header">
      <span>教师【 {{teacherName}} 】的排课信息</span>
    </div>    
    <!-- 课表 -->
    <div class=" weeks">
      <el-table class="t-table-list"  ref="formTabel" border size="small" :data="cellData" tooltip-effect="dark" style="width: 100%;" v-if="cellData.length>0">
        <el-table-column label="节次/星期" width="106" align="center" prop="jieci"></el-table-column>
        <el-table-column label="星期一" align="center" prop="Monday" v-if="cellData[0].Monday">
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期二" align="center" prop="Tuesday" v-if="cellData[0].Tuesday">   
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期三" align="center" prop="Wednesday" v-if="cellData[0].Wednesday">      
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期四" align="center" prop="Thursday" v-if="cellData[0].Thursday">  
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期五" align="center" prop="Friday" v-if="cellData[0].Friday">         
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期六" align="center" prop="Saturday" v-if="cellData[0].Saturday">   
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="星期日" align="center" prop="Sunday" v-if="cellData[0].Sunday">        
          <template slot-scope="scope">
            <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
            <div v-else>
              <span :class="scope.row[scope.column.property].isSchedule?'green': ''">{{scope.row[scope.column.property].isSchedule}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</div>
</template>
<script>
import { getGradeTree, getDefaultSemester, getTeachCalendar } from '@/server/basic-module'
import { getClassInfoById } from '@/server/training-module'
import {
  getCourseScheduling, 
  LockCourseScheduling
} from '@/server/online-module'
export default {
  props: ['teacherId','cellData','teacherName'],
  data () {
    return {
    }
  },
  components: {},
  activated () { },
  watch: { },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.showCell{
    display:block;
    text-align:center;
    background: #ddd;
}

.noBorder{
  /deep/.el-input__inner{
    border:none;
  }
}
.weeks{
  /deep/.el-table--border th{
    background: #eee;
  }
  /deep/.el-table__body{
    td:first-child{
      background: #eee;
      font-weight: 600;
      color:#303030;
      font-size:0.9rem;
    }

  }
  /deep/.el-table__row--striped{
    td:first-child{
      background: #eee;
      font-weight: 600;
    }
  }
  /deep/.el-table th.is-leaf{
    font-weight: 600;
    font-size:0.9rem;
  }
  /deep/.el-table--border,
  /deep/.el-table--group{
    border: 1px solid #a4bdcc;
  }
  /deep/.el-table--border td,
  /deep/.el-table--border th,
  /deep/.el-table__body-wrapper,
  /deep/.el-table--border.is-scrolling-left~.el-table__fixed {
      border-right: 1px solid #a4bdcc;
  }
  /deep/.el-table td,
  /deep/.el-table th.is-leaf {
      border-bottom: 1px solid #a4bdcc;
  }
  /deep/.el-table--small td,
  /deep/.el-table--small th {
      padding: 0;
  }
  /deep/.el-table .cell{
    line-height:2rem;
    padding: 0;
  }
}
.green{
  display:block;
  text-align:center;
  font-weight: 600;
  background: #029ff7;
  color:#fff;
}
</style>
