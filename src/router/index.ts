import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/awaiting-payment',
      name: 'awaiting-payment',
      component: () => import('../views/PaymentPageView.vue')
    }
  ]
})

export default router
