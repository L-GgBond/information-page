import { createStore } from 'vuex'
import {
    setToken,
    removeToken
} from '~/utils/auth'
const store = createStore({
    state() {
        return {
            // 用户信息
            user: {},

            // 侧边宽度
            asideWidth:"250px",

            menus:[],
            ruleNames:[]
        }
    },
    mutations: {
        // 记录用户信息
        SET_USERINFO(state,user){
            state.user = user
        },
        // 展开/缩起侧边
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        },
        SET_MENUS(state,menus){
            state.menus = menus
        },
        SET_RULENAMES(state,ruleNames){
            state.ruleNames = ruleNames
        }
    },
    actions:{
        // 退出登录
        logout({ commit }){
            // 移除cookie里的token
            removeToken()
            // 清除当前用户状态 vuex
            commit("SET_USERINFO",{})
        }
    }
})

export default store