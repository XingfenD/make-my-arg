# Alpine 组件规则与约定

> `references/structure/base.md`（树 + 骨架）的配套文档。规范的前端代码模板以
> **真实文件的形式放在 `assets/templates/`** 下（js/css/html——索引：
> `assets/templates/README.md`）；步骤 6a 用初始化脚本落地装配记录选中的那些。
> 本文件给出这些模板实现的*规则与约定*：关键词哈希构建（§1）、搜索 M1（§2）、
> 门禁 M2（§3）、暂存 M12（§4）、换皮 M5（§5）、进度 M7（§6）。步骤 6 和 7 的必读材料。
> 规则 ID `(Rn)` 引自 references/guardrails.md。

## 1. 关键词哈希构建（tools/build-keywords.mjs）

每个受众一个明文源，哈希成每个受众一张表（R3）。公开表由公开页面获取，**绝不能
包含受限区 URL**（默认 `internal/`；R8）；深层表只由深层页面获取。`title` 是档案
库会印出的编目条目（发文机构 + 文档类型 + 编号/日期）——绝不是文档内容的摘要
（R9）。这是网站形态的约定（references/structure/form-website.md）；系统形态只保留
一张索引，让权限矩阵决定一次命中打开什么（references/structure/form-system.md
§1）——权限绝不在 JSON 里维护（R10）。

规范实现以 **`assets/tools/build-keywords.mjs`** 发布（复制到 `tools/`）。其契约：

- 发现每一个 `data/keywords*.src.json`，并在其旁写出对应的 `data/keywords*.json`，因此分层约定（`keywords.surface.src.json` → `keywords.surface.json`）与单表项目（`keywords.src.json` → `keywords.json`）都能零配置工作。
- 键支持 `|` 分隔的同义词别名。值为 `"url|title"`；url 相对 `pages/`。
- 用 `String(w).trim().toLowerCase()` → md5 → base64 归一化。这**必须与** `tools/hash.mjs` 及起点内核中的页内 `hash()` 辅助函数**逐字节一致**；若要改用异步 WebCrypto SHA-256，三处必须一起改。
- 在同一个哈希桶内按 url 去重，这样归一化为同一哈希的两个别名绝不会把同一页面列两次。

源文件示例：

```json
{
  "前台|营业时间": ["news.html|焰溪镇供销社 营业时间公告"],
  "Margaret Holt": ["internal/s23-file.html|刑事侦查卷宗 087-J-03 · 询问笔录"]
}
```

部署时**不要带上 `.src.json` 文件**（R3）：起点 `.gitignore` 与 `.dockerignore`
已内置这条规则（`references/structure/base.md` §1）。若一张名字表明它是公开索引的表
（`data/keywords.surface*.json`）带有受限区 url（默认 `internal/`；R8），`tools/check-links.mjs` 也会判部署失败。

## 2. 搜索引擎（`search` 组件）——三态反馈

规范代码：**`assets/templates/js/modules/search.js`**（组件体，依赖内核的
`hash()`）与 **`assets/templates/html/search.html`**（挂载标记）。注册在项目的
`components.js` 中；search.html 以 `<main x-data="search" data-index="data/keywords.surface.json">`
挂载（深层页的搜索把 `data-index` 指向深层表）。挂载渲染三种状态：命中 / 未命中 /
禁止，外加空输入提示；禁止分支读取 `data/forbidden.json`（M6）并切换整页状态
（`body-forbidden`）。

**共享哈希契约。** 页内 `hash()` 位于起点内核
（`assets/starter/assets/js/components.js`），其契约与 `tools/build-keywords.mjs`
一致（§1）；绝不要在组件模板里重新定义它。

**分层作用域（搜索模块按受众拆分索引时必需，R8）。** 组件查询挂载它的那个受众的
索引：公开页携带 `data-index="data/keywords.surface.json"`；深层页携带
`data-index="data/keywords.secret.json"`。公开关键词路由到公开页或门禁——绝不能
直达受限文档。当虚构作品列出访客无权打开的条目时（容器 D 的档案列表），每条要么
显示一条朴素的锁定提示，要么解析到它的门禁；绝不能直接打开文档。结果标题是编目
条目，按发文机构归档该文档的写法书写（R9）。系统形态不按受众拆分索引；它们保留
一张索引，通过权限矩阵解析每次命中（`references/structure/form-system.md` §1，R10）。

系统容器用自己的外壳取代这个搜索枢纽——桌面 Spotlight `FILE_DATABASE`、档案查询
表单、跨站链接；见 `references/structure/form-system.md` §4。

**新标签页与会话状态（系统容器必读）。** `target="_blank"` 在全新标签页中打开每个
结果，而新标签页拿到的是全新的 `sessionStorage`，因此以这种方式打开的
`data-access` 保护文档会被读成锁定状态，尽管玩家在原标签页里已经"登录"。任何把
账号登录与新标签页结果交叉在一起的容器（容器 D 的 `query → results → archive` 链）
都必须把会话状态放在跨标签页共享的存储里（内核默认会话 cookie；装配记录写明剧情依据时也可用 `localStorage`），而不是每标签页一份的 `sessionStorage`。
`check-solvable.mjs` 把身份建模为一个全局集合，看不见按标签页的隔离，所以真实
浏览器已经失败时它仍报绿。只有步骤 8 的跨标签页人工测试能抓住这一点
（tooling.md §3 item 7）。

## 3. 密码门禁（`gate` 组件）

规范代码：**`assets/templates/js/modules/gate.js`**（组件体，依赖内核的 `hash()`
与 `session` store——绝不要在组件里重新定义 `ACCESS_KEY` / `SKIN_KEY` / cookie
辅助函数；起点内核带有会话 cookie 实现）以及三种挂载形态：

- **形态 A** —— `assets/templates/html/gate-a.html`：成功后跳转离开（`data-next`、`data-fail-hint`）。
- **形态 B** —— `assets/templates/html/gate-b.html`：就地解锁，不跳转。门禁后的区块必须以 `x-show="unlocked"`（或 `<template x-if="unlocked">`）开头：`tools/check-solvable.mjs` 依据这个标记区分哪些文字在门禁前可读、哪些只有通过门禁后才可读。
- **形态 C** —— `assets/templates/html/login-multi.html`：会话登录 + 按账号访问（系统容器 B/C/D）：登录门禁上用 `data-grant`，受保护页面上用 `data-access`，没有权限阶梯（R10）。完整模式见 `references/structure/form-system.md` §2–§3；组件体先读 `data-grants`（账号→身份的 JSON 映射），再回退到扁平的 `data-grant` 列表。

一个组件、三种形态，外加一种声明式通配：`data-expect-any` 标记一道按设计不校验
答案的叙事门禁。任何非空值都能通过，因此走图绝不会为它寻找哈希
（`references/structure/form-device.md` §4）。`data-expect-hash` 放在**每一个
`<input>`** 上（逗号分隔的值 = 该字段接受的同义答案，这样一个中文名和它的拼音都
能开同一把锁）；其余配置放在**组件根**（`<main>`）上，而不是 `<form>` 上。

`hash()` 是 §2 的共享辅助函数。设计门禁时，落实**凭据三件套**（账号在 A 页、
密码线索在 B 页、门禁在 C 页；设计方式菜单：`references/credential-design.md`；
例子：生肖年份 → 1977）。哈希让源码中不会随意看到明文（R3）。

凭据可以是**派生/组合**的：部件分散在不同公开页，完整串不出现在任何页面（设计方式
见 `references/credential-design.md` 方式 3）。`check-solvable.mjs` 只匹配在可读
页面中*逐字*出现的值，因此它无法证明派生凭据可解，会把门禁报为 STUCK。**绝不要
为了让它变绿而把凭据印出来**。那会把它泄露给每个访客（静态站点没有服务端鉴权；
客户端遮蔽不是隐私，R12），并让谜题塌掉。在 `data/credentials.src.json` 中声明该值、
其组成规则与它在公开页面上的组成部分，用 `tools/check-credentials.mjs` 证明它
（组成部分 + 规则 + 零明文）；用 `tools/check-reachability.mjs` 证明"已知凭据即可
触达"。见 tooling.md §1 与 §3。

门禁设计规则：

- **失败提示要迂回地指向线索来源，且到此为止（R4）。** `密码错误 🎂` 合格；点名某个页面、复述推导过程、或拼出字段内容都不合格；光秃秃的"error"被禁止。
- **输入框只标明字段名（R4）。** `placeholder="Employee ID"` / `工号` 合格；`placeholder="e.g. 1977"` 属于泄露。推导规则不放在门禁页上；*账号格式*可以贴在那里。
- **多字段门禁**由多个 `data-expect-hash` 输入框组成；必须全部匹配。门禁页自身的正文在门禁通过前不可读。藏在它自己的 `x-show="unlocked"` 区块里的线索在解锁前不算数。
- **通配门禁必须显式声明，绝不能隐含。** 不索要任何可验证秘密的门禁（一次情感性的"输入即通过"仪式）要把它的输入标记为 `data-expect-any`；门禁页上未标记的输入会触发 `check-solvable.mjs` 的 NOTE，并始终属于泄漏类问题（workflow/05 Q4）。
- **会话状态是技术实现，不是文案。**账号存放在跨标签页共享的存储里（机制与理由见 §2），站点也不向玩家解释自己的存储方式（`references/structure/form-system.md` §6）。进度与读态存储遵循装配记录的状态契约（R13；`references/structure/form-device.md` §3）。

## 4. 暂存组件（生命周期托管）

规范代码：**`assets/templates/js/modules/staging.js`** —— `blackout` /
`typewriter` / `reveal`，各自的挂载形态见文件尾部注释。所有定时器与观察者都在
`init()` 中注册、在 `destroy()` 中释放，因此暂存效果与其组件同生共死。

## 5. 可选：分层换皮（M5；base.css 约定）

共享布局与文档真实感类位于 **`assets/starter/assets/css/base.css`**（不变的内核
CSS：sticky 不透明页头、`.sheet` 文档套件、门禁表单、入口外壳）。深层皮肤模板是
**`assets/templates/css/secret.css`**。它重新调校 base.css 读取的自定义属性
（`--ink` / `--paper` / `--rule` / `--accent` / `--stamp` / `--bar` …），使深层页
引入它时（或 `session.skin()` 应用 `body.secret` 时）整页一起变调。其他文档引用的
质感类：`.hidden-text`（黑上黑，选中才显现）、`.blurred`（把涂黑作为线索）、
`.handwrite`、`.spacer`。客户端遮蔽不是隐私，用这种方式藏起来的一切都是公开的（R12）。

## 6. 可选：收集进度（`progress` 组件）

规范代码：**`assets/templates/js/modules/progress.js`**，挂载在共享页脚上；
`<body data-page data-total>` 携带编号。存储问题遵循装配记录的状态契约
（references/guardrails.md R13，细节见 references/structure/form-device.md §3）：
只有当装配记录写明 `persistent` 时（玩家自有的设备，或确实会存档的虚构设定），
进度才持久化。`progress: session` 时把 localStorage 换成 sessionStorage；
`progress: none` 时该模块本身不进游戏。登录状态不放在这里——它由内核的会话存储管理（§3），存储方式跟随状态契约。

世界回应状态（M14：某条目只有在读过某页后才出现）是并生机制——起点内核里的
`readState` store、`assets/templates/js/modules/read-state.js`（源页面上的
`markRead` 挂载）以及条目锚点上的 `data-after` 属性
（`assets/templates/html/read-entry.html`），规则见
`references/structure/form-device.md` §3–§4；属性是检查器走图的依据，JS 是玩家
看到的东西。
