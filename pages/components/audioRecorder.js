Component({
  data: {
    isRecording: false,
    audioPath: '',
    recorderManager: null,
    audioContext: null
  },

  lifetimes: {
    attached() {
      this.recorderManager = wx.getRecorderManager();
      this.audioContext = wx.createInnerAudioContext();
      
      this.recorderManager.onStop((res) => {
        this.setData({
          audioPath: res.tempFilePath
        });
        this.triggerEvent('recordComplete', { audioPath: res.tempFilePath });
      });
    }
  },

  methods: {
    toggleRecording() {
      if (!this.data.isRecording) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },

    startRecording() {
      this.recorderManager.start({
        duration: 600000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3'
      });
      this.setData({ isRecording: true });
    },

    stopRecording() {
      this.recorderManager.stop();
      this.setData({ isRecording: false });
    },

    playAudio() {
      if (this.data.audioPath) {
        this.audioContext.src = this.data.audioPath;
        this.audioContext.play();
      }
    },

    deleteAudio() {
      this.setData({ audioPath: '' });
      this.triggerEvent('recordDelete');
    }
  }
}); 