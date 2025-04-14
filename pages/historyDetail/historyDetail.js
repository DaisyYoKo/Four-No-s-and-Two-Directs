Page({
  data: {
    record: null,
    formattedTime: '',
    audioList: [],  // 存储录音列表
    isPlaying: false,
    currentAudioIndex: -1
  },

  onLoad(options) {
    const { id } = options;
    const history = wx.getStorageSync('check_history') || [];
    const record = history.find(item => item.timestamp === Number(id));
    
    if (record) {
      // 将单个录音转换为录音列表格式
      let audioList = [];
      if (record.audioRecord) {
        audioList.push({
          path: record.audioRecord,
          duration: '未知'  // 可以添加获取录音时长的逻辑
        });
      }

      this.setData({
        record,
        audioList,
        formattedTime: this.formatTime(record.timestamp)
      });

      // 初始化音频播放器
      this.audioContext = wx.createInnerAudioContext();
      this.audioContext.onEnded(() => {
        this.setData({ 
          isPlaying: false,
          currentAudioIndex: -1
        });
      });
    }
  },

  onUnload() {
    // 页面卸载时停止播放并销毁音频上下文
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy();
    }
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  // 播放录音
  playAudio(e) {
    const index = e.currentTarget.dataset.index;
    const audioPath = this.data.audioList[index].path;

    if (this.data.isPlaying && this.data.currentAudioIndex === index) {
      // 如果点击的是当前正在播放的录音，则停止播放
      this.audioContext.stop();
      this.setData({ 
        isPlaying: false,
        currentAudioIndex: -1
      });
    } else {
      // 播放新的录音
      this.audioContext.src = audioPath;
      this.audioContext.play();
      this.setData({ 
        isPlaying: true,
        currentAudioIndex: index
      });
    }
  },

  // 删除录音
  deleteAudio(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: '是否删除该录音？',
      success: (res) => {
        if (res.confirm) {
          // 停止当前播放
          if (this.data.isPlaying) {
            this.audioContext.stop();
          }

          // 更新录音列表
          const newAudioList = [...this.data.audioList];
          newAudioList.splice(index, 1);

          // 更新存储
          const history = wx.getStorageSync('check_history') || [];
          const updatedHistory = history.map(item => {
            if (item.timestamp === this.data.record.timestamp) {
              return {
                ...item,
                audioRecord: newAudioList[0]?.path || ''  // 更新为剩余的录音或清空
              };
            }
            return item;
          });

          wx.setStorageSync('check_history', updatedHistory);

          // 更新页面状态
          this.setData({
            audioList: newAudioList,
            isPlaying: false,
            currentAudioIndex: -1
          });
        }
      }
    });
  },

  // 删除记录
  deleteRecord() {
    wx.showModal({
      title: '确认删除',
      content: '是否删除该记录？删除后不可恢复。',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          // 获取历史记录
          let history = wx.getStorageSync('check_history') || [];
          // 删除当前记录
          history = history.filter(item => item.timestamp !== Number(this.data.record.timestamp));
          // 更新存储
          wx.setStorageSync('check_history', history);
          
          wx.showToast({
            title: '已删除',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                // 返回上一页
                wx.navigateBack();
              }, 1500);
            }
          });
        }
      }
    });
  }
}); 