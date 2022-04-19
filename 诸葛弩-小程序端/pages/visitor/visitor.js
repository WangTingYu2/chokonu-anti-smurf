let steam_id = ""
Page({
  data: {
    steam_id:"",
    UserInfoList:[],
    time:"",
    auto_steam_id:""
  },

  onLoad: function (options) {
    let auto_steam_id = options.steam_id
    this.setData({
      auto_steam_id:auto_steam_id
    })
  },

  get_steam_id(event){
    steam_id = event.detail.value
    console.log('获取steam_id并自动填充',steam_id)
  },

  experience:function(event){
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
        console.log(datetime)
        this.setData({
          UserInfoList:res.data['data']['last_match']['players'],
          time:datetime,
          animation: "scale-up"
        })
      }
    })
  },

  check_player(e){
    let username = e.currentTarget.dataset.text.name
    let steam_id = e.currentTarget.dataset.text.steam_id
    // let game_mode = res.data['data']['last_match']['leaderboard_id']
    
    console.log("name:",username,"steam_id:",steam_id)
    wx.navigateTo({
      url: '../checkplayer/detail/detail?name='+username+'&steam_id='+steam_id,
    })
  },

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