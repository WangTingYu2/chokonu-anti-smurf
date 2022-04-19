import * as echarts from '../../../ec-canvas/echarts'
Page({
  data: {
    check_name:"",
    std:"",
    judge:"",
    ec: {
      lazyLoad: true
    },
    xlist: [],
    ylist:[],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let check_name = options.name
    let check_steam_id = options.steam_id
    let Game_mode = wx.getStorageSync('Game_mode')
    // console.log(check_name,check_steam_id)
    this.setData({
      check_name:check_name
    })
    if (Game_mode == 3){
      // console.log("游戏模式",Game_mode)
      wx.request({
        url: 'https://www.chokonu.top/api/solo?steam_id='+check_steam_id,
        method:'GET',
        success:(res) => {
          // console.log(res.data['data']);
          let grade_time_list = res.data['data'].reverse();
          // console.log('最后一个分数是：',grade_time_list[grade_time_list.length-1]['rating'])
          let now_rating = grade_time_list[grade_time_list.length-1]['rating'];
          let grade_list = [];
          let time_list = [];
          let time = [];
          let judge = ""
          for (var i = 0;i < grade_time_list.length;++i){
            grade_list.push(grade_time_list[i]['rating']);
            time = new Date(grade_time_list[i]['timestamp']*1000).Format('MM-dd')
            time_list.push(time);
          }
          // console.log("标准差",stdDeviation(grade_list));
          let std = stdDeviation(grade_list)
          if (0<now_rating  && now_rating<900) {
            console.log('你好',now_rating)
            if (std<32) {
              this.setData({
                judge: "该玩家可能不是炸鱼玩家。",
              })
            } else {
              this.setData({
                judge: "该玩家可能是炸鱼玩家。",
              })
            }
          } else if (900<now_rating  && now_rating<1200) {
            console.log("该玩家是9~12")
            if (std<42) {
              this.setData({
                judge: "该玩家可能不是炸鱼玩家。",
              })
            } else {
              this.setData({
                judge: "该玩家可能是炸鱼玩家。",
              })
            }
          } else if (1200<now_rating  && now_rating<1700) {
            console.log("该玩家是12~17")
            if (std<55) {
              this.setData({
                judge: "该玩家可能不是炸鱼玩家。",
              })
            } else {
              this.setData({
                judge: "该玩家可能是炸鱼玩家。",
              })
            }
          } else if (1700<now_rating  && now_rating<3000){
            console.log("该玩家是17~30")
            if (std<65) {
              this.setData({
                judge: "该玩家可能不是炸鱼玩家。",
              })
            } else {
              this.setData({
                judge: "该玩家可能是炸鱼玩家。",
              })
            }
          }
          
          this.oneComponent = this.selectComponent('#mychart-one');
          this.setData({
            xlist: time_list,
            ylist: grade_list,
            std: stdDeviation(grade_list)
          })
          this.init_one(this.data.xlist, this.data.ylist)
          
        }
      })
    }else{
      wx.request({
        url: 'https://www.chokonu.top/api/check?steam_id='+check_steam_id,
        method:'GET',
        success:(res) => {
          // console.log(res.data['data']);
          let grade_time_list = res.data['data'].reverse();
          // console.log('最后一个分数是：',grade_time_list[-1]['rating'])
          let grade_list = [];
          let time_list = [];
          let time = [];
          let judge = ""
          for (var i = 0;i < grade_time_list.length;++i){
            grade_list.push(grade_time_list[i]['rating']);
            time = new Date(grade_time_list[i]['timestamp']*1000).Format('MM-dd')
            time_list.push(time);
          }
          console.log("标准差",stdDeviation(grade_list));
          let std = stdDeviation(grade_list)
          if(std<80){
            this.setData({
              judge: "该玩家可能不是炸鱼玩家。",
            })
          }else{
            this.setData({
              judge: "该玩家可能是炸鱼玩家。",
            })
          }
          this.oneComponent = this.selectComponent('#mychart-one');
          this.setData({
            xlist: time_list,
            ylist: grade_list,
            std: stdDeviation(grade_list)
          })
          this.init_one(this.data.xlist, this.data.ylist)
          
        }
      })
    }
    
  },

  init_one: function (xdata, ylist) {           //初始化第一个图表
    console.log(this.oneComponent)
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, xdata, ylist)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

})

function setOption(chart, xlist, ylist) {
  var option = {
    grid: {
      left: '2%',
      right: '8%',
      bottom: '10%',
      containLabel: true,
      show:'true',
      borderWidth:'0'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xlist
    },
    yAxis: {
      type: 'value',
      min: ylist.min()-100,
    },
    series: [
      {
        name: '多人随机分数',
        type: 'line',
        data: ylist,
        smooth: true,
      }
    ]
  };
  chart.setOption(option);
};

function stdDeviation(arr) {
  let sd,
      ave,
      sum = 0,
      sums=0,
      len = arr.length;
  for (let i = 0; i < len; i++) {
      sum += Number(arr[i]);
  }
  ave = sum / len;
  for(let i = 0; i < len; i++){
      sums+=(Number(arr[i])- ave)*(Number(arr[i])- ave)
  }
  sd=(Math.sqrt(sums/len)).toFixed(4);
  return sd;
};

// 计算时间戳
Date.prototype.Format = function (fmt) {
  var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 求最小值
Array.prototype.min = function(){
  var min = this[0];
  var len = this.length;
  for (var i = 1;i<len;i++){
    if(this[i]<min){
      min = this[i];
    }
  }
  return min;
}