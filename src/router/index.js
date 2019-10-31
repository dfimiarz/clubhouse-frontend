import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
const RegisterMember = () => import('@/components/RegisterMember')
const MemberManager = () => import('@/components/MemberManager')
const QuickMatchBooking = () => import ('@/components/QuickMatchBooking')
const MatchCalendar = () => import ('@/components/MatchCalendar')
const AdminBooking = () => import ('@/components/AdminBooking')
const SessionDetails = () => import ('@/components/SessionDetails')
const SessionEdit = () => import ('@/components/SessionEdit')

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/members',
      component: MemberManager,
      children: [
        {
          path : '',
          component: RegisterMember,
          name: 'ManageMembers',
        },
        {
          path : 'new',
          component: RegisterMember
        }
      ]
    },
    {
      path: '/sessions',
      name: 'calendar',
      component: MatchCalendar
    },
    {
      path: '/sessions/new',
      name: 'AdminBooking',
      component: AdminBooking
    },
    {
      path: '/sessions/quickbook',
      name: 'QuickBooking',
      component: QuickMatchBooking
    },
    {
      path: '/sessions/:id',
      name: 'SessionDetails',
      component: SessionDetails,
      props: true
    },
    {
      path: '/sessions/:id/edit',
      name: 'sessionedit',
      component: SessionEdit,
      props: true
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound
      }
  ]

export default new Router({
  routes,
  mode: 'history'
})