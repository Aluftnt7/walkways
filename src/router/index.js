import Vue from 'vue'
import VueRouter from 'vue-router'
import projApp from '../pages/walkways-app.vue'
import Login from '../pages/Login.vue';
import userProfile from '../pages/user/user-profile.vue'
import userEdit from '../pages/user/user-edit.vue'
import projEdit from '../pages/proj/proj-edit.vue'
import projListFiltered from '../pages/proj/proj-list-filtered.vue'
import projDetails from '../pages/proj/proj-details.vue'
import projList from '../pages/proj/proj-list.vue'
// import projSearch from '../components/proj-search.vue'
// import projListSearch from '../components/proj-list-search.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'projApp',
        component: projApp
    },
    {
        path: '/projs/aroundTheWorld',
        name: 'aroundTheWorld',
        component: projList
    },
    // {
    //     path: '/search',
    //     name: 'projSearch',
    //     component: projSearch
    // },
    // {
    //     path: '/projects/:querys?',
    //     name: 'projListSearch',
    //     component: projListSearch
    // },
    {
        path: '/projs/:filter',
        name: 'projsListFiltered',
        component: projListFiltered
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/user/:id',
        name: 'userProfile',
        component: userProfile
    },
    {
        path: '/userEdit/:id',
        name: 'userEdit',
        component: userEdit
    },
    {
        path: '/edit/:id?',
        name: 'projEdit',
        component: projEdit
    },
    {
        path: '/proj/:id?',
        name: 'projDetails',
        component: projDetails
    },
]

const router = new VueRouter({
    routes
})

export default router