import { MENU_LIST } from '../mutations'

function getMatchMenu(menuList, currentMenuName) {
  let node = null // 获取的子节点
  let code = 'label' //  匹配的属性
  let children = 'children' //  包含子节点的属性
  /*
   * 根据 NodeID 查找当前节点以及父节点
   * json    数据源
   * nodeId  匹配的值
   */
  let getNode = (json, nodeName) => {
    for (let i = 0; i < json.length; i++) {
      let obj = json[i]
      if (!nodeName) break
      if (!obj || !obj[code]) continue
      if (obj[code] === nodeName) {
        node = obj
        break
      } else {
        if (obj[children]) {
          getNode(obj[children], nodeName)
        } else {
          continue
        }
      }
    }
    return node
  }
  return getNode(menuList, currentMenuName)
}
const state = {
  list: [
    // 基础数据平台
    {
      moduleName: '基础平台',
      menuList: [
        {
          index: '1',
          label: '数据字典',
          children: [
            { index: '1-1', label: '数据字典管理', path: '/data/list/item' }
          ]
        },
        {
          index: '2',
          label: '基础数据',
          children: [
            { index: '2-1', label: '学校信息', path: '/school/list' },
            { index: '2-2', label: '专业信息', path: '/profession/list' },
            { index: '2-3', label: '学年学期', path: '/academicYear/semester' },
            { index: '2-4', label: '课程信息', path: '/course/list' },
            { index: '2-5', label: '楼栋信息', path: '/building/list' },
            { index: '2-6', label: '教室管理', path: '/site/list' },
            {
              index: '2-7',
              label: '毕业要求证书类型',
              path: '/certificate/type/list'
            }
          ]
        },
        {
          index: '3',
          label: '统一身份管理',
          children: [
            { index: '3-1', label: '用户管理', path: '/user/list' },
            { index: '3-2', label: '角色管理', path: '/role/list' }
          ]
        },
        {
          index: '4',
          label: '排课设置',
          children: [
            { index: '4-1', label: '作息时间', path: '/daily/schedule' },
            { index: '4-2', label: '教学日程', path: '/teaching/schedule' }
          ]
        },
        {
          index: '5',
          label: '资源库设置',
          children: [
            {
              index: '5-1',
              label: '全局设置',
              path: '/resource/globalsetting'
            },
            { index: '5-2', label: '资源库搭建', path: '/resource/list' },
            { index: '5-3', label: '资源库授权', path: '/resource/auth' }
          ]
        },
        {
          index: '6',
          label: '消息推送',
          children: [
            { index: '6-1', label: '短信余量统计', path: '/message/setting' },
            { index: '6-2', label: '短信充值记录', path: '/msg/recharge/list' }
          ]
        },
        {
          index: '7',
          label: '流量管理',
          children: [
            { index: '7-1', label: '流量充值及账单', path: '/flow/setting' },
            { index: '7-2', label: '流量充值记录', path: '/flow/recharge/list' }
          ]
        }
        // {index: '8', label: '微信公众号配置', children: [
        //     {index: '8-1', label: '微信公众号配置', path: '/wechat/configuration'}
        // ]},
      ]
    },
    // 报名录取系统
    {
      moduleName: '报名录取',
      menuList: [
        {
          index: '1',
          label: '学习项目',
          children: [
            { index: '1-1', label: '项目管理', path: '/training/project' }
          ]
        },
        {
          index: '2',
          label: '报名管理',
          children: [
            { index: '2-1', label: '报名管理', path: '/registration/list' }
          ]
        },
        {
          index: '3',
          label: '录取管理',
          children: [
            { index: '3-1', label: '报名审核', path: '/admission/list' }
          ]
        },
        {
          index: '4',
          label: '缴费管理',
          children: [
            { index: '4-1', label: '缴费管理', path: '/pay/list' },
            { index: '4-2', label: '缴费查询', path: '/pay/search/list' }
          ]
        },
        {
          index: '5',
          label: '分班管理',
          children: [
            { index: '5-1', label: '分班管理', path: '/divide/classes' },
            { index: '5-2', label: '报名数据', path: '/student/files' }
          ]
        },
        {
          index: '6',
          label: '住宿管理',
          children: [
            { index: '6-1', label: '酒店管理', path: '/accommodation/hotel' },
            { index: '6-2', label: '客房管理', path: '/accommodation/hotel/room' },
            { index: '6-3', label: '住宿分配', path: '/accommodation/distribution' },
            { index: '6-4', label: '住宿统计', path: '/accommodation/statistics' }
          ]
        },
        {
          index: '7',
          label: '就餐管理',
          children: [
            { index: '7-1', label: '食堂管理', path: '/dining/canteen' },
            { index: '7-2', label: '就餐券管理', path: '/dining/meal-ticket' },
            { index: '7-3', label: '就餐分配', path: '/dining/distribution' },
            { index: '7-4', label: '就餐统计', path: '/dining/statistics' }
          ]
        }
      ]
    },
    // 在线培训系统
    {
      moduleName: '在线学习',
      menuList: [
        {
          index: '1',
          label: '资源库管理',
          children: [
            { index: '1-1', label: '资源维护', path: '/repository/list' },
            {
              index: '1-2',
              label: '资源审批',
              path: '/repository/approval/list'
            },
            {
              index: '1-3',
              label: '资源监管',
              path: '/repository/supervision/list'
            }
          ]
        },
        {
          index: '2',
          label: '课程组装',
          children: [
            {
              index: '2-1',
              label: '知识点管理',
              path: '/knowledgePoints/list'
            },
            { index: '2-2', label: '课程组装', path: '/courseassembly/list' }
          ]
        },
        {
          index: '3',
          label: '学习项目',
          children: [
            { index: '3-1', label: '项目排课', path: '/program/schedule' }
          ]
        },
        {
          index: '6',
          label: '直播教学',
          children: [
            { index: '6-1', label: '直播课堂管理', path: '/liveTeaching/list' }
          ]
        },
        {
          index: '4',
          label: '考勤管理',
          children: [
            { index: '4-1', label: '在线考勤', path: '/attendance/code' },
            { index: '4-2', label: '考勤管理', path: '/attendance/list' }
          ]
        },
        // {
        //   index: '5',
        //   label: '评价管理',
        //   children: [
        //     { index: '5-1', label: '评价指标', path: '/evaluating/indicator' },
        //     { index: '5-2', label: '评价管理', path: '/evaluating/list' },
        //     { index: '5-3', label: '在线评价', path: '/online/evaluation/list' }
        //   ]
        // }
      ]
    },
    // 在线考试系统
    {
      moduleName: '在线考试',
      menuList: [
        {
          index: '1',
          label: '基础设置',
          children: [
            // {index: '1-1', label: '全局设置', path: '/paper/globalSetting'},
            { index: '1-2', label: '题库目录管理', path: '/question/directory' }
          ]
        },
        {
          index: '2',
          label: '试题管理',
          children: [
            { index: '2-1', label: '试题管理', path: '/question/list' },
            { index: '2-2', label: '试题审核', path: '/question/check' }
          ]
        },
        {
          index: '3',
          label: '试卷管理',
          children: [
            { index: '3-1', label: '组卷策略', path: '/assemble/strategy' },
            { index: '3-2', label: '在线组卷', path: '/examinationPaper/list' }
          ]
        },
        {
          index: '4',
          label: '考试管控',
          children: [
            {
              index: '4-1',
              label: '考试安排',
              path: '/examination/arrangement/list'
            },
            {
              index: '4-2',
              label: '补考安排',
              path: '/examination/makeup/list'
            }
          ]
        },
        // {index: '5', label: '阅卷管理', children: [
        //     {index: '5-1', label: '阅卷管理', path: '/marking/paper/list'}
        // ]},
        {
          index: '6',
          label: '成绩管理',
          children: [
            // {index: '6-1', label: '成绩单构成', path: '/performance/compose/paper'},
            {
              index: '6-2',
              label: '成绩管理',
              path: '/performance/examination/list'
            },
            {
              index: '6-3',
              label: '成绩查询',
              path: '/performance/search/list'
            }
          ]
        }
        // {index: '7', label: '毕业管理', children: [
        //     {index: '7-1', label: '毕业判定条件', path: '/graduation/judgement/list'},
        //     {index: '7-2', label: '毕业管理', path: '/graduation/list'}
        // ]},
      ]
    },
    // 毕业管理
    {
      moduleName: '毕业管理',
      menuList: [
        {
          index: '2',
          label: '毕业设置',
          children: [
            {
              index: '2-1',
              label: '全局设置',
              path: '/graduation/setting/global'
            },
            {
              index: '2-2',
              label: '毕业要求',
              path: '/graduation/setting/requirements'
            }
          ]
        },
        {
          index: '1',
          label: '毕业管理',
          children: [
            {
              index: '1-1',
              label: '毕业判定条件',
              path: '/graduation/judgement/list'
            },
            { index: '1-2', label: '毕业管理', path: '/graduation/list' }
          ]
        },
        {
          index: '3',
          label: '证书管理',
          children: [
            {
              index: '3-1',
              label: '技能证书管理',
              path: '/graduation/certificate/skill'
            },
            {
              index: '3-2',
              label: '毕业证书管理',
              path: '/graduation/certificate/diploma'
            },
            {
              index: '3-3',
              label: '证书发放',
              path: '/graduation/certificate/issuance'
            }
          ]
        },
        {
          index: '4',
          label: '学生档案',
          children: [
            { index: '4-1', label: '学生档案', path: '/student/files/list' }
          ]
        },
        {
          index: '5',
          label: '佐证材料',
          children: [
            // { index: '5-1', label: '佐证栏目', path: '/evidence/column/list' },
            {
              index: '5-2',
              label: '佐证材料',
              path: '/evidence/materials/list'
            }
            // {index: '5-3', label: '补贴管理', path: '/subsidy/management/list'},
          ]
        }
      ]
    },
    // 统计分析系统
    {
      moduleName: '统计分析',
      menuList: [
        {
          index: '1',
          label: '项目分析',
          children: [
            {
              index: '1-1',
              label: '报名分析',
              path: '/registration/analysis/charts'
            },
            {
              index: '1-2',
              label: '毕业分析',
              path: '/graduation/analysis/charts'
            }
          ]
        },
        {
          index: '2',
          label: '学习分析',
          children: [
            {
              index: '2-1',
              label: '学习跟踪',
              path: '/learning/tracking/list'
            },
            {
              index: '2-2',
              label: '到课率分析',
              path: '/learning/attendance/list'
            }
          ]
        },
        {
          index: '3',
          label: '考试分析',
          children: [
            {
              index: '3-1',
              label: '分析设置',
              path: '/examination/analysis/setting'
            },
            {
              index: '3-2',
              label: '成绩分析',
              path: '/performance/analysist/list'
            },
            {
              index: '3-3',
              label: '考试合格率',
              path: '/examination/rate/list'
            }
          ]
        }
        // {
        // 	index: '4',
        //   label: '资源统计',
        //   children: [
        //     {
        //       index: '4-1',
        //       label: '用户上传统计',
        //       path: '/resource/upload/statistics'
        //     },
        //     {
        //       index: '4-2',
        //       label: '资源分类统计',
        //       path: '/resource/classification/statistics'
        //     }
        //   ]
        // },
        // {
        //   index: '5',
        //   label: '直通统计',
        //   children: [
        //     {
        //       index: '5-1',
        //       label: '直播数据分析',
        //       path: '/live/data/statistics'
        //     },
        //     { index: '5-2', label: '直播费用流水', path: '/live/fee/flow' }
        //   ]
        // },
        // {
        //   index: '6',
        //   label: '消费统计',
        //   children: [
        //     {
        //       index: '6-1',
        //       label: '消费明细',
        //       path: '/consumption/statistics/list'
        //     },
        //     { index: '6-2', label: '发票管理', path: '/invoice/list' }
        //   ]
        // }
      ]
    }
  ],
  activeModuleName: '',
  activeMenuIndex: '-1',
  activeMenuName: ''
}

const getters = {
  // 模块名数组
  modules: () => {
    return state.list.map(item => item.moduleName)
  },
  // 获取相应模块下的菜单列表
  menuList: () => {
    let current = state.list.filter(
      item => item.moduleName === state.activeModuleName
    )
    return current.length ? current[0].menuList : []
  }
}

const mutations = {
  // 设置当前的模块名
  [MENU_LIST.SET_ACTICE_MODULE_NAME](state, moduleName) {
    state.activeModuleName = moduleName
  },
  // 设置当前菜单的index
  [MENU_LIST.SET_ACTICE_MENU_INDEX](state, menuIndex) {
    state.activeMenuIndex = menuIndex
  },
  // 设置当前菜单的name，设置index
  [MENU_LIST.SET_ACTICE_MENU_NAME](state, menuName) {
    state.activeMenuName = menuName

    // 设置当前菜单的index
    let menuList = getters.menuList()
    let current = getMatchMenu(menuList, state.activeMenuName)
    if (current === null) return // 未找到相应菜单
    state.activeMenuIndex = current.index
  }
}

export default {
  state,
  getters,
  mutations
}
