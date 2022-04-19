Page({
  onLoad: function (options) {
    let data = ""
    
    wx.request({
      url: 'https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=76561198962785360&count=60',
      method:'GET',
      success:(res) => {
        console.log(res.data[0]);
        this.setData({
          data:res.data[0]['rating']
        })
      }
    })
  },
})
