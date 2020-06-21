import http from './http'

// 获取腾讯云Token
export const getTempFileUploadToken = () => http('/Api/ExternalFiles/GetTempFileUploadToken', {})

/* ------------------------------ 【在线培训系统】-资源库管理-------------------------------------- */
// 获取资源详情
export const getResourceById = (id) => http('/Api/Resource/' + id, {})
// 获取资源元数据
export const getResourceMetadata = (id) => http('/Api/Resource/Metadata?id=' + id, {})
// 更新资源元信息
export const updateResourceMetadata = (data) => http('/Api/Resource/Metadata?id=' + data.id, data, 'PUT')
// 获得资源播放相关信息
export const getResourcePlanInfo = (id) => http('/Api/Resource/PlayInfo?id=' + id, {})
// 获得资源列表
export const getResourceList = (data) => http('/Api/Resource', data)
// 更新资源信息
export const updateResource = (data) => http('/Api/Resource?id=' + data.id, data, 'PUT')
// 删除资源库
export const deleteResource = (data) => http('/Api/Resource?id=' + data.id, data, 'DELETE')
// 资源审核通过
export const AcceptResource = (ids) => http('/Api/Resource/BatchAccept', ids, 'PUT')
// 资源审核不通过
export const RejectResource = (data) => http('/Api/Resource/Reject?id=' + data.id + '&rejectReason=' + data.rejectReason, data, 'PUT')
// 设置资源启用/停用状态
export const updateResourceStatus = (data) => http('/Api/Resource/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT')
// 设置建议学习时长
export const SetSuggestedLearningTime = (data) => http('/Api/Resource/SetSuggestedLearningTime?id=' + data.id + '&suggestedLearningTime=' + data.suggestedLearningTime, {}, 'PUT')
/* ------------------------------ 【在线培训系统】-资源-学科-------------------------------------- */
// 学科-一级
export const getExternalDataFirst = (data) => http('/Api/ExternalData/FirstLevelSubjects', data)
// 学科-子级
export const getExternalDataChild = (id) => http('/Api/ExternalData/SubjectChild?parentId=' + id, {})

/* ------------------------------ 【在线培训系统】-课程组装---章/节-------------------------------------- */
// 获取章|节|知识点信息详情
export const getCourseCatalogById = (id) => http(`/Api/CourseCatalog/${id}`, {})
// 更新章|节|知识点信息
export const updateCourseCatalog = (data) => http(`/Api/CourseCatalog?id=${data.id}`, data, 'PUT')
// 删除章|节|知识点信息
export const deleteCourseCatalog = (id) => http(`/Api/CourseCatalog?id=${id}`, {}, 'DELETE')
// 创建章|节|知识点
export const createCourseCatalog = (data) => http('/Api/CourseCatalog', data, 'POST')
// 获取章|节|知识点信息，课程知识点管理使用
export const getCourseCatalogList = (data) => http('/Api/CourseCatalog', data)
// 为章|节|知识点绑定资源
export const bindCourseCatalogResource = (id, data) => http(`/Api/CourseCatalog/Bind?id=${id}`, data, 'PUT')
// 章|节|知识点解绑资源
export const UnBindCourseCatalogResource = (id, resourceId) => http(`/Api/CourseCatalog/Unbind?id=${id}&resourceId=${resourceId}`, {}, 'PUT')
// 设置章|节|知识点排序序号
export const updateCourseCatalogOrder = (data) => http('/Api/CourseCatalog/SetOrder', data, 'PUT')
// 获取章|节|知识点下的资源列表
export const getCourseCatalogOrderResources = (id) => http(`/Api/CourseCatalog/Resources?id=${id}`, {})

/* ------------------------------ 【在线培训系统】-项目排课-------------------------------------- */
// 获取项目排课内容
export const getCourseScheduling = (data) => http('/Api/CourseScheduling', data)
// 更新排课
export const updateCourseScheduling = (id, data) => http('/Api/CourseScheduling?id=' + id, data, 'PUT')
// 保存排课
export const createCourseScheduling = (data) => http('/Api/CourseScheduling/CourseScheduling', data, 'POST')
// 获取教师本周排课
export const getTeacherCourseScheduling = (data) => http('/Api/CourseScheduling/TeachersSchedule', data)
// 锁定/解锁课表
export const LockCourseScheduling = (id, flagLock) => http('/Api/Semester/LockCourseScheduling?id=' + id + '&flagLock=' + flagLock, {}, 'PUT')
// 课程学分设置
export const createCourseSchedulingScore = (data) => http('/Api/CourseScheduling/CreditScore', data, 'POST')
// 查询课程学分
// export const getCourseSchedulingScore = (data) => http('/Api/CourseScheduling/GetCreditScore', data)
// 更新课程学分
export const updateCourseSchedulingScore = (data) => http('/Api/CourseScheduling/UpdateCreditScore?id=' + data.id, data, 'PUT')
// 获取本学期 周 下面是否排课数据
export const getCourseSchedulingByWeek = (gradeId) => http('/Api/CourseScheduling/CourseSchedulingByWeek?gradeId=' + gradeId, {})

/* ------------------------------ 【在线培训系统】-评价管理-指标-------------------------------------- */
// 分页获取评价指标
export const getEvaluationIndicator = (data) => http('/Api/evaluationIndicator', data)
// 新增评价指标
export const createEvaluationIndicator = (data) => http('/Api/evaluationIndicator', data, 'POST')
// 更新指标信息
export const updateEvaluationIndicator = (data) => http('/Api/evaluationIndicator?id=' + data.id, data, 'PUT')
// 删除评价指标
export const deleteEvaluationIndicator = (id) => http('/Api/evaluationIndicator?id=' + id, {}, 'DELETE')
// 评价指标详情
export const getEvaluationIndicatorById = (id) => http('/Api/evaluationIndicator/' + id, {})

/* ------------------------------ 【在线培训系统】-评价管理-评价管理-------------------------------------- */
// 获取评价计划详情
export const getEvaluationPlanById = (id) => http('/Api/EvaluationPlan/' + id, {})
// 获取评价计划列表数据
export const getEvaluationPlan = (data) => http('/Api/EvaluationPlan', data)
// 新建评价计划
export const createEvaluationPlan = (data) => http('/Api/EvaluationPlan', data, 'POST')
// 更新评价计划
export const updateEvaluationPlan = (data) => http('/Api/EvaluationPlan?id=' + data.id, data, 'PUT')
// 删除评价计划
export const deleteEvaluationPlan = (data) => http('/Api/EvaluationPlan?id=' + data.id, data, 'DELETE')
// 添加评价计划中评价指标
export const updateEvaluationPlanIndicator = (id, data) => http('/Api/EvaluationPlan/' + id + '/AddPlanIndicator', data, 'POST')
// 移除评价计划中评价指标
export const RemoveEvaluationPlanIndicator = (id, data) => http('/Api/EvaluationPlan/' + id + '/RemovePlanIndicator', data, 'PUT')
// 是否启用评价计划
export const updateEvaluationPlanEnable = (data) => http('/Api/EvaluationPlan/Enable?id=' + data.id + '&enable=' + data.enable, data, 'PUT')
// 获取评价计划的指标
export const getPlanIndicatorList = (id) => http('/Api/EvaluationPlan/PlanIndicatorList?id=' + id, {})
// 更新评价管理中评价者
export const updateEvaluationPlanCommentator = (id, data) => http('/Api/EvaluationPlan/SaveOrUpdatePlanCommentator?id=' + id, data, 'PUT')
// 获取评价
export const getEvaluationPlanCommentator = (id) => http('/Api/EvaluationPlan/GetPlanCommentator?id=' + id, {})
// 删除评价指标
export const deleteEvaluationPlanIndicator = (data) => http('/Api/EvaluationPlan/DeleteIndicator?id=' + data.id, data, 'DELETE')
// 删除评论者
export const deleteEvaluationDeleteCommentator = (data) => http('/Api/EvaluationPlan/DeleteCommentator?id=' + data.id, data, 'DELETE')
// 未设置评价计划的指标列表
export const getEvaluationNotPlanIndicator = (data) => http('/Api/EvaluationPlan/NotSetPlanIndicator', data)
// 根据培训项目 Id 获取教师所在组织信息-课程列表
export const getEvaluationNotPlanTeacherOrganizeInfo = (trainingProgramId) => http('/Api/EvaluationPlan/TeacherOrganizeInfo?trainingProgramId=' + trainingProgramId, {})
// 根据课程 Id 获取教师列表
export const getEvaluationNotPlanTeacherListByCourseId = (trainingProgramId, courseId) => http('/Api/EvaluationPlan/TeacherListByCourseId?trainingProgramId=' + trainingProgramId + '&courseId=' + courseId, {})
// 根据培训项目 Id 获取学生所在组织信息
export const getEvaluationNotPlanStudentOrganizeInfo = (trainingProgramId) => http('/Api/EvaluationPlan/StudentOrganizeInfo?trainingProgramId=' + trainingProgramId, {})
// 根据班级 Id 获取学生列表
export const getEvaluationNotPlanStudentListByClassId = (classId) => http('/Api/EvaluationPlan/StudentListByClassId?classId=' + classId, {})
// 根据班级 Id 获取教师列表
export const getEvaluationTeacherListByClassId = (classId) => http('/Api/EvaluationPlan/TeacherListByClassId?classId=' + classId, {})
// 根据项目 Id 获取教师列表
export const getEvaluationTeacherListByTpId = (trainingProgramId) => http('/Api/EvaluationPlan/TeacherListByTpId?trainingProgramId=' + trainingProgramId, {})
// 获取考评人，和被考评人
export const getPlanCommentByList = (data) => http('/Api/EvaluationPlan/PlanCommentByList', data)

/* ------------------------------ 【在线培训系统】-评价管理-在线评价-------------------------------------- */
// 获取在线评价列表
export const getOnlineEvaluationList = (data) => http('/Api/OnlineEvaluation/List', data)
// 获取详情
export const getOnlineEvaluationById = (data) => http('/Api/OnlineEvaluation', data)
// 保存评价内容
export const createOnlineEvaluation = (data) => http('/Api/OnlineEvaluation', data, 'POST')

/* ------------------------------ 【在线培训系统】-评价管理---评论--评价报表统计-------------------------------------- */
// 获取评价汇总统计信息
export const getEvaluationStatisticsInfo = (planId) => http(`/Api/EvaluationInfo/StatisticsInfo?planId=${planId}`, {})
// 获取评价明细信息分页列表
export const getEvaluationDetailInfoList = (planId) => http(`/Api/EvaluationInfo/DetailInfoList?planId=${planId}`, {})
// 获取某条评价详细信息
export const getEvaluationDetailInfo = (commentId) => http(`/Api/EvaluationInfo/DetailInfo?commentId=${commentId}`, {})
/* ------------------------------ 【在线培训系统】-评价管理---评论--评价报表统计-------------------------------------- */
// 获取评价列表数据-当前用户
export const getEvaluationInfoList = (data) => http('/Api/EvaluationInfo/GetEvaluationPlayComment', data)
// 删除评论
export const deleteEvaluationInfo = (data) => http('/Api/EvaluationInfo?id=' + data.id, data, 'DELETE')
// 发表评论 -使用者
export const createEvaluationInfo = (data) => http('/Api/EvaluationInfo', data, 'POST')
// 获取最新十条评论 Top10
export const getEvaluationInfoTop10 = (planId) => http('/Api/EvaluationInfo/Top10?planId=' + planId, {})
// 回复评论 -发起者
export const ReplyEvaluationInfo = (data) => http('/Api/EvaluationInfo/ReplyComment', data, 'PUT')
// 是否显示评论内容
export const EvaluationInfoFlagShow = (id, flagShow) => http('/Api/EvaluationInfo/FlagShow?id=' + id + '&flagShow=' + flagShow, {}, 'PUT')
// [设置评价者]根据学期、培训项目/课程, 老师Id查询出老师所教授班级
export const getEvaluationTeacher = (data) => http('/Api/EvaluationPlan/GetTeacherWithClass', data)
// 根据评价计划Id获取评价者[班级]
export const GetPlanWithCommentator = (planId) => http('/Api/EvaluationPlan/GetPlanWithCommentator?planId=' + planId, {})
// 图形统计
export const GetCommentWithGraphInfo = (data) => http('/Api/EvaluationInfo/GetCommentWithGraphInfo', data)
// 根据传入类型获取已评价/未评价学生
export const EvaluateOrNoEvaluateStudent = (data) => http('/Api/EvaluationInfo/EvaluateOrNoEvaluateStudent', data)

/* ------------------------------ 【在线培训系统】- 直播教学-------------------------------------- */
// 创建直播间
export const createLiveRoom = (data) => http('/Api/LiveRoom', data, 'POST')
// 获取直播间列表
export const getLiveRoomList = (data) => http('/Api/LiveRoom', data)
// 更新直播间基本信息
export const updateLiveRoomById = (data) => http(`/Api/LiveRoom/${data.id}`, data, 'PUT')
// 删除直播间
export const deleteLiveRoomById = (id) => http(`/Api/LiveRoom/${id}`, {}, 'DELETE')
// 获取直播间详情
export const getLiveRoomById = (id) => http(`/Api/LiveRoom/${id}`, {})
// 开始直播
export const StartLiveRoomById = (id) => http(`/Api/LiveRoom/Start?id=${id}`, {}, 'PUT')
// 结束直播
export const StopLiveRoomById = (id) => http(`/Api/LiveRoom/Stop?id=${id}`, {}, 'PUT')
// 获取直播间以及直播签到表
export const getLiveRoomCheckInHistory = (data) => http('/Api/LiveRoom/CheckInHistory', data)
// 获取直播间统计信息
export const getLiveRoomStaticsById = (id) => http(`/Api/LiveRoom/Statics?liveRoomId=${id}`, {})

/* ------------------------------ 【在线培训系统】-考勤管理-------------------------------------- */
// 获取当前用户所教授的培训项目
export const getTrainingProgramDropdown = () => http('/Api/Attendance/GiveTrainingProgramDropdown', {})
// 获取当前用户 教授的班级课程和节，根据培训项目id查询
export const getAttendanceDropdown = (trainingProgramId) => http('/Api/Attendance/AttendanceDropdownByTrainingProgramId?trainingProgramId=' + trainingProgramId, {})
// 获取发起考勤前的基本信息
export const getAttendanceInitiateInfo = () => http('/Api/Attendance/AttendanceInitiateInfo', {})
// 发起签到
export const AttendanceInitiate = (data) => http('/Api/Attendance/Initiate', data, 'POST')
// 接收学生签到
export const AttendanceAccept = (data) => http('/Api/Attendance/Accept', data, 'PUT')
// 设置考勤状态
export const AttendanceStatus = (data) => http('/Api/Attendance/ChangeStatus', data, 'PUT')
// 获取考勤管理列表
export const getAttendanceList = (data) => http('/Api/Attendance/AttendanceManageList', data)
// 获取考勤详细信息, 根据id获取
export const getAttendanceById = (id) => http('/Api/Attendance/AttendanceInfoById?id=' + id, {})
// 根据考勤详细信息学生条目, 根据id获取
export const getAttendanceStudentListById = (data) => http('/Api/Attendance/AttendanceInfoItemById', data)
// 获取考勤详细信息  ------ 弃用
// export const getAttendanceInfoList = (data) => http('/Api/Attendance/AttendanceInfo', data)
// 获取考勤详细信息学生条目 ------ 弃用
// export const getAttendanceStudentById = (data) => http('/Api/Attendance/AttendanceInfoItem', data)
// 推送提醒到本班学校
export const SendToStudentsOfClass = (data) => http('/Api/Attendance/SendToStudentsOfClass', data, 'POST')
// 获取当前用户 教授的班级课程和节，根据培训项目id查询
export const getAttendanceDropdownByTrainingProgramId = (trainingProgramId) => http('/Api/Attendance/AttendanceDropdownByTrainingProgramId?trainingProgramId=' + trainingProgramId, {})
/* ------------------------------ 【在线培训系统】-考勤管理-人脸识别考勤-------------------------------------- */
// 获取面部考勤列表
export const getFaceAttendanceRecordList = (data) => http('/Api/FaceAttendance/Record', data)
// 获取面部考勤记录详细列表
export const getFaceAttendanceRecordById = (data) => http('/Api/FaceAttendance/Details', data)
// 获取直播面部考勤记录详细列表
export const getLivingFaceAttendanceRecordById = (data) => http('/Api/LiveRoom/CheckInHistoryFace', data)
export const getEvaluationPlanIndicator = (data) => http('', data)
