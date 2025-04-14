Page({
  // 页面的初始数据
  data: {
    // 检查基本信息
    checkInfo: {
      date: '',    // 检查日期
      time: '',    // 检查时间
      location: '', // 检查地点
    },
    // 检查问题列表
    questions: [
      {
        id: 1,
        title: "1. 是否落实安全生产运营单位法人第一责任、运营单位主体责任、作业人员岗位责任?",
        answer: null  // null表示未回答，true表示是，false表示否
      },
      {
        id: 2, 
        title: "2. 是否存在安全责任意识淡薄、关键岗位未到岗履职、安全管理制度缺失、安全监管力量不足、安全教育培训落实不到位等情况?",
        answer: null
      },
      {
        id: 3,
        title: "3. 运行监管岗位及专业力量配置是否满足要求?",
        answer: null
      },
      {
        id: 4,
        title: "4. 是否制定安全管理应急预案?",
        answer: null
      },
      {
        id: 5,
        title: "5. 是否制定安全管理应急预案?",
        answer: null
      },
      {
        id: 6,
        title: "6. 是否定期组织开展应急演练?",
        answer: null
      },
      {
        id: 7,
        title: "7. 工作环境安全、设备管理安全、档案材料是否完善?",
        answer: null
      },
      {
        id: 8,
        title: "8. 消防登记、车辆安全管理、烟火管制指示、有毒有害气体提示等安全标识是否完备?",
        answer: null
      },
      {
        id: 9,
        title: "9. 除臭设施、渗沥液收集设施管理是否规范?",
        answer: null
      },
      {
        id: 10,
        title: "10. 设备电路及电器是否存在零部件磨损、各元件损耗等安全隐患，开关、插座是否隔热防潮、有电线裸露现象?",
        answer: null
      },
      {
        id: 11,
        title: "11. 装卸作业区是否配备和使用车辆安全钢拉索，是否配备操作人员安全带?",
        answer: null
      },
      {
        id: 12,
        title: "12. 装卸作业区是否配备和使用车辆安全钢拉索, 是否配备栏杆防护设施。?",
        answer: null
      },
      {
        id: 13,
        title: "13. 装卸作业区作业人员是否按规范标准要求佩戴安全带?",
        answer: null
      },
      {
        id: 14,
        title: "14. 现场是否配备专职指挥人员?",
        answer: null
      },
      {
        id: 15,
        title: "15. 内部升降、压缩、润滑、操纵控制等系统及垃圾压缩箱密闭情况是否运行安全?",
        answer: null
      },
      {
        id: 16,
        title: "16. 内部升降、压缩、润滑、操纵控制等系统及垃圾压缩箱密闭情况是否定期开展检查并进行保养?",
        answer: null
      },
      {
        id: 17,
        title: "17. 内部升降、压缩、润滑、操纵控制等系统及垃圾压缩箱密闭情况，是否建立相关操作制度和工作台账?",
        answer: null
      },
      {
        id: 18,
        title: "18. 车辆停放是否规范?",
        answer: null
      },
      {
        id: 19,
        title: "19. 车辆档案管理是否完善?",
        answer: null
      },
      {
        id: 20,
        title: "20. 车容车貌是否整洁?",
        answer: null
      },
      {
        id: 21,
        title: "21. 车辆安全设施配备及维修保养是否到位、保险是否过期?",
        answer: null
      },
      {
        id: 22,
        title: "22. 车辆标识标牌是否清晰?",
        answer: null
      },
      {
        id: 23,
        title: "23. 驾驶员相关证件是否处于有效期?",
        answer: null
      },
      {
        id: 24,
        title: "24. 驾驶员是否有吸毒、酒驾等犯罪前科和经常因超速、不按规定行驶等受到交警处罚?",
        answer: null
      },
      {
        id: 25,
        title: "25. 针对垃圾卸料区、压缩作业区、渗沥液收集池等有限空间作业，是否按标准做好通风、照明检测及通信工作?",
        answer: null
      },
      {
        id: 26,
        title: "26. 针对垃圾卸料区、压缩作业区、渗沥液收集池等有限空间作业，是否开展密闭空间通风及有毒有害物质检测，是否按规定佩戴防护口罩等安全防护装备?",
        answer: null
      },
      {
        id: 27,
        title: "27. 是否制定中毒、窒息等事故应急救援预案，并按规定定期演练?",
        answer: null
      }
    ],
    overallRating: '', // 总体评级（A/B/C）
    remarks: '',        // 备注信息
    audioRecord: ''    // 录音文件路径
  },

  // 页面加载时初始化日期和时间
  onLoad() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // 设置初始时间
    this.setData({
      'checkInfo.date': date,
      'checkInfo.time': time
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
                'checkInfo.location': result.data.result.address
              });
            }
          }
        });
      },
      fail: () => {
        // 如果获取位置失败，设置一个默认值或提示用户
        this.setData({
          'checkInfo.location': '位置获取失败'
        });
      }
    });
  },

  // 日期选择器改变事件处理
  onDateChange(e) {
    this.setData({
      'checkInfo.date': e.detail.value
    });
  },

  // 时间选择器改变事件处理
  onTimeChange(e) {
    this.setData({
      'checkInfo.time': e.detail.value
    });
  },

  // 地点输入框改变事件处理
  onLocationInput(e) {
    this.setData({
      'checkInfo.location': e.detail.value
    });
  },

  // 问题答案选择处理
  onAnswer(e) {
    const {id, value} = e.currentTarget.dataset;
    const questions = this.data.questions;
    const question = questions.find(q => q.id === id);
    question.answer = value === 'true';
    this.setData({questions});
  },

  // 总体评级选择处理
  setRating(e) {
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

  // 提交检查结果
  submitCheck() {
    // 获取用户信息，添加默认值
    const app = getApp();
    const userInfo = app.globalData?.userInfo || {
      nickName: '未知用户',
      department: '未知部门'
    };

    // 验证地点是否已填写
    if(!this.data.checkInfo.location) {
      wx.showToast({
        title: '请输入检查地点',
        icon: 'none'
      });
      return;
    }

    // 验证所有问题是否已回答
    if(this.data.questions.some(q => q.answer === null)) {
      wx.showToast({
        title: '请回答所有问题',
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

    // 构造检查结果对象
    const checkResult = {
      type: 'siteCheck',
      checkInfo: this.data.checkInfo,
      questions: this.data.questions,
      overallRating: this.data.overallRating,
      remarks: this.data.remarks,
      audioRecord: this.data.audioRecord,
      timestamp: new Date().getTime(),
      recorder: {
        name: userInfo.nickName,
        department: userInfo.department
      }
    };

    // 获取并更新历史记录
    let history = wx.getStorageSync('check_history') || [];
    history.unshift(checkResult);  // 将新记录添加到历史记录开头
    wx.setStorageSync('check_history', history);

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  submitForm() {
    // 获取表单数据
    const formData = {
      // ... 您的表单数据
      timestamp: Date.now(),
      type: 'siteCheck'
    };

    // 获取已存在的历史记录
    let history = wx.getStorageSync('check_history') || [];
    // 添加新记录
    history.unshift(formData);
    // 保存回本地存储
    wx.setStorageSync('check_history', history);

    wx.showToast({
      title: '提交成功',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
}); 