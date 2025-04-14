Page({
  // 页面的初始数据
  data: {
    // 访谈基本信息
    interviewInfo: {
      date: '',          // 访谈日期
      time: '',          // 访谈时间
      location: '',      // 访谈地点
      interviewee: '',   // 受访人姓名
      position: ''       // 受访人职务
    },
    // 访谈问题列表
    questions: [
      {
        id: 1,
        title: "1. 在企业全员安全生产责任制中所在岗位的责任范围有哪些，安全考核标准是什么",
        rating: null  // null表示未评级，可选值：'A'/'B'/'C'
      },
      {
        id: 2,
        title: "2. 《广东省安全生产条例》中，生产经营单位发现存在重大安全风险的，应该怎么做？",
        rating: null
      },
      {
        id: 3,
        title: "3. 《广东省安全生产条例》中，生产经营单位应当对哪种从业人员进行专门的安全生产教育和培训？",
        rating: null
      },
      {
        id: 4,
        title: "4. 国家发布的52份重大事故隐患判定标准，与本企业相关的有哪几份？根据标准，企业研判分析出来的风险点危险源和重点检查事项有哪些？",
        rating: null
      },
      {
        id: 5,
        title: "5. 你的岗位通常对照重大事故隐患判定标准哪些情形进行排查？",
        rating: null
      },
      {
        id: 6,
        title: "6. 四川自贡“7·17”火灾事故要吸取哪些教训，对自身岗位加强火灾防范有什么启示?",
        rating: null
      },
      {
        id: 7,
        title: "7. “开平市4·30八一垃圾中转站清洁工失联事故”要吸取哪些教训，对自身岗位加强安全防范有什么启示?",
        rating: null
      },
      {
        id: 8,
        title: "8. 高温来袭，如何做好防火、防爆、防线路负荷过重等安全防范措施？",
        rating: null
      },
      {
        id: 9,
        title: "9. 本人所在岗位是否涉及特种作业或危险作业？持有哪种证书，有哪些作业要求？",
        rating: null
      },
      {
        id: 10,
        title: "10. 本人最近开展过哪种特种作业或危险作业？当时做了哪些防护措施？",
        rating: null
      },
      {
        id: 11,
        title: "11. 你是否与外包员工一起参加过安全培训（举例哪些培训）？",
        rating: null
      },
      {
        id: 12,
        title: "12. 企业对外包外租项目多久开展一次安全检查，曾被检查出哪些隐患问题？",
        rating: null
      },
      {
        id: 13,
        title: "13. 如果你的岗位发生安全生产事故，初期如何处置减少事故的扩大和恶化？",
        rating: null
      },
      {
        id: 14,
        title: "14. 今年企业有没有开展疏散逃生演练，你所在岗位的避险逃生路线是什么？（描述或绘制）",
        rating: null
      },
      {
        id: 15,
        title: "15. 今年以来身边有哪些险情经历？",
        rating: null
      },
      {
        id: 16,
        title: "16. 企业有没有建立隐患报告奖励机制？实名还是匿名？奖励标准如何划分？",
        rating: null
      },
      {
        id: 17,
        title: "17. 今年以来身边有哪些违反安全管理制度被处罚或发现风险隐患被奖励的情况？",
        rating: null
      },
      {
        id: 18,
        title: "18. 所在岗位觉得企业安全生产投入在哪些方面比较有成效？举例（员工安全相关保险、技能培训等）",
        rating: null
      },
      {
        id: 19,
        title: "19. 本企业或本岗位有什么比较好的安全技术手段或管理措施，可以推广学习的？",
        rating: null
      },
      {
        id: 20,
        title: "20. 本企业或本岗位对于安全生产工作有什么建议意见或需要帮扶解决的地方？",
        rating: null
      }
    ],
    overallRating: '',  // 总体评级
    remarks: '',         // 备注信息
    audioRecord: ''  // 添加录音文件路径
  },

  // 页面加载时初始化日期和时间
  onLoad() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // 设置初始时间
    this.setData({
      'interviewInfo.date': date,
      'interviewInfo.time': time
    });

    // 获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 使用微信的逆地理编码接口
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: `${res.latitude},${res.longitude}`,
            key: 'YOUR_KEY' // 需要替换为实际的腾讯地图key
          },
          success: (result) => {
            if (result.data && result.data.result) {
              this.setData({
                'interviewInfo.location': result.data.result.address
              });
            }
          }
        });
      },
      fail: () => {
        // 如果获取位置失败，设置一个默认值或提示用户
        this.setData({
          'interviewInfo.location': '位置获取失败'
        });
      }
    });
  },

  // 日期选择器变化处理
  onDateChange(e) {
    this.setData({
      'interviewInfo.date': e.detail.value
    });
  },

  // 时间选择器变化处理
  onTimeChange(e) {
    this.setData({
      'interviewInfo.time': e.detail.value
    });
  },

  // 地点输入框变化处理
  onLocationInput(e) {
    this.setData({
      'interviewInfo.location': e.detail.value
    });
  },

  // 受访人姓名输入处理
  onIntervieweeInput(e) {
    this.setData({
      'interviewInfo.interviewee': e.detail.value
    });
  },

  // 受访人职务输入处理
  onPositionInput(e) {
    this.setData({
      'interviewInfo.position': e.detail.value
    });
  },

  // 问题评级选择处理
  setQuestionRating(e) {
    const {id, rating} = e.currentTarget.dataset;
    const questions = this.data.questions;
    const question = questions.find(q => q.id === id);
    question.rating = rating;
    this.setData({questions});
  },

  // 总体评级选择处理
  setOverallRating(e) {
    this.setData({
      overallRating: e.currentTarget.dataset.rating
    });
  },

  // 备注输入处理
  onRemarksInput(e) {
    this.setData({
      remarks: e.detail.value
    });
  },

  // 添加录音相关方法
  onRecordComplete(e) {
    const audioPath = e.detail.audioPath;
    this.setData({
      audioRecord: audioPath
    });
  },

  onRecordDelete() {
    this.setData({
      audioRecord: ''
    });
  },

  // 提交访谈结果
  submitInterview() {
    // 获取用户信息，添加默认值
    const app = getApp();
    const userInfo = app.globalData?.userInfo || {
      nickName: '未知用户',
      department: '未知部门'
    };

    // 验证必填信息是否完整
    if(!this.data.interviewInfo.location || 
       !this.data.interviewInfo.interviewee || 
       !this.data.interviewInfo.position) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 验证所有问题是否已评级
    if(this.data.questions.some(q => q.rating === null)) {
      wx.showToast({
        title: '请完成所有评级',
        icon: 'none'
      });
      return;
    }

    // 验证是否已选择总体评级
    if(!this.data.overallRating) {
      wx.showToast({
        title: '请选择总体评级',
        icon: 'none'
      });
      return;
    }

    // 构造访谈结果对象
    const interviewResult = {
      type: 'interview',
      interviewInfo: this.data.interviewInfo,
      questions: this.data.questions,
      overallRating: this.data.overallRating,
      remarks: this.data.remarks,
      audioRecord: this.data.audioRecord,  // 添加录音文件
      timestamp: new Date().getTime(),
      recorder: {
        name: userInfo.nickName,
        department: userInfo.department
      }
    };

    // 获取并更新历史记录
    let history = wx.getStorageSync('check_history') || [];
    history.unshift(interviewResult);  // 将新记录添加到历史记录开头
    wx.setStorageSync('check_history', history);

    // 显示提交成功提示并跳转到历史记录页面
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
}); 