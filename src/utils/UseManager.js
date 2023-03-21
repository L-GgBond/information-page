import { ref, reactive } from 'vue'
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { showModal, toast } from "~/utils/common"
import { logout } from '~/api/manager'

export function useLogout() {
    const router = useRouter()
    const store = useStore()
    function handleLogout() {
        showModal("是否要退出登录？").then(res => {
            // logout().finally(() => {
                store.dispatch("logout")
                // 跳转回登录页
                router.push("/login")
                // 提示退出登录成功
                toast("退出登录成功")
            // })
        })
    }

    return {
        handleLogout
    }
}