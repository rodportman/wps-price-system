<template>
  <div>
    <!-- 固定顶部导航 -->
    <div v-show="showNav" class="nav-container">
      <el-menu
        mode="horizontal"
        :default-active="$route.path"
        active-text-color="#409EFF"
        class="nav-menu"
      >
        <el-menu-item
          v-for="item in navItems"
          :key="item.path"
          :index="item.path"
        >
          <router-link :to="item.path">{{ item.title }}</router-link>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 页面内容区域 -->
    <div
      :style="{
        marginTop: showNav ? '60px' : '0',
      }"
    >
      <!-- ✅ 使用 v-slot 获取 Component 并绑定事件 -->
      <router-view v-slot="{ Component }">
        <component :is="Component" @toggle-nav="handleToggleNav" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
const route = useRoute();
const showNav = ref(true);

// 导航数据
const navItems = [
  { title: "首页", path: "/" },
  { title: "示例页面", path: "/navicocopy" },
  { title: "Navico", path: "/navico" },
  { title: "Navico美元版", path: "/navicousd" },
  { title: "Antalnew", path: "/antalnew", },
  { title: "Navico A4版", path: "/navicoafour" },
  { title: "Antal A4版", path: "/antalafour" },

];
// // 背景图片映射
// const routeBackgrounds = {
//   "/": "url('/src/assets/HomeLogo.jpg')",
//   "/navico": "url('/src/assets/navico-bg.png')",
//   "/antal": "url('/src/assets/antal-bg.png')",
// };
// // 当前背景图片
// const backgroundImage = ref(routeBackgrounds[route.path] || "none");
// // 监听路由变化，动态更新背景图片
// watch(
//   () => route.path,
//   (newPath) => {
//     backgroundImage.value = routeBackgrounds[newPath] || "none";
//   }
// );
// 处理来自子组件的导航栏显示/隐藏请求
const handleToggleNav = (isVisible) => {
  // console.log("接收到 toggle-nav 事件:", isVisible);
  showNav.value = isVisible;
};
</script>

<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 8px #ccc;
}
.nav-menu {
  border-bottom: none;
  font-size: 16px;
}
.nav-menu .el-menu-item a {
  text-decoration: none;
  color: #333333;
  transition: all 0.3s ease;
}
.nav-menu .el-menu-item:hover {
  font-size: larger;
}
.nav-menu .el-menu-item.is-active {
  font-size: larger;
}

/* 去除链接下划线 */
:deep .el-menu-item a {
  text-decoration: none !important;
  color: #333333 !important;
}
.content-container {
  transition: background 0.3s ease; /* 添加背景切换的过渡动画 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */
  min-height: 100vh; /* 确保内容区域占满屏幕高度 */
}
</style>
