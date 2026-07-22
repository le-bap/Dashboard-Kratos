import { createRouter, createWebHistory } from "vue-router"

import Dashboard from "../views/Dashboard.vue"
import TableView from "../views/TableView.vue"

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/table/:type",
    name: "table-view",
    component: TableView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router