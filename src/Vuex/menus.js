import { AGet } from "../Helpers/Api";
import { isSuperSu, getAnyUser } from "../Helpers/TokenValid";
import { managementErrors } from "../Helpers/Globales";
const menus = {
    namespaced: true,
    state: {
        menus: [],
        loader:true,
        selectedMenu: {}
    },
    mutations: {
        LIST(state, menus) {
            state.menus = menus
        },
        ADD(state, menu) {
            state.menus = [...state.menus, menu]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, menu) {
            const newMenus = state.menus.filter(s => s._id !== menu._id)
            state.menus = [...newMenus, menu]
        },
        REMOVE(state, menu) {
            state.menus = state.menus.filter(s => s._id !== menu._id)
        },
        SET(state, menu) {
            state.selectedMenu = Object.assign({}, menu ? menu : { menu: [{ plate: "", observation: "", cantidad: 0 }] })
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (state.menus.length <= 0) {
              commit('LOADER',true)
                try {
                    const res = await AGet('menus')
                    if (isSuperSu()) {
                        commit('LIST', res.data)
                    } else {
                        commit('LIST', res.data.filter(item => item._shop && item._shop._id && (item._shop._id === getAnyUser('_shop._id'))))
                    }
                    commit('SET')
                } catch (error) {
                    managementErrors(error)
                } finally {
                  commit('LOADER',false)
                }
            }
        },
        async getForce({ state, commit }) {
          commit('LOADER',true)
            try {
                const res = await AGet('menus')
                if (isSuperSu()) {
                    commit('LIST', res.data)
                } else {
                    commit('LIST', res.data.filter(item => item._shop && item._shop._id && (item._shop._id === getAnyUser('_shop._id'))))
                }
                commit('SET')
            } catch (error) {
                managementErrors(error)
            } finally {
              commit('LOADER',false)
            }
        }
    },
    getters:{
      getIsActive(state){
        return state.menus.filter(m=>m.status==='Activo')
      }
    }
}
export default menus
