<script setup>
import { ref, reactive, onMounted, computed, h } from 'vue'
import {
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutSider,
  NSpace,
  NInput,
  NCard,
  NGrid,
  NGridItem,
  NButton,
  NIcon,
  NSwitch,
  NTooltip,
  NMenu,
  NTabs,
  NTabPane,
  darkTheme
} from 'naive-ui'
import {
  Search as SearchIcon,
  Moon,
  Sunny,
  Home,
  Grid,
  Menu as MenuIcon,
  ChevronForward,
  ChevronBack
} from '@vicons/ionicons5'

// 导入配置
import bookmarksData from './assets/config/bookmarks.json'
import searchEngines from './assets/config/search.json'

// 状态管理
const isDarkMode = ref(true) // 默认黑猫主题为暗色模式
const searchText = ref('')
const bookmarks = reactive(bookmarksData)
const activeCategory = ref(null)
const collapsed = ref(false) // 侧边栏是否折叠
const activeMenu = ref('home') // 默认显示首页

// 搜索引擎相关
const defaultEngine = ref('bd') // 默认使用百度

// 搜索引擎选项
const searchEngineOptions = Object.keys(searchEngines).map(key => {
  return {
    label: searchEngines[key][0],
    value: key
  }
})

// 处理搜索
const handleSearch = () => {
  if (!searchText.value) return

  let engine = defaultEngine.value
  let query = searchText.value

  // 检查是否使用了搜索引擎关键字
  const parts = searchText.value.split(' ')
  if (parts.length > 1 && searchEngines[parts[0]]) {
    engine = parts[0]
    query = parts.slice(1).join(' ')
  }

  const url = searchEngines[engine][1] + encodeURIComponent(query)
  window.open(url, '_blank')
}

// 根据分类获取书签
const getBookmarksByCategory = (categoryName) => {
  const category = bookmarks.find(cat => cat.title === categoryName)
  return category ? category.items : []
}

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

// 更新默认搜索引擎
const updateDefaultEngine = (value) => {
  defaultEngine.value = value
}

// 打开链接
const openLink = (link) => {
  // 特殊处理BSC查询工具链接
  if (link === "45.77.180.218") {
    window.open('http://' + link, '_blank')
    return
  }

  // 其他链接默认使用https
  if (!link.startsWith('http')) {
    link = 'https://' + link
  }
  window.open(link, '_blank')
}

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 生成菜单项
const menuOptions = computed(() => {
  return bookmarks.map((category, index) => {
    return {
      label: category.title,
      key: category.title,
      icon: () => h('span', { class: 'menu-icon' }, category.menuIcon)
    }
  })
})

// 处理菜单选择
const handleMenuSelect = (key) => {
  activeCategory.value = key
}

// 初始化
onMounted(() => {
  // 默认显示Web3侧边栏
  activeCategory.value = "Web3"
})
</script>

<template>
  <n-config-provider :theme="isDarkMode ? darkTheme : null" class="theme-provider">
    <n-layout class="layout" has-sider position="absolute">
      <!-- 侧边栏 - 设置菜单 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        class="sider"
      >
        <div class="logo-container">
          <div class="logo">
            <span class="cat-emoji">🐈‍⬛</span>
            <span class="logo-text" v-if="!collapsed">黑猫Web3导航</span>
          </div>
        </div>

        <div class="menu-container">
          <div class="menu-item" :class="{ active: activeMenu === 'home' }" @click="activeMenu = 'home'">
            <div class="menu-icon">🏠</div>
            <div class="menu-label" v-if="!collapsed">首页</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'settings' }" @click="activeMenu = 'settings'">
            <div class="menu-icon">⚙️</div>
            <div class="menu-label" v-if="!collapsed">设置</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'about' }" @click="activeMenu = 'about'">
            <div class="menu-icon">ℹ️</div>
            <div class="menu-label" v-if="!collapsed">关于黑猫</div>
          </div>
          <div class="menu-item" :class="{ active: activeMenu === 'future' }" @click="activeMenu = 'future'">
            <div class="menu-icon">🔮</div>
            <div class="menu-label" v-if="!collapsed">黑猫未来</div>
          </div>
        </div>

        <div class="theme-switch-container">
          <n-tooltip placement="right">
            <template #trigger>
              <n-switch v-model:value="isDarkMode" @update:value="toggleDarkMode" class="theme-switch">
                <template #checked>
                  <n-icon><Moon /></n-icon>
                </template>
                <template #unchecked>
                  <n-icon><Sunny /></n-icon>
                </template>
              </n-switch>
            </template>
            {{ isDarkMode ? '暗色模式' : '亮色模式' }}
          </n-tooltip>
        </div>
      </n-layout-sider>

      <!-- 主内容区 -->
      <n-layout :style="{ paddingLeft: collapsed ? '64px' : '240px' }" class="main-layout">
        <n-layout-header class="header">
          <div class="header-content">
            <div class="search-container">
              <n-input
                v-model:value="searchText"
                placeholder="输入搜索内容，回车搜索"
                @keydown.enter="handleSearch"
                class="search-input"
              >
                <template #suffix>
                  <n-button type="primary" @click="handleSearch">
                    <n-icon><SearchIcon /></n-icon>
                  </n-button>
                </template>
              </n-input>
            </div>
          </div>
        </n-layout-header>

        <n-layout-content class="content">
          <div class="search-tip">
            提示：输入关键字+空格可切换搜索引擎，如"g google"使用Google搜索
          </div>

          <!-- 主页内容 -->
          <div v-if="activeMenu === 'home'">
            <!-- Web3分组 -->
            <n-card class="group-card" title="Web3" :bordered="false">
              <template #header-extra>
                <span class="category-icon">😻</span>
              </template>
              <n-grid :cols="5" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
                <n-grid-item v-for="item in getBookmarksByCategory('Web3')" :key="item.title">
                  <div class="bookmark-card" @click="openLink(item.link)">
                    <div class="bookmark-icon">
                      <img
                        :src="item.favicon"
                        class="favicon"
                        :alt="item.title"
                        @error="e => e.target.src = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${item.title.charAt(0)}</text></svg>`"
                      />
                    </div>
                    <div class="bookmark-title">{{ item.title }}</div>
                  </div>
                </n-grid-item>
              </n-grid>
            </n-card>

            <!-- 常用网站分组 -->
            <n-card class="group-card" title="常用网站" :bordered="false">
              <template #header-extra>
                <span class="category-icon">😸</span>
              </template>
              <n-grid :cols="5" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
                <n-grid-item v-for="item in getBookmarksByCategory('常用网站')" :key="item.title">
                  <div class="bookmark-card" @click="openLink(item.link)">
                    <div class="bookmark-icon">
                      <img
                        :src="item.favicon"
                        class="favicon"
                        :alt="item.title"
                        @error="e => e.target.src = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${item.title.charAt(0)}</text></svg>`"
                      />
                    </div>
                    <div class="bookmark-title">{{ item.title }}</div>
                  </div>
                </n-grid-item>
              </n-grid>
            </n-card>
          </div>

          <!-- 设置页面 -->
          <div v-if="activeMenu === 'settings'">
            <n-card class="settings-card" title="设置" :bordered="false">
              <n-space vertical>
                <div class="settings-section">
                  <h3>主题设置</h3>
                  <n-space>
                    <span>暗色模式：</span>
                    <n-switch v-model:value="isDarkMode" @update:value="toggleDarkMode">
                      <template #checked>开启</template>
                      <template #unchecked>关闭</template>
                    </n-switch>
                  </n-space>
                </div>

                <div class="settings-section">
                  <h3>搜索引擎设置</h3>
                  <div class="engine-options">
                    <div class="engine-option-label">默认搜索引擎：</div>
                    <div class="engine-options-container">
                      <div
                        v-for="(engine, key) in searchEngines"
                        :key="key"
                        class="engine-option"
                        :class="{ active: defaultEngine === key }"
                        @click="defaultEngine = key"
                      >
                        {{ engine[0] }}
                      </div>
                    </div>
                  </div>
                  <div class="settings-tip">
                    当前默认搜索引擎：{{ searchEngines[defaultEngine] ? searchEngines[defaultEngine][0] : '未设置' }}
                  </div>
                </div>
              </n-space>
            </n-card>
          </div>

          <!-- 关于页面 -->
          <div v-if="activeMenu === 'about'">
            <n-card class="about-card" title="关于黑猫" :bordered="false">
              <n-space vertical size="large">
                <div class="about-section">
                  <p>黑猫一款的链上数据可视化平台。它不仅支持BSC链，还在持续扩展多链支持。用户只需输入钱包地址，即可获得该地址关联的钱包群、Token持仓、合约交互记录等核心信息，清晰还原链上资产结构和行为轨迹。</p>
                </div>

                <div class="about-section">
                  <h3>黑猫的核心功能亮点：</h3>
                  <div class="feature-item">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-content">
                      <h4>一键查询，多维分析</h4>
                      <p>只需一个地址，系统将智能关联链上其他钱包地址，展示资产分布、交易关系和可能的关联账户，让链上行为图谱一目了然。</p>
                    </div>
                  </div>

                  <div class="feature-item">
                    <div class="feature-icon">🐾</div>
                    <div class="feature-content">
                      <h4>黑猫标记系统</h4>
                      <p>通过社区与AI共同参与的钱包标签系统，对风险地址、鲸鱼地址、项目方钱包等进行标记，让你避雷不踩坑。</p>
                    </div>
                  </div>

                  <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-content">
                      <h4>极速响应体验</h4>
                      <p>借助本地缓存和多节点同步机制，黑猫查询响应极快，几乎秒出结果，真正做到"查链如查账"。</p>
                    </div>
                  </div>
                </div>

                <div class="about-footer">
                  <p>版本：1.0.0</p>
                </div>
              </n-space>
            </n-card>
          </div>

          <!-- 黑猫未来页面 -->
          <div v-if="activeMenu === 'future'">
            <n-card class="future-card" title="黑猫未来" :bordered="false">
              <n-space vertical size="large">
                <div class="future-section">
                  <h2 class="future-title">黑猫"三级跳"计划</h2>

                  <div class="roadmap-item">
                    <div class="roadmap-icon">🐾</div>
                    <div class="roadmap-content">
                      <h3>第一跳：多链上线</h3>
                      <div class="roadmap-goal">
                        <strong>目标：</strong>一站式查询多链资产和地址行为
                      </div>
                      <p>集成以太坊（Ethereum）、Solana(SOL) 等主流公链。</p>
                    </div>
                  </div>

                  <div class="roadmap-item">
                    <div class="roadmap-icon">🐾</div>
                    <div class="roadmap-content">
                      <h3>第二跳：黑猫标签系统</h3>
                      <p>上线风险标签系统，自动标注涉诈地址、黑客地址、项目方地址、僵尸钱包等。</p>
                      <p>引入社区参与机制，用户可为地址提交备注、举报行为、投票审核。</p>
                      <p>黑猫将根据地址行为模式生成自动标签，如"疑似OTC大户""DApp频繁操作者"等。</p>
                    </div>
                  </div>

                  <div class="roadmap-item">
                    <div class="roadmap-icon">🐾</div>
                    <div class="roadmap-content">
                      <h3>第三跳：AI分析助手</h3>
                      <div class="roadmap-goal">
                        <strong>目标：</strong>人人都能看懂链上行为，无需技术背景
                      </div>
                      <p>集成AI地址行为分析引擎，为用户自动生成自然语言分析报告。</p>
                      <p>分析维度包括：交互频次、合约类别、资金流向、Token分布等。</p>
                      <p>初步开放"轻分析"和"深度分析"两种模式，满足不同层级用户需求。</p>
                    </div>
                  </div>
                </div>
              </n-space>
            </n-card>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

.n-config-provider {
  height: 100%;
  width: 100%;
}

.theme-provider {
  background-color: var(--n-color) !important;
}

/* 布局样式 */
.layout {
  min-height: 100vh;
  width: 100%;
  background-color: var(--n-color) !important;
}

html, body, #app, .n-config-provider {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body {
  background-color: var(--n-color) !important;
}

.n-layout-sider, .n-layout-sider-scroll-container {
  background-color: var(--n-color) !important;
}

/* 侧边栏样式 */
.sider {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo-container {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.cat-emoji {
  font-size: 1.8rem;
  margin-right: 8px;
}

.menu-container {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  margin: 4px 8px;
}

.menu-item:hover {
  background-color: rgba(128, 128, 128, 0.1);
}

.menu-item.active {
  background-color: rgba(128, 128, 128, 0.2);
}

.menu-icon {
  font-size: 1.8rem;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.menu-item:hover .menu-icon {
  transform: scale(1.2);
}

.menu-label {
  font-size: 0.95rem;
}

.theme-switch-container {
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

/* 头部样式 */
.header {
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 90;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-container {
  width: 100%;
  max-width: 600px;
}

.search-input {
  font-size: 1rem;
}

.search-tip {
  font-size: 0.8rem;
  opacity: 0.7;
  text-align: center;
  margin: 8px 0 12px;
}

/* 内容区样式 */
.content {
  padding: 16px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background-color: var(--n-color) !important;
}

.main-layout {
  transition: padding-left 0.3s;
  background-color: var(--n-color) !important;
}

.n-layout {
  background-color: var(--n-color) !important;
}

.n-layout-scroll-container {
  background-color: var(--n-color) !important;
}

/* 分组卡片样式 */
.group-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  width: 100%;
  overflow: hidden;
}

.group-card:hover {
  transform: translateY(-5px);
}

.n-card__content {
  padding: 16px !important;
}

.category-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.category-icon {
  font-size: 1.5rem;
  margin-right: 8px;
}

/* 设置和关于页面样式 */
.settings-card,
.about-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.settings-tip {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--primary-color);
  opacity: 0.8;
}

.engine-options {
  margin-bottom: 16px;
}

.engine-option-label {
  margin-bottom: 8px;
  font-weight: bold;
}

.engine-options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.engine-option {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: rgba(128, 128, 128, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.engine-option:hover {
  background-color: rgba(128, 128, 128, 0.2);
  transform: translateY(-2px);
}

.engine-option.active {
  background-color: var(--primary-color);
  color: white;
}

/* 关于页面特定样式 */
.about-section {
  margin-bottom: 20px;
}

.about-section h3 {
  font-size: 1.3rem;
  margin-bottom: 16px;
  border-left: 4px solid var(--primary-color);
  padding-left: 12px;
}

.feature-item {
  display: flex;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(128, 128, 128, 0.05);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  background-color: rgba(128, 128, 128, 0.1);
}

.feature-icon {
  font-size: 2rem;
  margin-right: 16px;
  display: flex;
  align-items: flex-start;
}

.feature-content {
  flex: 1;
}

.feature-content h4 {
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 8px;
}

.feature-content p {
  margin: 0;
  line-height: 1.6;
}

.about-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

:root {
  --primary-color: #42b883;
}

/* 黑猫未来页面样式 */
.future-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.future-section {
  padding: 0 8px;
}

.future-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 1.8rem;
  background: linear-gradient(45deg, var(--primary-color), #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.roadmap-item {
  display: flex;
  margin-bottom: 32px;
  position: relative;
}

.roadmap-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 40px;
  left: 20px;
  width: 2px;
  height: calc(100% + 16px);
  background: linear-gradient(to bottom, var(--primary-color) 0%, rgba(128, 128, 128, 0.2) 100%);
  z-index: 0;
}

.roadmap-icon {
  font-size: 2.5rem;
  margin-right: 20px;
  position: relative;
  z-index: 1;
  background-color: var(--n-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roadmap-content {
  flex: 1;
  padding: 16px 20px;
  background-color: rgba(128, 128, 128, 0.05);
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.roadmap-item:hover .roadmap-content {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background-color: rgba(128, 128, 128, 0.1);
}

.roadmap-content h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: var(--primary-color);
}

.roadmap-goal {
  background-color: rgba(66, 184, 131, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  border-left: 3px solid var(--primary-color);
}

.roadmap-content p {
  margin: 8px 0;
  line-height: 1.6;
}

.bookmark-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bookmark-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.bookmark-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.favicon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.bookmark-title {
  font-size: 0.9rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content {
    padding: 16px;
    width: 100% !important;
  }

  .main-layout {
    padding-left: 0 !important;
  }

  .n-layout-sider {
    position: fixed;
    z-index: 1000;
    height: 100vh;
    left: 0;
    top: 0;
  }

  .n-layout-sider:not(.n-layout-sider--collapsed) {
    width: 100% !important;
    max-width: 100% !important;
  }

  .n-grid {
    --n-cols-xs: 2 !important;
    --n-cols-s: 3 !important;
    --n-cols-m: 4 !important;
    --n-cols-l: 4 !important;
    --n-cols-xl: 5 !important;
    --n-cols-xxl: 6 !important;
  }

  .header {
    padding: 12px;
  }

  .search-container {
    width: 100%;
  }

  .bookmark-icon {
    width: 40px;
    height: 40px;
  }

  .bookmark-title {
    font-size: 0.8rem;
  }

  .group-card {
    margin-bottom: 16px;
  }
}
</style>
