class HistoryRoute{
    constructor(){
        this.current=null;
    }
}

class VueRouter{
    constructor(opts){
        this.mode=opts.mode || 'hash';
        this.routes=opts.routes;
        
        this.history =new HistoryRoute();
        this.routesMap={};
        this.creatRoutesMap(this.routes);
        this.init();
    }
    init(){
        
        if(this.mode=='hash'){
            location.hash?"":location.hash="/";
            window.addEventListener('load',()=>{
                this.history.current=location.hash.slice(1);  
            })
            window.addEventListener('hashchange',()=>{     //监听url改变事件
                this.history.current=location.hash.slice(1);   //修改current
            })
        }else{//history模式充分利用 history.pushState API 来完成URL 跳转而无须重新加载页面
            location.pathname?"":location.pathname='/';
            window.addEventListener('load',()=>{
                this.history.current=location.pathname;
            });
            window.addEventListener('popstate',()=>{
                this.history.current=location.pathname;
            })
        }
    }

    creatRoutesMap(routes){
        routes.forEach(item=>{
            this.routesMap[item.path]=item.component;
        })
    }

}

VueRouter.install=function install (Vue){
console.log("install")
    Vue.mixin({//混入生命周期
        
        beforeCreate(){
            if(this.$options && this.$options.router){
                this._root=this;
                this._router=this.$options.router;
                console.log(this._router)
                Vue.util.defineReactive(this,'current',this._router.history)  //设置监听者
            }else{
                this._root=this.$parent._root;
            }
            console.log("mixin")
        }
    })

    Vue.component('router-view',{
        
        render(h){

            let current2=this._self._root._router.history.current;
           
            let routeMap=this._self._root._router.routesMap
          
            let component=routeMap[current2];  //获取新组件
            return h(component)
        }
    })
}

export default VueRouter;
