const db = wx.cloud.database()//必须有
const _ = db.command//这个有时需要用到，比如数据的自增、自减时
const DB = wx.cloud.database().collection("technology_tree")
// const DB = wx.cloud.database().collection("product_info")
const app = getApp()

Page({
  data: {
    country_list:[
      {country:"阿兹特克",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_aztecs.png"},
      {country:"埃塞俄比亚",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_ethiopians_pressed.png"},
      {country:"柏柏尔",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_berber.png"},
      {country:"勃艮第",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_burgundians.png"},
      {country:"拜占庭",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_byzantines.png"},
      {country:"不列颠",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_britons.png"},
      {country:"保加利亚",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_bulgarians.png"},
      {country:"波兰",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_poles.png"},
      {country:"波西米亚",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_bohemians.png"},
      {country:"波斯",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_persians.png"},
      {country:"鞑靼",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_tatars.png"},
      {country:"法兰克",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_franks_pressed.png"},
      {country:"高丽",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_koreans.png"},
      {country:"高棉",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_khmer.png"},
      {country:"哥特",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_goths.png"},
      {country:"凯尔特",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_celts.png"},
      {country:"库曼",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_cumans.png"},
      {country:"立陶宛",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_lithuanians.png"},
      {country:"马来",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_malay.png"},
      {country:"马里",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_malians.png"},
      {country:"马扎尔",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_magyars.png"},
      {country:"玛雅",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_mayans.png"},
      {country:"蒙古",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_mongols.png"},
      {country:"缅甸",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_burmese.png"},
      {country:"葡萄牙",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_portuguese.png"},
      {country:"日本",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_japanese.png"},
      {country:"萨拉森",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_saracens.png"},
      {country:"斯拉夫",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_slavs.png"},
      {country:"条顿",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_teutons.png"},
      {country:"土耳其",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_turks.png"},
      {country:"维京",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_vikings.png"},
      {country:"西班牙",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_spanish.png"},
      {country:"西西里",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_sicilians.png"},
      {country:"匈奴",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_huns.png"},
      {country:"意大利",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_italians.png"},
      {country:"印度",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_indians.png"},
      {country:"印加",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_inca.png"},
      {country:"越南",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_vietnamese.png"},
      {country:"中国",logo:"cloud://laikeds-6n91k.6c61-laikeds-6n91k-1300553978/images/civ_logo/menu_techtree_chinese.png"},
      {country:"",logo:""},

    ],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,


    // 垂直导航
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    build:[],
    load: true
    // 垂直导航 完


  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    // console.log("tabSelect已运行",e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  country_option:function(event){
    // console.log("按钮country已运行")
    var that=this
    var id = event.currentTarget.dataset.id
    var civ_name = this.data.country_list[id].country
    console.log(civ_name)
    
    db.collection("technology_tree").where({
      country:civ_name
    }).get().then(res=>{
      console.log(res.data[0].building)
      this.setData({
        build:res.data[0].building,
        list:res.data[0].building,
        load:true
      })
    }).catch(err=>{
      console.log(err)
    })
    wx.showToast({
      title: '切换民族！', // 标题
      icon: 'success',  // 图标类型，默认success
      duration: 1500  // 提示窗停留时间，默认1500ms
    })
  },

  // 垂直导航
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    // console.log("tabSelect已运行")
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    // console.log("data",data)
    if (this.data.load) { // 问题出在此处，view=……这段代码只运行一次，然后不再运行，所以出现了数据重新获取之后功能失灵的结果
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().in(this).select("#main-" + list[i].id);
        console.log("view:",view.fields)
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height; //获取不到data.height
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    // console.log("scrollTop=",scrollTop,"中间的list",list[1].top)
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        // console.log("scrollTop已运行","下面的list",list[1].top)
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
// 获取兵种/科技名称，并弹出窗口
  getProduct(e){
    // console.log(e.currentTarget.dataset.text)
    let product_name = e.currentTarget.dataset.text
    db.collection("product_info").where({
      product_name:product_name
    }).get().then(res=>{
      // console.log(res.data[0].info)
      this.setData({
        the_name:res.data[0].product_name,
        the_info:res.data[0].info,
        image:res.data[0].image,
      })
    }).catch(err=>{
      console.log(err)
    })
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  // 弹出窗口
  hidetheInfo(e) {
    this.setData({
      modalName: null
    })
  },
})
