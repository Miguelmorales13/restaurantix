import { AGet } from "../Helpers/Api";
import { isSuperSu } from "../Helpers/TokenValid";
import { managementErrors } from "../Helpers/Globales";
const categories = {
    namespaced: true,
    state: {
        categories: [],
        loader: true,
        selectedCategori: {}
    },
    mutations: {
        LIST(state, categories) {
            state.categories = categories
        },
        ADD(state, categori) {
            state.categories = [...state.categories, categori]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, categori) {
            const newCategories = state.categories.filter(s => s._id !== categori._id)
            state.categories = [...newCategories, categori]
        },
        REMOVE(state, categori) {
            state.categories = state.categories.filter(s => s._id !== categori._id)
        },
        SET(state, categori) {
            state.selectedCategori = Object.assign({}, categori ? categori : {})
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (state.categories.length <= 0) {
                try {
                    const res = await AGet('categories')
                    commit('LIST', [...res.data])
                } catch (error) {
                    managementErrors(error)
                } finally {
                    commit('LOADER', false)
                }
            }
        },
        async getForce({ state, commit }) {
            commit('LOADER', true)
            try {
                const res = await AGet('categories')
                commit('LIST', [...res.data])
            } catch (error) {
                managementErrors(error)
            } finally {
                commit('LOADER', false)
            }
        }
    }
}
export default categories
