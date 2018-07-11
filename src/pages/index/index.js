import initCalendar, { getSelectedDay, jumpToToday, jumpToDay, setDayMsg} from '../../template/calendar/index';
const conf = {
  onShow: function() {
    initCalendar({
      afterTapDay: (currentSelect, allSelectedDays) => {
        // console.log('当前点击的日期', currentSelect);
        // allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        // console.log('getSelectedDay方法', getSelectedDay());
        setDayMsg(currentSelect);
      }
    });

    //旋转动画
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'linear',
    })

    this.animation = animation

    animation.rotate(180).step()

    this.setData({
      animationData: animation.export()
    })
    var n = 1;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      // animation.translateY(-60).step()
      n = n + 1;
      this.animation.rotate(180 * (n)).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 2000)
  },
  jump() {
    jumpToToday();
  },
  data : {
    animationData : '',
    msg : '加油！',
    date : '',
    initialDate : "2018-07-12",
    dialogHidden : true,
    msgInput : '',
    msgInputFocus : false
  },
  leftBtnClick() {
    const day = getSelectedDay()[0];
    if(day.status != 'holiday'){
      let holiday = wx.getStorageSync('holidayList') || [];
      const timestamp = new Date(day.year,day.month-1,day.day).getTime();
      let work = wx.getStorageSync('workList') || [];
      if (work.indexOf(timestamp) >= 0) {
        const index = work.indexOf(timestamp);
        work.splice(index, 1);
        wx.setStorageSync('workList', work);
      } else {
        holiday.push(timestamp);
        wx.setStorageSync('holidayList', holiday);
      }
      day.status = 'holiday';
      jumpToDay(day);
    }
  },
  rightBtnClick() {
    const day = getSelectedDay()[0];
    if (day.status == 'holiday') {
      let holiday = wx.getStorageSync('holidayList') || [];
      const timestamp = new Date(day.year, day.month - 1, day.day).getTime();
      let work = wx.getStorageSync('workList') || [];
      if (holiday.indexOf(timestamp) >= 0) {
        const index = holiday.indexOf(timestamp);
        holiday.splice(index, 1);
        wx.setStorageSync('holidayList', holiday);
      } else {
        work.push(timestamp);
        wx.setStorageSync('workList', work);
      }
      day.status = 'work';
      jumpToDay(day);
    }
  },
  bindDateChange(e){
    const initialDate = e.detail.value;
    this.setData({
      'initialDate': initialDate
    })
    wx.setStorageSync('initialDate', new Date((initialDate + " 00:00:00").replace(/\-/g, "/")).getTime());
    jumpToDay(getSelectedDay()[0]);    
  },
  openDialog(){
    this.setData({
      dialogHidden : !this.data.dialogHidden,
      msgInputFocus : true
    });
  },
  dialogCancel(){
    this.setData({
      dialogHidden: true,
      msgInputFocus: false
    })
  },
  dialogConfirm(){
    this.setData({
      dialogHidden : true,
      msgInputFocus: false,
      msg: this.data.msgInput
    });
    const day = getSelectedDay()[0];
    const timestamp = (new Date(day.year, day.month - 1, day.day).getTime()).toString();
    const key = "msg." + timestamp;
    wx.setStorageSync(key, this.data.msgInput);
  },
  msgInputEvent(e){
    this.setData({
      msgInput : e.detail.value
    })
  }
};
Page(conf);
