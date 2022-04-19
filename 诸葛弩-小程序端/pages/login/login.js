const DB = wx.cloud.database().collection("chokonu")
let nickname = ""
let password = ""

Page({
  data: {
    nickname:"",
    password:"",
  },

  onLoad: function (options) {

  },

  checkPassWord(event){
    password = event.detail.value
  },
  checkNickName(event){
    nickname = event.detail.value
  },

  tologin(){
    var that = this
    let flag = false 
    this.setData({
      nickname:nickname,
      password:password
    })
    
    console.log('你好',nickname)
    DB.get({
      success:(res)=> {
        let userlist = res.data;  //获取到的对象数组数据
        // console.log(userlist);
        for (let i=0; i<userlist.length; i++){  //遍历数据库对象集合
          // console.log('第',i)
          if (that.data.nickname === userlist[i].nickname && password === userlist[i].password){ //用户名存在
            flag = true
            console.log("用户名存在")
            break;
          }
        }
        if(flag == true){
          wx.showToast({
          title: '登陆成功！',
          icon: 'success',
          duration: 2500
          })
          wx.setStorageSync('nickname', nickname)
          wx.navigateTo({
            url: '../index/index',
          })
        }else{
          wx.showModal({
            title:'用户名或密码错误',
            showCancel:false
          })
        }
      }
    })
  },
  
  onLoad() {
  }
})
