// import Vue from 'vue'
// import VueRouter from 'vue-router'

// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../pages/Welcome'
// import Users from '../pages/Users'
// import Rights from '../pages/Rights'
// import Roles from '../pages/Roles'
// import Categories from '../pages/Categories'
// import Goods from '../pages/Goods'
// import Params from '../pages/Params'
// import Orders from '../pages/Orders'
// import Reports from '../pages/Reports'
// import AddGood from '../pages/AddGood'

const Login = () => import(/* webpackChunkName: "loin_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "loin_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "loin_home_welcome" */ '../pages/Welcome')
const Users = () => import(/* webpackChunkName: "users" */ '../pages/Users')
const Rights = () => import(/* webpackChunkName: "rights_roles" */ '../pages/Rights')
const Roles = () => import(/* webpackChunkName: "rights_roles" */ '../pages/Roles')
const Categories = () => import(/* webpackChunkName: "categories_params_goods" */ '../pages/Categories')
const Params = () => import(/* webpackChunkName: "categories_params_goods" */ '../pages/Params')
const Goods = () => import(/* webpackChunkName: "categories_params_goods" */ '../pages/Goods')
const Orders = () => import(/* webpackChunkName: "orders" */ '../pages/Orders')
const Reports = () => import(/* webpackChunkName: "loin_home_welcome" */ '../pages/Reports')
const AddGood = () => import(/* webpackChunkName: "loin_home_welcome" */ '../pages/AddGood')

// Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    base: 'admin',
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/Home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Categories },
                { path: '/params', component: Params },
                { path: '/goods', component: Goods },
                { path: '/orders', component: Orders },
                { path: '/reports', component: Reports },
                { path: '/goods/add', component: AddGood },
            ]
        }
    ]
})

// 挂载前置路由导航守卫
router.beforeEach((to, from, next) => {
    // to表示将要访问哪里
    // from表示从哪个路径跳转而来
    // next表示放行
    if (to.path === '/login') return next()
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router