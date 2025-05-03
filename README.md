# 黑猫导航

一个简单优雅的导航页面，以黑猫为主题，基于Vue 3和Naive UI开发。

## ✨ 特性

- 响应式设计，适配各种设备
- 黑暗模式（默认启用，符合黑猫主题）
- 使用Emoji图标
- 自定义书签分类和显示
- 多搜索引擎支持
- 使用关键字切换搜索引擎
  - 搜索框中输入关键字+空格触发
  - 例如：`g 黑猫`则使用Google搜索`黑猫`，`b 黑猫`则使用Bing搜索`黑猫`

## 🛠️ 开发与构建

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

## 📝 自定义配置

### 自定义书签

编辑 `src/assets/config/bookmarks.json` 文件，按照以下格式添加或修改书签：

```json
[
  {
    "title": "分类名称",
    "menuIcon": "🐱", // Emoji图标
    "items": [
      {
        "title": "网站名称",
        "link": "网站链接",
        "favicon": "网站图标URL"
      }
    ]
  }
]
```

### 自定义搜索引擎

编辑 `src/assets/config/search.json` 文件，按照以下格式添加或修改搜索引擎：

```json
{
  "关键字": ["搜索引擎名称", "搜索URL前缀"]
}
```

## 💖 致谢

- [Vue](https://vuejs.org)
- [Vite](https://vitejs.dev)
- [Naive UI](https://naiveui.com)
- [Naviii项目](https://github.com/eehhh/naviii)
