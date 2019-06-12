import { AGet } from "../Helpers/Api";
import { isSuperSu, getAnyUser } from "../Helpers/TokenValid";
import moment from "moment";
import { managementErrors } from "../Helpers/Globales";
const orders = {
    namespaced: true,
    state: {
        orders: [],
        ordersChef:[],
        loader:true,
        selectedOrder: {}
    },
    mutations: {
        LIST(state, orders) {
            state.orders = orders
        },
        LIST_CHEF(state, orders) {
            state.ordersChef = orders.map(o=>{
                return {
                    done:false,
                    _id:o._id,
                    after:o
                }
            })
        },
        ADD(state, order) {
            state.orders = [...state.orders, order]
        },
        ADD_CHEF(state, order) {
            state.ordersChef = [...state.ordersChef, {done:false,_id:order._id,after:order}]
        },
        LOADER(state, loader) {
            state.loader = loader
        },
        UPDATE(state, order) {
            const newOrders = state.orders.filter(s => s._id !== order._id)
            state.orders = [...newOrders, order]
        },
        UPDATE_CHEF(state, order) {
            const before = state.ordersChef.find(s => s._id === order._id)
            
            const newOrders = state.ordersChef.filter(s => s._id !== order._id)
            state.ordersChef = [...newOrders, {
                done:false,
                _id:order._id,
                before:before.after,
                after:order
            }]
        },
        SET_DONE_CHEF(state, order) {
            const newOrders = state.ordersChef.filter(s => s._id !== order._id)
            state.ordersChef = [...newOrders, {
                done:true,
                _id:order._id,
                after:order
            }]
        },
        REMOVE_CHEF(state, order) {
            state.ordersChef = state.ordersChef.filter(s => s._id !== order._id)
        },
        REMOVE(state, order) {
            state.orders = state.orders.filter(s => s._id !== order._id)
        },
        SET(state, order) {
            state.selectedOrder = Object.assign({}, order ? order : { menu: [] })
        }
    },
    actions: {
        async getAll({ state, commit }) {
            if (state.orders.length <= 0) {
              commit('LOADER',true)
                try {
                    const res = await AGet('orders')
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
                const res = await AGet('orders')
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
        async getInProcess({ state, commit }) {
          commit('LOADER',true)
            try {
                const res = await AGet('orders/process')
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
        async getInProcessChef({ state, commit }) {
          commit('LOADER',true)
            try {
                const res = await AGet('orders/process')
                commit('LIST_CHEF', res.data.filter(item => item._shop && item._shop._id && (item._shop._id === getAnyUser('_shop._id'))))
                commit('SET')
            } catch (error) {
                managementErrors(error)
            }finally {
              commit('LOADER',false)
            }
        }
    },
    getters:{
        getListComplete(state){
            const states= state.ordersChef.map( order => {
                if (order.before) {
                    const  menu=order.after.menu.map(plate=>{
                        const platee=order.before.menu.find(p=>p.plate===plate.plate)
                        if (!platee) {
                            return plate
                        } else {
                            if (plate.cantidad>platee.cantidad) {
                                return {...plate,cantidad:plate.cantidad-platee.cantidad}
                            } else {
                                return null
                            }
                        }
                    }).filter(p=>p!==null)
                    return {done:order.done,new:false,order:{...order.after,menu}}
                }else{
                    return {done:order.done,new:true,order:order.after}
                }
            })
            return states.filter(e=>!e.done).sort((a, b) => {
                const aa = new Date(a.order.updatedAt),
                  bb = new Date(b.order.updatedAt);
                return aa.getTime() - bb.getTime();
              })
            
        },
        getTotalWeek(state,_,globalState){
            if (state.orders.length === 0) return 0
            return state.orders.filter( order=>{
                const initDate =  moment().weekday(-7).format('YYYY-MM-DD'), lastDate = moment().weekday(0).format('YYYY-MM-DD')
                return moment(order.createdAt, 'YYYY-MM-DD').isBetween(initDate, lastDate) && (!isSuperSu() ? order._shop._id === getAnyUser('_shop._id') : globalState.shopActive === order._shop._id || !globalState.shopActive)
            }).map(order=>order.total).reduce((before,after)=>before+after,0)
        },
        getTotalWeekThis(state,_,globalState){
            if (state.orders.length === 0) return 0
            return state.orders.filter( order=>{
                const initDate =  moment().weekday(0).format('YYYY-MM-DD'), lastDate = moment().weekday(7).format('YYYY-MM-DD')
                return moment(order.createdAt, 'YYYY-MM-DD').isBetween(initDate, lastDate) && (!isSuperSu() ? order._shop._id === getAnyUser('_shop._id') : globalState.shopActive === order._shop._id || !globalState.shopActive)
            }).map(order=>order.total).reduce((before,after)=>before+after,0)
        },
        getTotalDay(state, _, globalState){
            if (state.orders.length === 0) return 0
            const hoy = moment(new Date()).format("MM-DD-YYYY")
            return state.orders.filter(order=>{
                return hoy === moment(order.createdAt).format("MM-DD-YYYY") && (!isSuperSu() ? order._shop._id === getAnyUser('_shop._id') : globalState.shopActive === order._shop._id || !globalState.shopActive )
            }).map(order=>order.total).reduce((before,after)=>{
                return before+after
            },0)

        },
        getPlatesWeek(state, _, globalState){
            if (state.orders.length === 0) return { labels: [], datasets: [] }
            const orders = state.orders.filter(order => {
                const initDate = moment().weekday(-7).format('YYYY-MM-DD'), lastDate = moment().weekday(0).format('YYYY-MM-DD')
                return moment(order.createdAt, 'YYYY-MM-DD').isBetween(initDate, lastDate) && (!isSuperSu() ? order._shop._id === getAnyUser('_shop._id') : globalState.shopActive === order._shop._id || !globalState.shopActive)
            })
                .map(o => o.menu)
                .reduce((b, a) => [...b, ...a], [])
            const now = orders.reduce((b, a) => !b.find(o => o.plate === a.plate) ? [...b, a] : b, []).map(a => {
                const ordersPertinets = orders.filter(p => p.plate === a.plate).reduce((b, a) => b + a.cantidad, 0)
                return { ...a, cantidad: ordersPertinets }
            }).map(p => {
                const plate = globalState.menus.menus.find(m => m._id === p.plate)
                return { plate: plate ? plate.name : '', cantidad: p.cantidad }
            })
            const colors = now.map(e => {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            })
            return {
                labels: now.map(e => e.plate),
                datasets: [{ data: now.map(e => e.cantidad), backgroundColor: colors, borderWidth: 0 }]
            }
        },
        getPlatesWeekThis(state, _, globalState){
            if (state.orders.length === 0) return { labels: [], datasets: [] }
            const orders = state.orders.filter(order => {
                const initDate = moment().weekday(0).format('YYYY-MM-DD'), lastDate = moment().weekday(7).format('YYYY-MM-DD')
                return moment(order.createdAt, 'YYYY-MM-DD').isBetween(initDate, lastDate) && (!isSuperSu() ? order._shop._id === getAnyUser('_shop._id') : globalState.shopActive === order._shop._id || !globalState.shopActive)
            })
            .map(o => o.menu)
            .reduce((b, a) => [...b, ...a], [])
            const  now= orders.reduce((b, a) => !b.find(o => o.plate === a.plate) ? [...b, a] : b, []).map(a => {
                const ordersPertinets = orders.filter(p => p.plate === a.plate).reduce((b, a) => b + a.cantidad, 0)
                return { ...a, cantidad: ordersPertinets }
            }).map(p => { 
                const plate = globalState.menus.menus.find(m => m._id === p.plate)
                return { plate:plate?plate.name:'',cantidad:p.cantidad } 
            } )
            const colors=now.map(e=>{
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            })
            return {
                labels: now.map(e => e.plate),
                datasets: [{ data: now.map(e => e.cantidad), backgroundColor: colors, borderWidth: 0 }]
            }
        },
    }
}
export default orders
