import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

export default new Router({
  mode: 'history', // 去除哈希值的#号
  routes: [
    { path: '/', name: 'login', component: _import('common/login') },
    // { path: '/blank', name: 'blankPage', component: _import('common/blank') },
    { path: '/container',
      component: _import('common/container'),
      children: [

        /* -----------------------------基础数据平台----------------------------- */
        { path: '/', redirect: '/data/list/item' },
        // 数据字典
        { path: '/test_2',
          name: 'test_2',
          component: _import('demo/test_2'),
          meta: {title: ['基础平台', '数据字典', '测试文件上传']}
        },
        { path: '/data/list/item',
          name: 'data-list-item',
          component: _import('basicSystem/dataDictionary/data-list-item'),
          meta: {title: ['基础平台', '数据字典', '数据字典管理']}
        },
        // 基础数据-学校信息
        { path: '/school/list',
          name: 'school-list',
          component: _import('basicSystem/basicData/school-module/school-list'),
          meta: {title: ['基础平台', '基础数据', '学校信息']}
        }, // 专基础数据-业信息
        { path: '/profession/list',
          name: 'profession-list',
          component: _import('basicSystem/basicData/profession-module/profession-list'),
          meta: {title: ['基础平台', '基础数据', '专业信息']}
        }, // 基础数据-学年学期
        { path: '/academicYear/semester',
          name: 'academicYear-semester',
          component: _import('basicSystem/basicData/semester-module/academicYear-semester'),
          meta: {title: ['基础平台', '基础数据', '学年学期']}
        }, // 基础数据-课程信息
        { path: '/course/list',
          name: 'course-list',
          component: _import('basicSystem/basicData/course-module/course-list'),
          meta: {title: ['基础平台', '基础数据', '课程信息']}
        }, // 基础数据-楼栋信息
        { path: '/building/list',
          name: 'building-list',
          component: _import('basicSystem/basicData/building-module/building-list'),
          meta: {title: ['基础平台', '基础数据', '楼栋信息']}
        }, // 基础数据-教室管理
        { path: '/site/list',
          name: 'site-list',
          component: _import('basicSystem/basicData/site-module/site-list'),
          meta: {title: ['基础平台', '基础数据', '教室管理']}
        },
        { path: '/site/list/edit',
          name: 'site-list-edit',
          component: _import('basicSystem/basicData/site-module/site-list-add'),
          meta: {title: ['基础平台', '基础数据', '新增教室管理']}
        },
        { path: '/certificate/type/list',
          name: 'graduation-certificate-type-list',
          component: _import('basicSystem/basicData/graduation-certificate-type-module/graduation-certificate-type-list'),
          meta: {title: ['基础平台', '基础数据', '毕业要求证书类型']}
        },
        // 统一身份管理
        { path: '/user/list',
          name: 'user-list',
          component: _import('basicSystem/identity-module/user-module/user-list'),
          meta: {title: ['基础平台', '统一身份管理', '用户管理']}
        },
        { path: '/role/list',
          name: 'role-list',
          component: _import('basicSystem/identity-module/role-module/role-list'),
          meta: {title: ['基础平台', '统一身份管理', '角色管理']}
        },
        { path: '/role/list/permission',
          name: 'role-list/permission',
          component: _import('basicSystem/identity-module/role-module/role-list-permission'),
          meta: {title: ['基础平台', '统一身份管理', '角色权限设置']}
        },
        // 排课设置
        { path: '/daily/schedule',
          name: 'daily-schedule',
          component: _import('basicSystem/courseArrangement/daily-schedule'),
          meta: {title: ['基础平台', '排课设置', '作息时间']}
        },
        { path: '/teaching/schedule',
          name: 'teaching-schedule',
          component: _import('basicSystem/courseArrangement/teaching-schedule'),
          meta: {title: ['基础平台', '排课设置', '教学日程']}
        },
        // 资源库设置
        { path: '/resource/globalsetting',
          name: 'resource-globalsetting',
          component: _import('basicSystem/resource-module/global-setting'),
          meta: {title: ['基础平台', '资源库设置', '全局设置']}
        },
        { path: '/resource/list',
          name: 'resource-list',
          component: _import('basicSystem/resource-module/resource-build/resource-list'),
          meta: {title: ['基础平台', '资源库设置', '资源库搭建']}
        },
        { path: '/resource/auth',
          name: 'resource-auth',
          component: _import('basicSystem/resource-module/resource-authorization/resource-auth'),
          meta: {title: ['基础平台', '资源库设置', '资源库授权']}
        },
        { path: '/resource/auth/add',
          name: 'resource-auth-add',
          component: _import('basicSystem/resource-module/resource-authorization/resource-auth-add'),
          meta: {title: ['基础平台', '资源库设置', '批量分配用户角色']}
        },
        // 短信配置及统计
        { path: '/message/setting',
          name: 'message-setting',
          component: _import('basicSystem/message-module/Msg-configurationAndStatistics/message-setting'),
          meta: {title: ['基础平台', '消息推送', '短信余量统计']}
        },
        { path: '/message/parameter/setting',
          name: 'message-parameter-setting',
          component: _import('basicSystem/message-module/Msg-configurationAndStatistics/parameter-setting'),
          meta: {title: ['基础平台', '消息推送', '短信参数配置']}
        },
        { path: '/msg/recharge/list',
          name: 'msg-recharge-list',
          component: _import('basicSystem/message-module/message-recharge-record/msg-recharge-list'),
          meta: {title: ['基础平台', '消息推送', '短信充值记录']}
        },
        // 流量
        { path: '/flow/setting',
          name: 'flow-setting',
          component: _import('basicSystem/flow-module/flow-statistics/flow-setting'),
          meta: {title: ['基础平台', '流量管理', '流量充值及账单']}
        },
        { path: '/flow/recharge/list',
          name: 'flow-recharge-list',
          component: _import('basicSystem/flow-module/flow-recharge-record/flow-recharge-list'),
          meta: {title: ['基础平台', '流量管理', '流量充值记录']}
        },
        // 微信公众号配置
        { path: '/wechat/configuration',
          name: 'wechat-configuration',
          component: _import('basicSystem/wechat-configuration/wechat-configuration'),
          meta: {title: ['基础平台', '微信公众号配置', '微信公众号配置']}
        },

        /* -----------------------------报名录取系统----------------------------- */
        // 学习项目
        { path: '/training/project',
          name: 'training-project',
          component: _import('enrolmentSystem/training-module/training-project'),
          meta: {title: ['报名录取', '学习项目', '项目管理']}
        },
        { path: '/registration/list',
          name: 'registration-list',
          component: _import('enrolmentSystem/registration-module/registration-list'),
          meta: {title: ['报名录取', '报名管理', '报名管理']}
        },
        { path: '/admission/list',
          name: 'admission-list',
          component: _import('enrolmentSystem/admission-module/admission-list'),
          meta: {title: ['报名录取', '录取管理', '报名审核']}
        },
        { path: '/pay/list',
          name: 'pay-list',
          component: _import('enrolmentSystem/payment-module/pay-management/pay-list'),
          meta: {title: ['报名录取', '缴费管理', '缴费管理']}
        },
        { path: '/pay/record/list',
          name: 'pay-record-list',
          component: _import('enrolmentSystem/payment-module/pay-management/pay-record-list'),
          meta: {title: ['报名录取', '缴费管理', '个人缴费记录']}
        },
        { path: '/pay/search/list',
          name: 'pay-search-list',
          component: _import('enrolmentSystem/payment-module/pay-search/pay-search-list'),
          meta: {title: ['报名录取', '缴费管理', '缴费查询']}
        },
        { path: '/divide/classes',
          name: 'divide-classes',
          component: _import('enrolmentSystem/division-module/divide-classes'),
          meta: {title: ['报名录取', '分班管理', '分班管理']}
        },
        // { path: '/class/edit',
        //   name: 'class-edit',
        //   component: _import('enrolmentSystem/division-module/class-edit'),
        //   meta: {title: ['报名录取', '分班管理', '班级信息']}
        // },
        { path: '/student/files',
          name: 'student-files',
          component: _import('enrolmentSystem/division-module/student-files'),
          meta: {title: ['报名录取', '分班管理', '报名数据']}
        },
        // 住宿管理
        { path: '/accommodation/hotel',
          name: 'accommodation-hotel-list',
          component: _import('enrolmentSystem/accommodation-management/hotel-module/hotel-list'),
          meta: {title: ['报名录取', '住宿管理', '酒店管理']}
        },
        { path: '/accommodation/hotel/room',
          name: 'accommodation-hotel-room-list',
          component: _import('enrolmentSystem/accommodation-management/hotel-room-module/hotel-room-list'),
          meta: {title: ['报名录取', '住宿管理', '客房管理']}
        },
        { path: '/accommodation/distribution',
          name: 'accommodation-distribution-list',
          component: _import('enrolmentSystem/accommodation-management/distribution-module/distribution-list'),
          meta: {title: ['报名录取', '住宿管理', '住宿分配']}
        },
        { path: '/accommodation/statistics',
          name: 'accommodation-statistics-list',
          component: _import('enrolmentSystem/accommodation-management/statistics-module/statistics-list'),
          meta: {title: ['报名录取', '住宿管理', '住宿统计']}
        },
        // 就餐管理
        { path: '/dining/canteen',
          name: 'dining-canteen-list',
          component: _import('enrolmentSystem/dining-management/canteen-module/canteen-list'),
          meta: {title: ['报名录取', '就餐管理', '食堂管理']}
        },
        { path: '/dining/meal-ticket',
          name: 'dining-meal-ticket-list',
          component: _import('enrolmentSystem/dining-management/meal-ticket-module/meal-ticket-list'),
          meta: {title: ['报名录取', '就餐管理', '就餐券管理']}
        },
        { path: '/dining/distribution',
          name: 'dining-distribution-list',
          component: _import('enrolmentSystem/dining-management/distribution-module/distribution-list'),
          meta: {title: ['报名录取', '就餐管理', '就餐分配']}
        },
        { path: '/dining/statistics',
          name: 'dining-statistics-list',
          component: _import('enrolmentSystem/dining-management/statistics-module/statistics-list'),
          meta: {title: ['报名录取', '就餐管理', '就餐统计']}
        },

        /* -----------------------------在线学习系统----------------------------- */
        // 资源库管理
        { path: '/repository/list',
          name: 'repository-list',
          component: _import('onlineLearningSystem/repository-management/repository-maintenance/repository-list'),
          meta: {title: ['在线学习', '资源库管理', '资源维护']}
        },
        { path: '/repository/approval/list',
          name: 'repository-approval-list',
          component: _import('onlineLearningSystem/repository-management/repository-approval/repository-approval-list'),
          meta: {title: ['在线学习', '资源库管理', '资源审批']}
        },
        { path: '/repository/supervision/list',
          name: 'repository-supervision-list',
          component: _import('onlineLearningSystem/repository-management/repository-supervision/repository-supervision-list'),
          meta: {title: ['在线学习', '资源库管理', '资源监管']}
        },
        { path: '/repository/infomation',
          name: 'repository-infomation',
          component: _import('onlineLearningSystem/repository-management/repository-infomation/repository-infomation'),
          meta: {title: ['在线学习', '资源库管理', '资源信息']}
        }, // 课程组装
        { path: '/knowledgePoints/list',
          name: 'knowledgePoints-list',
          component: _import('onlineLearningSystem/course-assembly/knowledgePoints-list'),
          meta: {title: ['在线学习', '课程组装', '知识点管理']}
        },
        { path: '/courseassembly/list',
          name: 'course-assembly-list',
          component: _import('onlineLearningSystem/course-assembly/course-assembly-list'),
          meta: {title: ['在线学习', '课程组装', '课程组装']}
        },
        { path: '/courseassembly/list/bind',
          name: 'course-assembly-list-bind',
          component: _import('onlineLearningSystem/course-assembly/course-assembly-bind'),
          meta: {title: ['在线学习', '课程组装', '绑定资源']}
        },
        { path: '/knowledge/infomation',
          name: 'course-knowledge-infomation',
          component: _import('onlineLearningSystem/course-assembly/course-knowledge-infomation'),
          meta: {title: ['在线学习', '课程组装', '课程知识点']}
        },
        // 学习项目
        { path: '/program/schedule',
          name: 'program-schedule',
          component: _import('onlineLearningSystem/course-scheduling-management/program-scheduling/program-schedule'),
          meta: {title: ['在线学习', '学习项目', '项目排课']}
        },
        { path: '/liveTeaching/list',
          name: 'liveTeaching-list',
          component: _import('onlineLearningSystem/liveTeaching-management/liveTeaching-maintenance/liveTeaching-list'),
          meta: {title: ['在线学习', '直播教学', '直播课堂管理']}
        },
        { path: '/liveTeaching/infomation',
          name: 'liveTeaching-infomation',
          component: _import('onlineLearningSystem/liveTeaching-management/liveTeaching-maintenance/liveTeaching-infomation'),
          meta: {title: ['在线学习', '直播教学', '直播详情']}
        },
        // { path: '/liveTeaching/analysis/list',
        //   name: 'liveTeaching-analysis-list',
        //   component: _import('onlineLearningSystem/liveTeaching-management/liveTeaching-analysis/liveTeaching-analysis-list'),
        //   meta: {title: ['在线学习', '直播教学', '直播统计']}
        // },
        // 考勤管理
        { path: '/attendance/code',
          name: 'attendance-code',
          component: _import('onlineLearningSystem/attendance-management/attendance-code'),
          meta: {title: ['在线学习', '考勤管理', '在线考勤']}
        },
        { path: '/attendance/list',
          name: 'attendance-list',
          component: _import('onlineLearningSystem/attendance-management/attendance-list'),
          meta: {title: ['在线学习', '考勤管理', '考勤管理']}
        },
        { path: '/faceAttendance/list',
          name: 'faceAttendance-list',
          component: _import('onlineLearningSystem/attendance-management/faceAttendance-moudle.vue/faceAttendance-list'),
          meta: {title: ['在线学习', '考勤管理', '人脸识别考勤']}
        },
        // 评价管理
        { path: '/evaluating/indicator',
          name: 'evaluating-indicator',
          component: _import('onlineLearningSystem/evaluation-management/evaluating-indicator-module/evaluating-indicator'),
          meta: {title: ['在线学习', '评价管理', '评价指标']}
        },
        { path: '/evaluating/list',
          name: 'evaluating-list',
          component: _import('onlineLearningSystem/evaluation-management/evaluating-module/evaluating-list'),
          meta: {title: ['在线学习', '评价管理', '评价管理']}
        },
        { path: '/online/evaluation/list',
          name: 'online-evaluation',
          component: _import('onlineLearningSystem/evaluation-management/online-evaluation/online-evaluation-list'),
          meta: {title: ['在线学习', '评价管理', '在线评价']}
        },
        // 评价统计
        { path: '/evaluating/statistics',
          name: 'evaluating-statistics',
          component: _import('onlineLearningSystem/evaluation-management/evaluation-statistics/evaluation-statistics'),
          meta: {title: ['在线学习', '评价管理', '评价统计']}
        },
        { path: '/evaluating/reviewers',
          name: 'evaluating-reviewers',
          component: _import('onlineLearningSystem/evaluation-management/evaluation-statistics/evaluation-reviewers'),
          meta: {title: ['在线学习', '评价管理', '评价状况']}
        },

        /* -----------------------------在线考试系统----------------------------- */
        // 基础设置
        { path: '/paper/globalSetting',
          name: 'paper-globalSetting',
          component: _import('examinationSystem/basicSetting/global-setting/paper-globalSetting'),
          meta: {title: ['在线考试', '基础设置', '全局设置']}
        },
        { path: '/question/directory',
          name: 'question-directory',
          component: _import('examinationSystem/basicSetting/question-directory-management/question-directory'),
          meta: {title: ['在线考试', '基础设置', '题库目录管理']}
        },
        // 试题管理
        { path: '/question/list',
          name: 'question-list',
          component: _import('examinationSystem/question-management/question-maintenance/question-list'),
          meta: {title: ['在线考试', '试题管理', '试题管理']}
        },
        { path: '/question/infomation',
          name: 'question-infomation',
          component: _import('examinationSystem/question-management/question-maintenance/question-infomation'),
          meta: {title: ['在线考试', '试题管理', '试题详情']}
        },
        { path: '/question/check',
          name: 'question-check',
          component: _import('examinationSystem/question-management/question-examine/question-check'),
          meta: {title: ['在线考试', '试题管理', '试题审核']}
        },
        // 试卷管理
        { path: '/assemble/strategy',
          name: 'assemble-strategy',
          component: _import('examinationSystem/paper-management/paper-strategy/assemble-strategy'),
          meta: {title: ['在线考试', '试卷管理', '组卷策略']}
        },
        { path: '/assemble/strategy/infomation',
          name: 'assemble-strategy-infomation',
          component: _import('examinationSystem/paper-management/paper-strategy/assemble-strategy-infomation'),
          meta: {title: ['在线考试', '试卷管理', '组卷策略信息']}
        },
        { path: '/examinationPaper/list',
          name: 'examinationPaper-list',
          component: _import('examinationSystem/paper-management/online-generating/examinationPaper-list'),
          meta: {title: ['在线考试', '试卷管理', '在线组卷']}
        },
        // 考试管控
        { path: '/examination/arrangement/list',
          name: 'examination-arrangement-list',
          component: _import('examinationSystem/examination-management/examination-arrangement/examination-arrangement-list'),
          meta: {title: ['在线考试', '考试管控', '考试安排']}
        },
        { path: '/examination/makeup/list',
          name: 'examination-makeup-list',
          component: _import('examinationSystem/examination-management/examination-makeup-arrangement/examination-makeup-list'),
          meta: {title: ['在线考试', '考试管控', '补考安排']}
        },
        // 阅卷管理
        { path: '/marking/paper/list',
          name: 'marking-paper-list',
          component: _import('examinationSystem/marking-management/marking-paper-module/marking-paper-list'),
          meta: {title: ['在线考试', '阅卷管理', '阅卷管理']}
        },
        { path: '/marking/paper/class/list',
          name: 'marking-paper-class-list',
          component: _import('examinationSystem/marking-management/marking-paper-module/marking-paper-class-list'),
          meta: {title: ['在线考试', '阅卷管理', '班级阅卷管理']}
        },
        // 成绩管理
        { path: '/performance/compose/paper',
          name: 'compose-paper',
          component: _import('examinationSystem/performance-management/compose-performance-paper/compose-paper'),
          meta: {title: ['在线考试', '成绩管理', '成绩单构成']}
        },
        { path: '/performance/examination/list',
          name: 'performance-examination-list',
          component: _import('examinationSystem/performance-management/performance-module/performance-examination-list'),
          meta: {title: ['在线考试', '成绩管理', '成绩管理']}
        },
        { path: '/performance/search/list',
          name: 'performance-search-list',
          component: _import('examinationSystem/performance-management/performance-search/performance-search-list'),
          meta: {title: ['在线考试', '成绩管理', '成绩查询']}
        },
        /* -----------------------------毕业管理----------------------------- */
        // 毕业管理
        { path: '/graduation/judgement/list',
          name: 'graduation-judgement-list',
          component: _import('graduationSystem/graduation-judge-module/graduation-judgement-list'),
          meta: {title: ['毕业管理', '毕业管理', '毕业判定条件']}
        },
        { path: '/graduation/list',
          name: 'graduation-list',
          component: _import('graduationSystem/graduation-module/graduation-list'),
          meta: {title: ['毕业管理', '毕业管理', '毕业管理']}
        },
        { path: '/graduation/setting/global',
          name: 'graduation-setting-global',
          component: _import('graduationSystem/graduation-setting-module/graduation-global-settings'),
          meta: {title: ['毕业管理', '毕业设置', '全局设置']}
        },
        { path: '/graduation/setting/requirements',
          name: 'graduation-setting-requirements',
          component: _import('graduationSystem/graduation-setting-module/graduation-requirements'),
          meta: {title: ['毕业管理', '毕业设置', '毕业要求']}
        },
        { path: '/student/files/list',
          name: 'student-files-list',
          component: _import('graduationSystem/student-profile-module/student-files-list'),
          meta: {title: ['毕业管理', '学生档案', '学生档案']}
        },
        { path: '/graduation/certificate/skill',
          name: 'graduation-certificate-skill',
          component: _import('graduationSystem/graduation-certificate-module/skill-certificate-management'),
          meta: {title: ['毕业管理', '证书管理', '技能证书管理']}
        },
        { path: '/graduation/certificate/diploma',
          name: 'graduation-certificate-diploma',
          component: _import('graduationSystem/graduation-certificate-module/diploma-management'),
          meta: {title: ['毕业管理', '证书管理', '毕业证书管理']}
        },
        { path: '/graduation/certificate/issuance',
          name: 'graduation-certificate-issuance',
          component: _import('graduationSystem/graduation-certificate-module/certificate-issuance'),
          meta: {title: ['毕业管理', '证书管理', '证书发放']}
        },
        { path: '/evidence/column/list',
          name: 'evidence-column-list',
          component: _import('graduationSystem/evidence-materials-module/evidence-column-list'),
          meta: {title: ['毕业管理', '佐证材料', '佐证栏目']}
        },
        { path: '/evidence/materials/list',
          name: 'evidence-materials-list',
          component: _import('graduationSystem/evidence-materials-module/evidence-materials-list'),
          meta: {title: ['毕业管理', '佐证材料', '佐证材料']}
        },
        { path: '/subsidy/management/list',
          name: 'subsidy-management-list',
          component: _import('graduationSystem/evidence-materials-module/subsidy-management-list'),
          meta: {title: ['毕业管理', '佐证材料', '补贴管理']}
        },

        /* -----------------------------统计分析----------------------------- */
        // 项目分析
        { path: '/registration/analysis/charts',
          name: 'registration-analysis-charts',
          component: _import('statisticalSystem/registration-analysis-management/registration-analysis-charts'),
          meta: {title: ['统计分析', '项目分析', '报名分析']}
        },
        { path: '/graduation/analysis/charts',
          name: 'graduation-analysis-charts',
          component: _import('statisticalSystem/registration-analysis-management/graduation-analysis-charts'),
          meta: {title: ['统计分析', '项目分析', '毕业分析']}
        },
        // 学习分析
        { path: '/learning/tracking/list',
          name: 'learning-tracking-list',
          component: _import('statisticalSystem/leraning-analysis-management/learning-tracking-module/learning-tracking-list'),
          meta: {title: ['统计分析', '学习分析', '学习跟踪']}
        },
        { path: '/learning/attendance/list',
          name: 'learning-attendance-list',
          component: _import('statisticalSystem/leraning-analysis-management/learning-attendance-record/learning-attendance-list'),
          meta: {title: ['统计分析', '学习分析', '到课率分析']}
        },
        // 考试分析
        { path: '/examination/analysis/setting',
          name: 'examination-analysis-setting',
          component: _import('statisticalSystem/examination-analysis-management/examination-analysis-setting/analysis-setting'),
          meta: {title: ['统计分析', '考试分析', '分析设置']}
        },
        { path: '/examination/rate/list',
          name: 'examination-rate-list',
          component: _import('statisticalSystem/examination-analysis-management/examination-pass-rate/examination-rate-list'),
          meta: {title: ['统计分析', '考试分析', '考试合格率']}
        },
        { path: '/performance/analysist/list',
          name: 'performance-analysist-list',
          component: _import('statisticalSystem/examination-analysis-management/performance-analysis/performance-analysis-list'),
          meta: {title: ['统计分析', '考试分析', '成绩分析']}
        },
        // 资源统计
        { path: '/resource/upload/statistics',
          name: 'resource-upload-statistics',
          component: _import('statisticalSystem/resource-statistics-management/resource-upload-statistics/resource-upload-statistics'),
          meta: {title: ['统计分析', '资源统计', '用户上传统计']}
        },
        { path: '/resource/classification/statistics',
          name: 'resource-classification-statistics',
          component: _import('statisticalSystem/resource-statistics-management/resource-classification-statistics/resource-classification-statistics'),
          meta: {title: ['统计分析', '资源统计', '资源分类统计']}
        },
        // 直播统计
        { path: '/live/data/statistics',
          name: 'live-data-statistics',
          component: _import('statisticalSystem/live-statistics-management/live-data-statistics/live-data-statistics'),
          meta: {title: ['统计分析', '直播统计', '直播数据分析']}
        },
        { path: '/live/fee/flow',
          name: 'live-fee-flow',
          component: _import('statisticalSystem/live-statistics-management/live-fee-flow/live-fee-flow'),
          meta: {title: ['统计分析', '直播统计', '直播费用流水']}
        },
        // 消费统计
        { path: '/consumption/statistics/list',
          name: 'consumption-statistics-list',
          component: _import('statisticalSystem/consumption-statistics-management/consumption-statistics/consumption-statistics-list'),
          meta: {title: ['统计分析', '消费统计', '消费明细']}
        },
        { path: '/invoice/list',
          name: 'invoice-list',
          component: _import('statisticalSystem/consumption-statistics-management/invoice-moduel/invoice-list'),
          meta: {title: ['统计分析', '消费统计', '发票管理']}
        }

      ],
      beforeRouteEnter (to, from, next) {
        let Authorization = localStorage.getItem('Authorization')
        if (!Authorization) {
          next({ name: 'login' })
        }
      }
    },
    { path: '/error/404', name: 'error404', component: _import('common/error_404') }
    // { path: '*', redirect: '/error/404' }
  ]
})
