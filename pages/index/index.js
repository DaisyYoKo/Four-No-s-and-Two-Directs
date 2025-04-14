// index.js
// 默认头像URL
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  // 页面初始数据
  data: {
    userInfo: {
      nickName: '张三',          // 用户昵称
      avatarUrl: '',            // 用户头像URL
      department: '执法一科'     // 用户所属部门
    },
    longitude: 113.122506,      // 地图初始经度
    latitude: 23.009366,        // 地图初始纬度
    scale: 14,                  // 地图缩放级别
    markers: [],                 // 地图标记点数组
    searchKeyword: '',      // 搜索关键词
    searchResults: [],      // 搜索结果
    showSearchResult: false // 是否显示搜索结果
  },

  // 页面加载时执行
  onLoad: function() {
    // 获取用户当前位置
    wx.getLocation({
      type: 'gcj02',  // 返回可用于wx.openLocation的坐标
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      }
    });
    
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.userInfo.avatarUrl,
          'userInfo.nickName': res.userInfo.nickName
        });
      }
    });

    // 读取保存的标记
    const savedMarkers = wx.getStorageSync('map_markers') || [];
    this.setData({ markers: savedMarkers });
  },

  // 搜索框输入处理
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ 
      searchKeyword: keyword,
      showSearchResult: true
    });
    this.searchMarkers(keyword);
  },

  // 搜索标记点
  searchMarkers(keyword) {
    if (!keyword.trim()) {
      this.setData({ 
        searchResults: [],
        showSearchResult: false
      });
      return;
    }

    const markers = wx.getStorageSync('map_markers') || [];
    const results = markers.filter(marker => {
      const info = marker.info || {};
      return (
        // 搜索公司名称
        (info.companyName && info.companyName.toLowerCase().includes(keyword.toLowerCase())) ||
        // 搜索公司性质
        (info.companyType && info.companyType.toLowerCase().includes(keyword.toLowerCase())) ||
        // 搜索地址
        (info.address && info.address.toLowerCase().includes(keyword.toLowerCase())) ||
        // 搜索负责人
        (info.contactName && info.contactName.toLowerCase().includes(keyword.toLowerCase())) ||
        // 搜索标记点显示的名称
        (marker.callout && marker.callout.content && marker.callout.content.toLowerCase().includes(keyword.toLowerCase()))
      );
    });

    this.setData({ searchResults: results });
  },

  // 点击搜索结果项
  onSearchResultTap(e) {
    const markerId = e.currentTarget.dataset.id;
    const marker = this.data.markers.find(m => m.id === markerId);
    if (marker) {
      // 将地图中心移动到该标记点
      this.setData({
        latitude: marker.latitude,
        longitude: marker.longitude,
        scale: 16, // 放大地图
        showSearchResult: false,
        searchKeyword: ''
      });
    }
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: '',
      searchResults: [],
      showSearchResult: false
    });
  },

  // 地图点击事件处理
  onMapTap: function(e) {
    // 仅在点击空白处时添加标记
    if (!e.markerId) {
      const { latitude, longitude } = e.detail;
      wx.showModal({
        title: '添加标记',
        content: '是否在此处添加标记点？',
        confirmText: '确认添加',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            const newMarker = {
              id: Date.now(),
              latitude,
              longitude,
              width: 30,
              height: 30,
              callout: {
                content: '新标记点',
                padding: 10,
                borderRadius: 5,
                display: 'ALWAYS'
              }
            };
            
            const newMarkers = [...this.data.markers, newMarker];
            this.setData({ markers: newMarkers });
            wx.setStorageSync('map_markers', newMarkers);
            
            // 直接跳转到点位信息页面
            wx.navigateTo({
              url: `/pages/markerInfo/markerInfo?id=${newMarker.id}&lat=${latitude}&lng=${longitude}`
            });
          }
        }
      });
    }
  },

  // 标记点点击事件处理
  onMarkerTap: function(e) {
    const markerId = e.markerId;
    const marker = this.data.markers.find(m => m.id === markerId);
    
    // 检查标记点是否有完整信息
    if (!marker.info || !marker.info.companyName || !marker.info.contactName || !marker.info.contactPhone) {
      wx.showModal({
        title: '提示',
        content: '该标记点信息不完整，是否现在完善信息？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/markerInfo/markerInfo?id=${markerId}&lat=${marker.latitude}&lng=${marker.longitude}`
            });
          } else {
            // 用户选择不完善信息，直接删除该标记点
            this.deleteIncompleteMarker(markerId);
          }
        }
      });
      return;
    }
    
    // 如果信息完整，直接跳转到详情页
    wx.navigateTo({
      url: `/pages/markerInfo/markerInfo?id=${markerId}&lat=${marker.latitude}&lng=${marker.longitude}`
    });
  },

  // 在页面显示时检查未完善的标记点
  onShow: function() {
    // 读取所有标记点
    let markers = wx.getStorageSync('map_markers') || [];
    
    // 过滤掉未完善信息的标记点
    const completeMarkers = markers.filter(marker => 
      marker.info && 
      marker.info.companyName && 
      marker.info.contactName && 
      marker.info.contactPhone
    );
    
    // 如果有标记点被过滤掉，更新存储和显示
    if (completeMarkers.length < markers.length) {
      this.setData({ markers: completeMarkers });
      wx.setStorageSync('map_markers', completeMarkers);
    }
  },

  // 删除不完整的标记点
  deleteIncompleteMarker(markerId) {
    const newMarkers = this.data.markers.filter(marker => marker.id !== markerId);
    this.setData({ markers: newMarkers });
    wx.setStorageSync('map_markers', newMarkers);
    wx.showToast({
      title: '已删除未完善的标记',
      icon: 'none'
    });
  },

  // 清除所有标记的方法 - 当前按钮已隐藏，但功能保留
  clearAllMarkers: function() {
    wx.showModal({
      title: '清除所有标记',
      content: '确定要清除所有标记点吗？此操作将删除所有点位信息且不可恢复。',
      confirmText: '确定清除',
      confirmColor: '#ff4d4f',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 二次确认
          wx.showModal({
            title: '再次确认',
            content: '请再次确认是否删除所有标记点？',
            confirmText: '确定删除',
            confirmColor: '#ff4d4f',
            cancelText: '取消',
            success: (secondRes) => {
              if (secondRes.confirm) {
                // 执行删除操作
                this.setData({ markers: [] });
                wx.setStorageSync('map_markers', []);
                wx.showToast({
                  title: '已清除所有标记',
                  icon: 'success'
                });
              }
            }
          });
        }
      }
    });
  },

  // 建议添加单个删除方法，方便后续使用
  deleteMarker: function(markerId) {
    const newMarkers = this.data.markers.filter(marker => marker.id !== markerId);
    this.setData({ markers: newMarkers });
    wx.setStorageSync('map_markers', newMarkers);
  },

  // 长按地图添加标记
  onMapLongPress(e) {
    const { latitude, longitude } = e;
    wx.showModal({
      title: '添加标记',
      content: '是否在此处添加标记？',
      success: (res) => {
        if (res.confirm) {
          const newMarker = {
            id: Date.now(),
            latitude,
            longitude,
            width: 30,
            height: 30,
            callout: {
              content: '新标记',
              padding: 10,
              borderRadius: 5,
              display: 'ALWAYS'
            }
          };
          
          const newMarkers = [...this.data.markers, newMarker];
          this.setData({ markers: newMarkers });
          // 保存到本地存储
          wx.setStorageSync('map_markers', newMarkers);
        }
      }
    });
  }
});
