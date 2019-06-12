import { AGet } from "../Helpers/Api";
import { isSuperSu, getAnyUser } from '@/Helpers/TokenValid'
import { managementErrors } from "../Helpers/Globales";
const tables = {
    namespaced: true,
    state: {
        tables: [],
        loader:true,
        selectedTable: {}
    },
    mutations: {
        LIST(state, tables) {
            state.tables = tables
        },
        ADD(state, table) {
            state.tables = [...state.tables, table]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, table) {
            const newTables = state.tables.filter(s => s._id !== table._id)
            state.tables = [...newTables, table]
        },
        REMOVE(state, table) {
            state.table = state.tables.filter(s => s._id !== table._id)
        },
        SET(state, table) {
            state.selectedTable = Object.assign({}, table ? table : {})
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (state.tables.length <= 0) {
              commit('LOADER',true)
                try {
                    const res = await AGet('tables')
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
                  const res = await AGet('tables')
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
        },
        setStatusTable({ state, commit }, _id, status) {
            commit('LIST', state.tables.map(t => {
                return t._id !== _id ? t : { ...t, status }
            }))
        }
    },
    getters:{
        orderByName(state){
            return [...state.tables].sort((a,b)=>parseInt(a.number)-parseInt(b.number) )
        }
    }
}
export default tables
