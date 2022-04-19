let steam_id = ""

Page({
    data: {
      UserInfoList:[],
      time:"",
  },


  // 点击获取玩家信息
  PlayWithWho(){
    let username = wx.getStorageSync('nickname')
    console.log('已获得用户名',username)
    const db = wx.cloud.database()
    var that = this
    db.collection('chokonu').where({
      nickname:username
    }).get({
      success:res=>{
        // console.log(res.data[0].steam_id)
        steam_id = res.data[0].steam_id
        console.log("获得的steam_id",steam_id)
        this.setData({
          steam_id:res.data[0].steam_id
        })
        wx.request({
          url: 'https://www.chokonu.top/api/with',
          method:'GET',
          data:{
            steam_id:steam_id
          },
          success:(res) => {
            console.log(res.data['data']['last_match']);
            var datetime = this.formatDate((res.data['data']['last_match']['started'])*1000)
            var Game_mode = res.data['data']['last_match']['leaderboard_id']
            wx.setStorageSync('Game_mode', Game_mode)
            // console.log(datetime)
            this.setData({
              UserInfoList:res.data['data']['last_match']['players'],
              time:datetime,
              animation: "scale-up"
            })
          }
        })
      }
    })
   
    var that = this;
    that.setData({
      toggleDelay: true
    })
    setTimeout(function() {
      that.setData({
        toggleDelay: false,
      })
    }, 4000)
  },

  toggle(e) {
    console.log(e);
    var anmiaton = e.currentTarget.dataset.class;
    var that = this;
    that.setData({
      animation: anmiaton
    })
    setTimeout(function() {
      that.setData({
        animation: ''
      })
    }, 1000)
  },

  check_player(e){
    let username = e.currentTarget.dataset.text.name
    let steam_id = e.currentTarget.dataset.text.steam_id
    console.log("name:",username,"steam_id:",steam_id)
    wx.navigateTo({
      url: '../checkplayer/detail/detail?name='+username+'&steam_id='+steam_id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  formatDate: function (inputTime){
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
   },
})