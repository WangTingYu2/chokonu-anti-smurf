let user_name = ""
Page({
  data: {
    SameNameList:[],
    user_name:"",
  },

  get_steam_id(event){
    user_name = event.detail.value
  },

  experience:function(){
    wx.request({
      url: 'https://www.chokonu.top/api/user',
      method:'GET',
      data:{
        user_name:user_name
      },
      success:(res) => {
        console.log(res.data.data.data);
        this.setData({
          SameNameList:res.data.data.data
        })
      }
    })
  },

  go_player(e){
    // let username = e.currentTarget.dataset.text.name
    let steam_id = e.currentTarget.dataset.text.steam_id
    wx.navigateTo({
      url: '../visitor/visitor?steam_id='+steam_id,
    })
  }


})