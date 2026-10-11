# 前端基础（跨容器共享；禁止单文件 index.html）

> 纯静态、无构建步骤：HTML + CSS + Alpine.js v3 内核（本地 vendor 化；无插件、无运行时 CDN）。
> Node 工具可选、零依赖、只用内置模块运行。可跑在任何静态主机上（推荐
> GitHub Pages）。本文件涵盖目录树（§1）与页面骨架（§2）。Alpine 组件的规范
> 代码以文件形式放在 `assets/templates/` 下（索引：`assets/templates/README.md`），它们实现的规则见 `references/structure/components.md`；检查节奏、共享配置与
> 人工方法见 `references/structure/tooling.md`。

## 1. 目录结构

模块标记（M1…M14）来自 `references/design-playbook.md` §2，仅在
`docs/system-profile.md` 中被选中时出现；其余一切都属于基础部分。

```
<game-name>/
├── index.html                    # 入口页（M9）：角色分配 + 开始按钮 + 指回本 skill 仓库的链接（保留它）；规则只在剧情需要处出现
├── search.html                   # M1 搜索模块
├── pages/
│   ├── home.html  menu.html  news.html …      # 公开页；剧情需要分区之前保持平铺
│   └── internal/                 # 受限区——用剧情自己的词命名（staff/ archive/ members/），
│       │                         # 绝不叫 "secret"；文件名不得剧透。把 CONFIG.secretUrl 指向这里（tooling.md §2）。
│       └── s19-record.html  s23-diary.html …
├── assets/
│   ├── css/
│   │   ├── base.css              # 共用布局骨架、文档拟真套件、x-cloak
│   │   ├── surface.css           # 公开层皮肤
│   │   ├── secret.css            # M5 分层换皮模块
│   │   ├── phone.css             # 设备类 phone 的外壳（模板：assets/templates/css/phone.css）
│   │   └── chrome.css            # 画出来的地址栏（模板：assets/templates/css/chrome.css）
│   ├── js/
│   │   ├── components.js         # Alpine 组件（search / gate / access / staging / progress），注册在 alpine:init 上
│   │   └── vendor/
│   │       └── alpine.min.js     # Alpine v3 内核，钉死版本（经 tools/vendor-alpine.mjs 内置一次；永不修改；无插件）
│   └── img/  audio/  docs/       # 图片、音频谜题、可下载的拟真文档（pdf/xlsx）
├── data/
│   ├── keywords.surface.src.json # 明文公开索引（仅开发期；不进部署树）
│   ├── keywords.secret.src.json  # 明文深层索引（仅开发期；不进部署树）
│   ├── keywords.surface.json     # 公开哈希表——不得含任何受限区 URL（R8）
│   ├── keywords.secret.json      # 深层哈希表，只由深层页取用
│   ├── forbidden.json            # M6 模块（哈希 + 禁用词状态文案）
│   └── credentials.src.json      # M2 派生凭据溯源（仅开发期）
├── tools/                        # 脚手架阶段从本 skill 的 assets/tools/ 拷入的工具文件
├── viewer/                       # 脚手架阶段拷入的图渲染器树（graph-viewer.html + css/ + js/）；永不是站点页面
├── .gitignore                    # 随 assets/starter/ 发出：开发副产物不进版本历史
├── .dockerignore                 # 随 assets/starter/ 发出：明文源表 / 文档 / 开发树不进镜像
└── README.md                     # 如何运行 + GDD 链接 + 玩家须知
```

`tools/`、`viewer/`、`docs/` 和 `deploy/` 不放站点页面：走图工具会跳过它们（`CONFIG.skipDirs`，
`references/structure/tooling.md` §2），所以生成的 `docs/site-graph/` 树永远不会虚增页面数。

这棵树由 **`assets/starter/`** 经初始化脚本（`assets/tools/init-project.mjs`，步骤 6a 运行）
物化而来，它是每个游戏所依据的起点项目：它带上恒定不变的文件——入口外壳（带着回到
skill 仓库的链接）、`base.css` + `surface.css`、`components.js` 内核、上面两个 ignore
文件以及项目 README。所有带模块标记或设备标记的部分（`search.html`、`data/`、
`secret.css`、`phone.css` / `chrome.css`、受限区、结局页——模板在 `assets/templates/`）
以及装配好的基础设施（`tools/`、`viewer/`）都在脚手架阶段按 `docs/system-profile.md`
（`workflow/06-scaffold.md`）添加。起点项目因此不带 `data/*.src.json`：它自带的
`.gitignore` 会忽略这些文件；明文表只在 6a 阶段、当装配记录选中了需要它的模块时才创建。

树上自带两个 ignore 文件：它们以 `.gitignore` 和 `.dockerignore` 的形式放在
`assets/starter/` 里，初始化脚本落地起点项目时把它们带到项目根目录。两者回答
不同的问题——什么绝不能进版本历史，什么绝不能到达访客手里；明文源表（答案册，
R3）同时列在两者中。逐条规则与理由见那两个文件本身的注释，不要在这里重抄。

工具在本 skill 里位于 `assets/tools/` 下；脚手架把它们复制进 `tools/`，让项目保持
自包含、可反复运行。它们只用 Node 内置模块（`node:crypto`、`node:fs`、`node:path`、
`node:child_process`），零依赖、无安装步骤。检查器从共享的 `tools/config.mjs`
读取它们的假设：项目若重命名目录、层名或标记，改这一个文件即可，而不必重写检查器
（`references/structure/tooling.md` §2 列出旋钮，其第 3 节列出静态检查无法替代的
人工方法）。关键词表是自动发现的，所以上面的分层约定与单表项目都能零配置工作。
规范的通过/失败清单是 `workflow/08-self-check.md`。

在脚手架阶段把 Alpine 运行时 vendor 化一次（脚本会锁定版本并在写文件前校验
sha256，之后该文件随游戏一起提交）：

```bash
node tools/vendor-alpine.mjs      # writes assets/js/vendor/alpine.min.js (alpinejs@3.17.3, checksum-verified)
```

上面这棵树是共享基础；各形态文档对页面与触达模型做相应调整：

- **容器 A——仿官方网站**：`references/structure/form-website.md` ——搜索枢纽、按受众分域的索引、门禁。
- **容器 B/C/D——系统类虚构**：`references/structure/form-system.md` ——账号登录、按账号的访问控制（RBAC 式），以及桌面 / 模拟互联网 / 档案系统外壳。系统项目的页面根目录可以是 `apps/` 而非 `pages/`；在 `tools/config.mjs` 里设置一次 `pagesDir` 即可（tooling.md §2）。
- **设备、状态、装置**：`references/structure/form-device.md` ——按设备类的外壳组件、R13 状态契约（进度 / 世界回应存储）、装置单页豁免。

## 2. 页面骨架模板（所有页面统一）

规范文件：**`assets/templates/html/page-skeleton.html`**。6b 逐页复制它，因此
head、脚本顺序与皮肤链接永远不会偏离本节的描述。

**常驻顶栏** ——每个页面的页头（容器 B 的顶部菜单栏同样如此）固定在视口顶部，
长页面滚动时也不离开视野（base.css 全站给出 `position: sticky; top: 0` + 不透明
背景，深层页同样如此）；页头带有该组织自己的导航链接，它们与页脚自己的链接
（以及被选中时的 M1 搜索框）一起，构成公开页面携带的全部跨页链接（R7）。每个
`<input>` 的 placeholder 都标明字段名（`Search...`、`Employee ID`）（R4）。每个
页面都以相同顺序加载相同的两个脚本（`components.js` 在 Alpine 运行时之前），且
不带任何内联行为接线，行为都在 `x-data` 组件里。深层页页脚可以使用 `ex/36` 或
`?/36` 这类反常数字（M7）；`[This content has been deleted]` 占位符是合法的叙事元素。
