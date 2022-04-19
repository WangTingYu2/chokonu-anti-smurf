// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DataList:[
      {username:'某人',steam_id:'76561198289402838'},
      {username:'某人',steam_id:'76561198804174646'},
      {username:'某人',steam_id:'76561199226711789'},
      {username:'某人',steam_id:'76561199209126928'}
    ]
  },

  gotoLogs:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },

  gotoregister:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },

  specification:function(){
    wx.navigateTo({
      url: '../specification/specification',
    })
  },

  visitor:function(){
    wx.navigateTo({
      url: '../new_visitor/new_visitor',
    })
  },

  check_player(e){
    let username = e.currentTarget.dataset.text.username
    let steam_id = e.currentTarget.dataset.text.steam_id
    console.log("name:",username,"steam_id:",steam_id)
    wx.navigateTo({
      url: '../checkplayer/detail/detail?name='+username+'&steam_id='+steam_id,
    })
  },
})