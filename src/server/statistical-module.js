import http from './http'

/* ------------------------------ 统计分析-报名分析------------------------------------- */
// 获取报名分析图表数据
export const getRegistrationAnalysisBar = (data) => http('/Api/RegistrationAnalysis/Bar', data)
// 获取占比详情图表数据
export const getRegistrationAnalysisRatio = (data) => http('/Api/RegistrationAnalysis/Ratio', data)
/* ------------------------------ 统计分析-毕业分析------------------------------------- */
export const GetGraduationAnalysis = (data) => http(`/Api/GraduationJudgement/GetGraduationAnalysis?${data.type}=${data.id}&certificateId=${data.certificateId}`, {})
/* ------------------------------ 统计分析-学习跟踪------------------------------------- */
// 获取追踪学生信息   LearnToTrack
export const getLearnToTrackStudentInfo = (data) => http('/Api/LearnToTrack/LearnToTrackStudentInfo', data)
// 获取学习追踪总进度
export const getLearnToTrackList = (data) => http('/Api/LearnToTrack/LearnToTrackList', data)
// 获取学习追踪进度详情
export const getLearnToTrackDetails = (data) => http('/Api/LearnToTrack/LearnToTrackDetails', data)

/* ------------------------------ 考试分析-分析设置------------------------------------- */
// 创建培训项目考试分析设置
export const SettingExamAnalysis = (tpId, data) => http('/Api/ExamAnalysis/Setting?tpId=' + tpId, data, 'POST')
// 更新培训项目考试分析设置
export const UpdSettingExamAnalysis = (tpId, data) => http('/Api/ExamAnalysis/Setting?tpId=' + tpId, data, 'PUT')
// 获取培训项目考试分析设置
export const GetSettingExamAnalysis = (tpId) => http('/Api/ExamAnalysis/Setting?tpId=' + tpId, {})

/* ------------------------------ 考试分析-考试 合格率------------------------------------- */
// 获取项目课程考试合格率
export const getPercentOfPassByCourseId = (data) => http('/Api/QuestionPercentOfPass/PercentOfPassByCourseId', data)
/* ------------------------------ 考试分析-考试 成绩分析------------------------------------- */
// 获取项目课程考试合格率
export const getExamAnalyze = (data) => http('/Api/ExamResultAnalyze/ExamAnalyze', data)

/* ------------------------------ 学习分析-到课率分析------------------------------------- */
// 到直播到课率列表
export const GetLiveArrivalRateList = (data) => http('/Api/ArrivalRate/ArrivalRateLiveList', data)
// 到线下到课率列表
export const GetOfflineArrivalRateList = (data) => http('/Api/ArrivalRate/ArrivalRateOfflineList', data)
// 获取饼图到课率
export const gitAttendancePie = (data) => http('/Api/ArrivalRate/ArrivalRatePie', data)
// 获取到课率详情
export const GetArrivalRateDetail = (data) => http('/Api/ArrivalRate/Detail', data)
