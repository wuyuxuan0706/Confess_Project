# Ache & Her Adventure

一个基于 Phaser 和 Vite 制作的 2D 像素风叙事小游戏。

这个项目记录的是我和女朋友从相识、聊天、靠近，到第一次见面的心理路程。原本是做给她看的，结果她体验之后给出的评分是：-100。

我不服。

所以我把它发出来，想让大家一起试玩一下。如果你觉得哪里节奏奇怪、剧情尴尬、操作别扭、画面不够好，欢迎提出建议。这个项目的目标不是做成一个完美游戏，而是把一段真实经历用互动的方式重新讲一遍。

## 项目特点

- 2D 像素风互动叙事
- 多章节成长流程
- 横屏移动端体验
- 支持 PWA 基础配置，可以添加到手机主屏幕
- 使用 Phaser 作为游戏引擎，Vite 作为构建工具

## 本地运行

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

终端会显示一个本地地址，例如：

```bash
http://localhost:5173/
```

如果想用手机在同一个局域网内打开，使用终端里显示的 Network 地址，或使用电脑当前局域网 IP 加端口访问。

## 构建发布版本

```bash
npm run build
```

构建完成后会生成：

```bash
dist/
```

这个目录就是可以部署到静态网站平台的产物。

本地预览构建结果：

```bash
npm run preview
```

## 部署方式

### Vercel

1. 将项目上传到 GitHub。
2. 在 Vercel 中导入这个仓库。
3. 保持默认 Vite 配置即可。
4. 确认构建命令为：

```bash
npm run build
```

5. 确认输出目录为：

```bash
dist
```

### Netlify

1. 将项目上传到 GitHub。
2. 在 Netlify 中选择该仓库。
3. Build command 填：

```bash
npm run build
```

4. Publish directory 填：

```bash
dist
```

### GitHub Pages

本项目已经在 `vite.config.js` 中使用了相对资源路径配置，适合部署到 GitHub Pages 的仓库子路径。

推荐使用 GitHub Actions 自动部署，或手动将 `dist` 目录发布到 Pages。

## 移动端体验

推荐使用横屏体验。

如果部署后的页面支持 HTTPS，可以在 iPhone Safari 中打开页面，然后通过分享按钮选择“添加到主屏幕”。再次从主屏幕打开时，会更接近全屏应用体验。

## 技术栈

- Phaser
- Vite
- JavaScript
- CSS

## 反馈

如果你玩完之后觉得它确实应该是 -100 分，也可以告诉我为什么。

如果你觉得它还有救，请一定告诉我怎么救。
# Confess_Project
