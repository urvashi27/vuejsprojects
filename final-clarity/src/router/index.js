import { createRouter, createWebHistory } from "vue-router";

 import SingleFile from "@/components/SingleFile.vue";
 import ClarityTable from "@/components/TableView.vue";

const routes= [
  {
    path: "/",
    name: "SingleFileComp",
    component: SingleFile,
  },
  {
    path: "/clarity",
    name: "ClarityTable",
    component: ClarityTable,
      },
 
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;