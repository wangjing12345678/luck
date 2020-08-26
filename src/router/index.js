import Vue from 'vue'
import vueRouter from 'vue-router'
Vue.use(vueRouter);

export default new vueRouter({
    routes:[
        {
            path: '/',
            component: () => import('@/views/luckEnd/raffle'),
            name: 'raffle',
            meta: { title: '抽奖' },
        }
    ]
})
