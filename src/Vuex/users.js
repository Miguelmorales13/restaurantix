
import { AGet } from "../Helpers/Api";
import { isSuperSu, getAnyUser } from "../Helpers/TokenValid";
import { managementErrors } from "../Helpers/Globales";

const users = {
    namespaced: true,
    state: {
        users: [],
        loader:true,
        selectedUser: {}
    },
    mutations: {
        LIST(state, users) {
            state.users = [...users]
        },
        ADD(state, user) {
            state.users = [...state.users, user]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, user) {
            const newUsers = state.users.filter(s => s._id !== user._id)
            state.users = [...newUsers, user]
        },
        REMOVE(state, user) {
            state.users = state.users.filter(s => s._id !== user._id)
        },
        SET(state, user) {
            state.selectedUser = Object.assign({}, user ? user : { })
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (state.users.length <= 0) {
              commit('LOADER',true)
                try {
                    const res = await AGet('users')
                    if (isSuperSu()) {
                        commit('LIST', res.data)
                    } else {
                        commit('LIST', res.data.filter(item => item._shop && item._shop._id && (item._shop._id === getAnyUser('_shop._id'))))
                    }
                    commit('SET')
                } catch (error) {
                    managementErrors(error)
                }finally {
                  commit('LOADER',false)
                }

            }
        },
        async getForce({ state, commit }) {
            commit('LOADER',true)
              try {
                  const res = await AGet('users')
                  if (isSuperSu()) {
                      commit('LIST', res.data)
                  } else {
                      commit('LIST', res.data.filter(item => item._shop && item._shop._id && (item._shop._id === getAnyUser('_shop._id'))))
                  }
                  commit('SET')
              } catch (error) {
                  managementErrors(error)
              }finally {
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
// export const SET_VIEW = 'SET_VIEW'

// actions
// getAll()

// getters
// usersIsAuth()

export default users
