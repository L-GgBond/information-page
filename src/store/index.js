import { createStore } from 'vuex'
import { login,getinfo,getUserInfo } from '~/api/manager'
import { setToken,removeToken } from '~/utils/auth'
const store = createStore({
    state() {
        return {
            user: {},
            token_authorization:null,
            asideWidth:"250px",
            menus:[],
            ruleNames:[],
            menuList: [],
            permList: [],
            hasRoutes: [],
            editableTabsValue: 'Index',
            editableTabs: [{
                title: '首页',
                name: 'Index',
            }]
        }
    },
    mutations: {
        SET_hasRoutes(state){
            state.hasRoutes = []
        },
        SET_Authorization(state,authorization){
            state.token_authorization = authorization
        },
        // 记录用户信息
        SET_USERINFO(state,user){
            state.user = user
        },
        // 展开/缩起侧边
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "50px" : "250px"
        },
        SET_ROUTER(state, nav) {
            state.hasRoutes = nav
		},
        SET_MENUS(state, menus) {
            state.menus = menus
		},
        SET_RULENAMES(state,ruleNames){
            state.ruleNames = ruleNames
        },

		changeRouteStatus(state, hasRoutes) {
			state.hasRoutes = hasRoutes
		}
    },
    actions:{
        // 登录
        login({ commit }, { username,password,type}){
            return new Promise((resolve,reject)=>{
                login(username,password,type).then(res=>{
                    setToken(this.state.token_authorization)
                    resolve(res)
                }).catch(err=>reject(err))
            })
        },
        // 退出登录
        logout({ commit }){
            // 移除cookie里的token
            removeToken()
            // 清除当前用户状态 vuex
            commit("SET_USERINFO",{})
            // commit("SET_hasRoutes",{})
        },
        getinfo({ commit }){
            return new Promise((resolve,reject)=>{
                getinfo().then(res=>{
                    commit("SET_MENUS",res.data.nav)
                    commit("SET_RULENAMES",res.data.authoritys)
                    resolve(res.data)
                }).catch(err=>reject(err))
            })
        },
        getUserInfo({ commit }){
            return new Promise((resolve,reject)=>{
                getUserInfo().then(res=>{
                    commit("SET_USERINFO",res.data)
                    resolve(res.data)
                
                   
                }).catch(err=>{
                    console.log(err.code)
                        // store.dispatch("logout")
                    reject(err)
                    // if(err.code){
                        
                    // }
                })
            })
        },
    }
})

export default store