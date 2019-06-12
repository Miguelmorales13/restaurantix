import { AGet } from "../Helpers/Api";
import { isSuperSu } from "../Helpers/TokenValid";
import { managementErrors } from "../Helpers/Globales";
const shops = {
    namespaced: true,
    state: {
        shops: [],
        loader:true,
        selectedShop: {}
    },
    mutations: {
        LIST(state, shops) {
            state.shops = shops
        },
        ADD(state, shop) {
            state.shops = [...state.shops, shop]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, shop) {
            const newShops = state.shops.filter(s => s._id !== shop._id)
            state.shops = [...newShops, shop]
        },
        REMOVE(state, shop) {
            state.shops = state.shops.filter(s => s._id !== shop._id)
        },
        SET(state, shop) {
            state.selectedShop = Object.assign({}, shop ? shop : {})
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (!isSuperSu()) return
            if (state.shops.length <= 0) {
                try {
                    const res = await AGet('shops')
                    commit('LIST', [...res.data, { _id: null, name: 'Todos' }])
                    commit('SET_SHOP', res.data[0]._id, { root: true })
                } catch (error) {
                    managementErrors(error)
                } finally {
                  commit('LOADER',false)
                }
            }
        },
        async getForce({ state, commit }) {
            if (!isSuperSu()) return
            commit('LOADER',true)
            try {
                const res = await AGet('shops')
                commit('LIST', [...res.data, { _id: null, name: 'Todos' }])
                commit('SET_SHOP', res.data[0]._id, { root: true })
            } catch (error) {
                managementErrors(error)
            } finally {
              commit('LOADER',false)
            }
        }
    }
}
// mutations
// export const LIST = 'LIST'
// export const ADD = 'ADD'
// export const UPDATE = 'UPDATE'
// export const REMOVE = 'REMOVE'
// export const SET = 'SET'

// actions
// export const GET_ = 'GET_'

// getters
// usersIsAuth()

export default shops
