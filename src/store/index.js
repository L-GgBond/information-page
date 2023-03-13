import { createStore } from 'vuex'
import { login,getinfo } from '~/api/manager'
import { setToken,removeToken } from '~/utils/auth'
const store = createStore({
    state() {
        return {
            // 用户信息
            user: {},
            token_authorization:null,
            // 侧边宽度
            asideWidth:"250px",

            menus:[],
            ruleNames:[],

            menuList: [],
            permList: [],

            hasRoutes: false,

            editableTabsValue: 'Index',
            editableTabs: [{
                title: '首页',
                name: 'Index',
            }]
        }
    },
    mutations: {
        //authorization
        SET_Authorization(state,authorization){
            state.token_authorization = authorization
        },
        // 记录用户信息
        SET_USERINFO(state,user){
            state.user = user
        },
        // 展开/缩起侧边
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
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
                    console.log('res',res)
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
        },
        getinfo({ commit }){
            return new Promise((resolve,reject)=>{
                getinfo().then(res=>{
                    commit("SET_MENUS",res.nav)
                    commit("SET_RULENAMES",res.authoritys)
                    resolve(res)
                }).catch(err=>reject(err))
            })
        },
    }
})

export default store