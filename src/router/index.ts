import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'awaiting-payment',
      component: () => import('../views/PaymentPageView.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorPageView.vue'),
      props: true
    }
  ]
})

export default router
