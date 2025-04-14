Page({
  data: {
    historyList: []
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    const history = wx.getStorageSync('check_history') || [];
    const formattedHistory = history.map(item => ({
      ...item,
      formattedTime: this.formatTime(item.timestamp)
    }));

    this.setData({ historyList: formattedHistory });
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  // 查看详情（跳转到新页面）
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.historyList[index];
    wx.navigateTo({
      url: `/pages/historyDetail/historyDetail?id=${record.timestamp}`
    });
  },

  // 在 Page 对象中添加删除相关方法
  showDeleteModal(e) {
    const index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除记录'],
      itemColor: '#ff4d4f',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.deleteRecord(index);
        }
      }
    });
  },

  deleteRecord(index) {
    wx.showModal({
      title: '确认删除',
      content: '是否删除该记录？删除后不可恢复。',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          let history = wx.getStorageSync('check_history') || [];
          history.splice(index, 1);
          wx.setStorageSync('check_history', history);
          
          // 刷新列表
          this.loadHistory();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
}); 