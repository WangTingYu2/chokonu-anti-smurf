const DB = wx.cloud.database().collection("chokonu")
let nickname = ""
let steam_id = ""
let password = ""

Page({
  data: {
    nickname:"",
    password:"",
    steam_id:""
  },

  onLoad: function (options) {

  },
// 收集玩家的注册信息——昵称、steam_id和密码
  addSteamId(event){
    steam_id = event.detail.value
  },
  addPassWord(event){
    password = event.detail.value
  },
  addNickName(event){
    nickname = event.detail.value
  },

  // 添加用户资料
  addData(){
    var that = this
    this.setData({
      nickname:nickname,
      password:password,
      steam_id:steam_id
    })
    console.log(nickname)

    DB.get({
      success:(res)=> {
        let userlist = res.data;  //获取到的对象数组数据
        console.log(userlist.length);
        let dont = "false";
        for (let i=0; i<userlist.length; i++){  //遍历数据库对象集合
          // console.log('第',i,userlist[i].nickname)
          if (that.data.nickname === userlist[i].nickname){
            wx.showModal({
              title: '温馨提示：',
              content:'该用户已存在',
              showCancel:false
            })
            dont = "true";
            break;
          }else if(that.data.steam_id === userlist[i].steam_id){
            wx.showModal({
              title: '温馨提示：',
              content:'该steam_id已存在',
              showCancel:false
            })
            dont = "true";
            break;
          }
          
        };
        if (dont === "true"){
          console.log("错了")
        }else{
          if (that.data.nickname.length == 0 || that.data.steam_id.length == 0 || that.data.password == 0) {
            wx.showModal({
              title: '温馨提示：',
              content:'个人信息有残缺',
              showCancel:false
            })
          } 
          else {
            DB.add({
            data:{
              nickname : nickname,
              steam_id : steam_id,
              password : password,
            },
          })
          wx.navigateTo({
            url: '../login/login',
          })
        }
        }
      }
    })
  },
})