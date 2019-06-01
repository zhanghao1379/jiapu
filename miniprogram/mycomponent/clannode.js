//const service = new App.ClansmanService();
const ClansmanEntity=App.ClansmanEntity;

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * Component properties
   */
  properties: {
    "clansman":Object

    
  },
  
  /**
   * Component initial data
   */
  data: {

  }, 
  pageLifetimes:{
    show: function () {
      const clansman = this.data.clansman;
      if (clansman) {
        this.loadData(clansman);
      }
     }
  },
  lifetimes:{
    attached:function(){
      const clansman = this.data.clansman;
      if (clansman) {
        this.loadData(clansman);
      }
    }
  },
 
  /**
   * Component methods
   */
  methods: {
    handleMainNodeTap:function(evt){
       let nodeId=evt.target.dataset.id;
     
      wx.navigateTo({
         url: '/pages/clansman/mod/mod-main?id='+nodeId
       });
    },
    handleMateNodeTap:function(evt){
      let nodeId = evt.target.dataset.id;
      wx.navigateTo({
     
        url: '/pages/clansman/mod/mod-mate?id=' + nodeId
      });
    },
    loadData: function (clansman) {
        clansman=ClansmanEntity.of(clansman);
        let nodeOrderClass = "";
        //无哥哥姐姐
      if (clansman.childOrder==0) {
          nodeOrderClass += " first-child";

        }
        //无弟弟妹妹
      if (clansman.nextSiblingId === null) {
          nodeOrderClass += " last-child";
        }
      if (clansman.previousSiblingId === null && clansman.nextSiblingId === null) {
          nodeOrderClass += " only-child";
        }
        this.setData({
           nodeOrderClass: nodeOrderClass
        });
        //加载配偶

      clansman.loadMates().then(mates=>{
        this.setData({
          mates: mates
        });
      }); 
      //加载子女 
      clansman.loadChildren().then(children => {
           console.log("children",children);
           this.setData({ children });
        }).catch(e=>{
          console.log(e);
        });
    }
  }
});

 
