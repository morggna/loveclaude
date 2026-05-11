<div align="center">

```
 _                     ___ _                 _
| |    _____   _____  / __\ | __ _ _   _  __| | ___
| |   / _ \ \ / / _ \/ /  | |/ _` | | | |/ _` |/ _ \
| |__| (_) \ V /  __/ /___| | (_| | |_| | (_| |  __/
|_____\___/ \_/ \___\____/|_|\__,_|\__,_|\__,_|\___|
```

**A Claude / Anthropic-inspired Hugo blog theme**

Built entirely through AI × human collaboration — every line of code written by [Claude](https://claude.ai) (Anthropic).

[![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa.svg?style=flat-square)](LICENSE)
[![Hugo](https://img.shields.io/badge/Hugo-≥_0.146.0-ff4088.svg?style=flat-square&logo=hugo)](https://gohugo.io/)
[![Demo](https://img.shields.io/badge/Live_Demo-iws.tw-7c3aed.svg?style=flat-square)](https://iws.tw)
[![Built with Claude](https://img.shields.io/badge/Built_with-Claude_AI-f97316.svg?style=flat-square)](https://claude.ai)

**[English](#-english) · [中文](#-中文)**

</div>

---

## 🇬🇧 English

### Overview

**LoveClaude** is a dark-first Hugo blog theme inspired by the Anthropic / Claude design language. It features a life-tree homepage timeline, TOTP 2FA–protected articles, glass-morphism modals, a floating table of contents, client-side multi-language translation, and a generative cover system for posts without photos.

This theme was built from scratch — no forks, no frameworks, no Tailwind — through dozens of conversations between an AI and a blog owner.

### ✨ Features

<table>
<tr><td>🌑</td><td><strong>Dark-first design</strong></td><td>Dark / light mode with CSS variable theming, glass morphism modals</td></tr>
<tr><td>🌳</td><td><strong>Life-tree homepage</strong></td><td>Animated vertical timeline — articles branch left/right from a growing trunk</td></tr>
<tr><td>🔐</td><td><strong>TOTP 2FA protection</strong></td><td>RFC 6238 client-side Web Crypto API — no backend, works with any TOTP app</td></tr>
<tr><td>🖱️</td><td><strong>Right-click protection</strong></td><td>Copyright modal on protected pages with NZ law references; 2nd click redirects home</td></tr>
<tr><td>📑</td><td><strong>Floating TOC</strong></td><td>IntersectionObserver — desktop sidebar, mobile semi-ellipse tab + bottom-sheet</td></tr>
<tr><td>🌐</td><td><strong>Client-side translation</strong></td><td>ZH → EN / JA / ES via Google Translate; full HTML restore on revert</td></tr>
<tr><td>🎨</td><td><strong>Generative covers</strong></td><td>5-layer CSS system: category halo + title watermark + emoji + vignette</td></tr>
<tr><td>🔡</td><td><strong>Serif typography</strong></td><td>Source Serif 4 + Source Han Serif CN via <code>unicode-range</code></td></tr>
<tr><td>🔍</td><td><strong>Client-side search</strong></td><td>Title + description with live category / tag filters</td></tr>
<tr><td>📄</td><td><strong>Custom About page</strong></td><td>Timeline life story, skill grid, interest cards, floating TOC</td></tr>
<tr><td>🔗</td><td><strong>Friends / blogroll</strong></td><td>Avatar card grid with hover effects</td></tr>
<tr><td>📅</td><td><strong>Archives</strong></td><td>Year-grouped post list</td></tr>
</table>

### 📋 Requirements

- Hugo **≥ 0.146.0** (extended version recommended)

### 🚀 Installation

**Git submodule** (recommended — keeps theme updatable):

```bash
git submodule add https://github.com/iwsheng/loveclaude.git themes/LoveClaude
```

**Manual clone:**

```bash
git clone https://github.com/iwsheng/loveclaude.git themes/LoveClaude
```

Then add to your `hugo.toml`:

```toml
theme = 'LoveClaude'
```

### ⚙️ Configuration

```toml
baseURL = 'https://example.org/'
theme   = 'LoveClaude'
defaultContentLanguage = 'zh'

[pagination]
  pagerSize = 6

[params]
  description     = "Your blog tagline."
  heroLabel       = "PERSONAL BLOG"
  heroTitle       = 'Your <span class="gradient-text">Hero Title</span>'
  heroSubtitle    = "Hero subtitle text."
  defaultTheme    = "dark"          # "dark" | "light"
  dateFormat      = "Jan 2, 2006"
  showReadingTime = true
  showWordCount   = true
  telegramBotURL  = "https://t.me/yourbotname"
  contactEmail    = "you@example.com"

[languages.zh]
  locale = "zh-CN"
  label  = "中文"
  title  = "My Blog"
  weight = 1

  [[languages.zh.menus.main]]
    name = "文章" ; url = "/posts/"   ; weight = 10
  [[languages.zh.menus.main]]
    name = "归档" ; url = "/archives/"; weight = 20
  [[languages.zh.menus.main]]
    name = "标签" ; url = "/tags/"    ; weight = 30
  [[languages.zh.menus.main]]
    name = "友链" ; url = "/friends/" ; weight = 35
  [[languages.zh.menus.main]]
    name = "关于" ; url = "/about/"   ; weight = 40

[outputs]
  home    = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  page    = ["HTML"]

[markup.highlight]
  style     = "dracula"
  noClasses = true
[markup.goldmark.renderer]
  unsafe = true   # required for HTML in Markdown
```

### 📝 Front matter reference

```yaml
---
title: "Post title"
date: 2026-01-01
draft: false
description: "Shown in cards and meta."
categories: ["技术"]
tags: ["hugo", "theme"]
emoji: "🎨"              # generative cover icon
cover: "/img/photo.jpg"  # real cover photo (overrides generative cover)
author: "Your Name"
toc: true                # floating table of contents
color: "#7c3aed"         # life-tree node accent colour
protected: true          # enable TOTP 2FA gate
---
```

**Friend entry** — create `.md` files in `content/friends/`:

```yaml
---
title: "Friend's Blog"
date: 2026-01-01
description: "Short description."
link: "https://example.com"
avatar: "https://example.com/avatar.png"
---
```

### 🔐 Setting up 2FA protected articles

1. **Generate a TOTP secret** (Base32, 16 chars):

```bash
python3 -c "import base64, os; print(base64.b32encode(os.urandom(10)).decode())"
```

2. **Edit `assets/js/main.js`** — replace the placeholder:

```js
const TOTP_SECRET_B32 = 'YOUR_SECRET_HERE';
```

3. **Add to your authenticator app** using the otpauth URI:

```
otpauth://totp/YourBlog?secret=YOUR_SECRET_HERE&issuer=YourBlog&algorithm=SHA1&digits=6&period=30
```

4. **Mark articles** with `protected: true` in front matter.

> **Security note:** The secret is visible in your built JS. Suitable for personal blogs — not for commercially sensitive content.

### 📄 License

MIT © 2026 [iWSheng](https://iws.tw) — theme designed and built with [Claude](https://claude.ai) (Anthropic)

---

## 🇨🇳 中文

### 简介

**LoveClaude** 是一个深色优先的 Hugo 博客主题，视觉语言灵感来自 Anthropic / Claude 的设计风格。功能包括生命树首页时间轴、TOTP 两步验证保护文章、玻璃质感弹窗、浮动目录、客户端多语言翻译，以及为无配图文章设计的生成式封面系统。

这个主题从零开始，没有 fork 任何仓库，没有使用任何框架——由 AI 与博主通过数十轮对话一笔一划写成。

### ✨ 功能特性

<table>
<tr><td>🌑</td><td><strong>深色优先设计</strong></td><td>深色 / 浅色模式切换，CSS 变量主题系统，玻璃拟态弹窗</td></tr>
<tr><td>🌳</td><td><strong>生命树首页</strong></td><td>带生长动画的竖向时间轴，文章节点左右交错排列</td></tr>
<tr><td>🔐</td><td><strong>TOTP 两步验证保护</strong></td><td>RFC 6238 标准，浏览器原生 Web Crypto API 实现，无需后端</td></tr>
<tr><td>🖱️</td><td><strong>右键版权保护</strong></td><td>受保护文章拦截右键，显示 NZ 版权法弹窗；二次右键跳回首页</td></tr>
<tr><td>📑</td><td><strong>浮动文章目录</strong></td><td>IntersectionObserver 触发；桌面端左侧滑入，移动端半椭圆 tab + 底部抽屉</td></tr>
<tr><td>🌐</td><td><strong>客户端多语言翻译</strong></td><td>中文 → 英语 / 日语 / 西班牙语，切换回中文完整还原格式</td></tr>
<tr><td>🎨</td><td><strong>生成式封面系统</strong></td><td>五层 CSS：分类光晕 + 标题水印 + emoji + 暗角，无需配图</td></tr>
<tr><td>🔡</td><td><strong>衬线字体优化</strong></td><td>Source Serif 4（拉丁）+ 思源宋体（中文）通过 unicode-range 无缝拼合</td></tr>
<tr><td>🔍</td><td><strong>客户端搜索</strong></td><td>标题 + 描述实时搜索，支持分类 / 标签筛选</td></tr>
<tr><td>📄</td><td><strong>自定义关于页</strong></td><td>竖向时间轴生平、技能卡片、兴趣网格、浮动目录</td></tr>
<tr><td>🔗</td><td><strong>友情链接页</strong></td><td>头像卡片网格布局</td></tr>
<tr><td>📅</td><td><strong>归档页</strong></td><td>按年份分组的文章列表</td></tr>
</table>

### 📋 环境要求

- Hugo **≥ 0.146.0**（推荐 extended 版本）

### 🚀 安装

**Git 子模块**（推荐，方便后续更新）：

```bash
git submodule add https://github.com/iwsheng/loveclaude.git themes/LoveClaude
```

**手动克隆：**

```bash
git clone https://github.com/iwsheng/loveclaude.git themes/LoveClaude
```

然后在 `hugo.toml` 添加：

```toml
theme = 'LoveClaude'
```

### ⚙️ 完整配置示例

见上方 [English 配置章节](#️-configuration)，配置键完全相同。

### 📝 文章 Front Matter 参考

```yaml
---
title: "文章标题"
date: 2026-01-01
draft: false
description: "显示在卡片和 meta 中的简介"
categories: ["技术"]
tags: ["hugo", "主题"]
emoji: "🎨"              # 生成式封面图标
cover: "/img/photo.jpg"  # 真实封面图（会覆盖生成式封面）
author: "作者名"
toc: true                # 启用浮动目录
color: "#7c3aed"         # 生命树节点颜色
protected: true          # 启用 TOTP 两步验证保护
---
```

**友情链接条目** — 在 `content/friends/` 下新建 `.md` 文件：

```yaml
---
title: "朋友的博客"
date: 2026-01-01
description: "简短描述"
link: "https://example.com"
avatar: "https://example.com/avatar.png"
---
```

### 🔐 受保护文章设置

1. **生成 TOTP 密钥**（Base32 编码，16 字符）：

```bash
python3 -c "import base64, os; print(base64.b32encode(os.urandom(10)).decode())"
```

2. **编辑 `assets/js/main.js`**，替换密钥：

```js
const TOTP_SECRET_B32 = 'YOUR_SECRET_HERE';
```

3. **添加到验证器 App**（Google Authenticator、Authy、1Password、Bitwarden 均可）：

```
otpauth://totp/YourBlog?secret=YOUR_SECRET_HERE&issuer=YourBlog&algorithm=SHA1&digits=6&period=30
```

4. **标记需要保护的文章**：在 Front Matter 加 `protected: true`。

> **安全说明：** 密钥会出现在构建后的 JS 文件中，安全性依赖于代码不公开。适合个人博客私密文章，不适合商业敏感内容。

### 🎨 生成式封面说明

无配图时，封面由五层 CSS 自动生成：

| 层级 | 内容 |
|------|------|
| 1 — 背景色 | 分类专属底色（技术紫 / 心事暖 / 自由蓝 / 随笔琥珀） |
| 2 — 光晕层 | 分类色径向渐变，模拟聚光效果 |
| 3 — 标题水印 | 文章标题以极大字号、极低透明度渲染，每张卡片独一无二 |
| 4 — Emoji | 主体浮层，hover 时放大上浮 |
| 5 — 暗角层 | 四角加深，聚焦视线 |

设置 `cover:` 参数后，所有 CSS 层自动让位，显示真实图片。

### 📄 开源协议

MIT © 2026 [iWSheng](https://iws.tw) · 主题由 [Claude](https://claude.ai)（Anthropic）与博主共同设计构建

---

<div align="center">

Made with ❤️ by [iWSheng](https://iws.tw) × [Claude](https://claude.ai)

</div>
