import http from "./http"

/* ------------------------------ 学生档案-考勤信息------------------------------------- */

// 获取学生考勤信息统计
export const getAttendanceStatisticByStudentId = (data) => http('/Api/Attendance/AttendanceStatisticByStudentId', data)
// 获取学生考勤详情
export const getAttendanceItemByStudentId = (data) => http('/Api/Attendance/AttendanceItemByStudentId', data)
// 获取直播考勤统计
export const getLivingCheckInHistoryStatistic = (data) => http('/Api/LiveRoom/CheckInHistoryStatistic', data)
// 获取直播学习记录
export const getLivingCheckInHistoryItems = (data) => http('/Api/LiveRoom/CheckInHistoryItems', data)
// 获取学生基本信息
export const StudentBasicInfo = (data) => http(`Api/StudyReport/StudentBasicInfo?studentId=${data.studentId}&projectId=${data.projectId}`, {})
// 直播学习
export const LiveStudy = (data) => http(`Api/StudyReport/LiveStudy?studentId=${data.studentId}&projectId=${data.projectId}`, {})
// 在线学习
export const OnlineStudy = (data) => http(`Api/StudyReport/OnlineStudy?studentId=${data.studentId}&projectId=${data.projectId}`, {})
// 获取学生成绩信息
export const getExamPaperRecord = (data) => http('/Api/ExamPaperRecord/ExamPaperByStudent', data)
// 评价
export const EvaluationList = (data) => http(`Api/StudyReport/EvaluationList?studentId=${data.studentId}&projectId=${data.projectId}`, {})