Page({
  // 页面的初始数据
  data: {
    markerId: null,        // 当前标记点的唯一标识
    isEditing: false,      // 是否处于编辑状态
    markerInfo: {
      companyName: '',     // 公司名称
      companyType: '',     // 新增公司性质字段
      address: '',         // 公司地址
      contactName: '',     // 负责人姓名
      contactPhone: '',    // 负责人电话
      image: '',          // 现场照片的临时路径
      latitude: '',       // 标记点纬度
      longitude: ''       // 标记点经度
    }
  },

  // 页面加载时执行
  onLoad(options) {
    // 从路由参数中获取标记点信息
    const { id, lat, lng } = options;
    this.setData({ 
      markerId: id,
      'markerInfo.latitude': lat,
      'markerInfo.longitude': lng
    });
    
    // 加载已有的标记信息
    this.loadMarkerInfo(id);
  },

  // 从本地存储加载标记信息
  loadMarkerInfo(markerId) {
    const markers = wx.getStorageSync('map_markers') || [];
    const marker = markers.find(m => m.id === Number(markerId));
    if (marker && marker.info) {
      this.setData({
        markerInfo: { ...marker.info }
      });
    }
  },

  // 切换编辑状态
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 输入框内容变化处理函数
  onCompanyNameInput(e) {
    this.setData({ 'markerInfo.companyName': e.detail.value });
  },
  onAddressInput(e) {
    this.setData({ 'markerInfo.address': e.detail.value });
  },
  onContactNameInput(e) {
    this.setData({ 'markerInfo.contactName': e.detail.value });
  },
  onContactPhoneInput(e) {
    this.setData({ 'markerInfo.contactPhone': e.detail.value });
  },

  // 选择并上传图片
  chooseImage() {
    wx.chooseImage({
      count: 1,  // 最多可选择的图片张数
      success: (res) => {
        // 更新图片临时路径
        this.setData({
          'markerInfo.image': res.tempFilePaths[0]
        });
      }
    });
  },

  // 保存标记点信息
  saveInfo() {
    // 验证必填信息
    if (!this.validateInfo()) {
      return;
    }

    // 更新本地存储中的标记信息
    let markers = wx.getStorageSync('map_markers') || [];
    markers = markers.map(marker => {
      if (marker.id === Number(this.data.markerId)) {
        return {
          ...marker,
          info: this.data.markerInfo,
          callout: {
            ...marker.callout,
            content: this.data.markerInfo.companyName  // 更新地图上显示的名称
          }
        };
      }
      return marker;
    });

    // 保存到本地存储
    wx.setStorageSync('map_markers', markers);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        this.setData({ isEditing: false });
      }
    });
  },

  // 验证表单信息
  validateInfo() {
    const { companyName, companyType, contactName, contactPhone } = this.data.markerInfo;
    // 验证公司名称
    if (!companyName) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      });
      return false;
    }
    // 验证公司性质
    if (!companyType) {
      wx.showToast({
        title: '请输入公司性质',
        icon: 'none'
      });
      return false;
    }
    // 验证负责人姓名
    if (!contactName) {
      wx.showToast({
        title: '请输入负责人姓名',
        icon: 'none'
      });
      return false;
    }
    // 验证负责人电话
    if (!contactPhone) {
      wx.showToast({
        title: '请输入��责人电话',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  // 删除当前标记点
  deleteMarker() {
    wx.showModal({
      title: '删除标记',
      content: '确定要删除该标记点吗？此操作不可恢复。',
      confirmText: '确定删除',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 从本地存储中删除标记
          let markers = wx.getStorageSync('map_markers') || [];
          markers = markers.filter(marker => marker.id !== Number(this.data.markerId));
          wx.setStorageSync('map_markers', markers);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            success: () => {
              // 返回上一页并刷新地图
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2]; // 获取上一个页面
              if (prevPage) {
                prevPage.setData({ markers: markers }); // 更新地图标记
              }
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          });
        }
      }
    });
  },

  // 添加公司性质输入处理方法
  onCompanyTypeInput(e) {
    this.setData({ 'markerInfo.companyType': e.detail.value });
  }
}); 