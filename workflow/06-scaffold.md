# 步骤 6 — 脚手架

按顺序两次派发：6a 构建系统框架，其上下文里不含任何剧情；6b 用剧情产物补齐页面骨架。**输出：**整棵文件树，每一页都有骨架。

**6a 不等门禁。**步骤 2 一返回就派发，与步骤 3–5 并行；6b 要等 6a 和门禁都完成。文案可能在步骤 3–5 的产物出现之前就落盘：`docs/` 不存在则创建，绝不覆盖。`docs/story-canon.md` 及后续产物随各自轮次返回而落到那里。

**输入：**6a：`docs/system-profile.md`、references/guardrails.md（禁止形态）、references/structure/base.md、references/structure/components.md（规则与约定，代码本身作为文件随 `assets/templates/` 发出，索引见 `assets/templates/README.md`）、所选容器的形态文档（A 用 references/structure/form-website.md，B/C/D 用 references/structure/form-system.md），以及——当装配记录的设备类不是纯 Web、其状态契约选了持久化或世界回应、或第 3 轴选了装置形态时——references/structure/form-device.md。6b：`docs/gdd.md` 第 1、2 节、`docs/registry.md`、`docs/reachability.md`、`docs/puzzle-audit.md`、6a 的框架、references/guardrails.md（禁止形态）、references/structure/base.md，以及形态文档。6b 读项目自己的 `components.js` 和 `base.css`（6a 已经实例化了选中的组件）来代替 references/structure/components.md，而且它不写文案，所以设计手册不进它的上下文。

## 6a — 前端系统框架（不看剧情）

步骤 2 与用户一起写出了 `docs/system-profile.md`；6a 消费它。装配记录就是那份组装账：容器与形态文档；设备类与状态契约（登录 cookie · 进度 持久化 / 会话 / 无 · 世界回应行）；技术形态（多页，或带五项在案条件的装置单页）；系统身份（类型、组织、时代、语域、语言）；选中的模块；外壳信息架构（顶栏、目录布局、页面根、C 的站点根）；基础页；基础设施（base.md 各节、components.js、内置的 Alpine、tools/、CONFIG 旋钮）；索引/权限约定；编号方案。它不含人物、剧情、秘密、线索设计、结局、原始故事源，也不含先前的产物。

严格按 `references/structure/base.md` §1 构建框架，每一页都从 `assets/templates/html/page-skeleton.html` 复制页面骨架（它是 `references/structure/base.md` §2 背后的规范文件），并遵循形态文档：

- 完整的目录树，含各区域（按 base.md 的命名规则：受限区用虚构作品自己的词，绝不用 `secret/`）
- `index.html` 入口外壳（开始按钮；只有装配记录列了规则才放规则占位，其文案在步骤 7 阶段 7 落地），带上指回本 skill 仓库的链接
- 系统外壳与基础页——A：主页、导航/索引/列表模板、搜索结果、登录/门禁模板；B：`desk.html` 加空白应用外壳；C：站点根、内网主页与登录页；D：`query.html`、`results.html`、详情模板
- 装配记录选定的皮肤 CSS（`base.css` 与 `surface.css` 总是要有，取自起点项目；模块皮肤与设备皮肤从 `assets/templates/css/` 原样照抄——`secret.css` 只在选 M5 时、`forbidden.css` 只在选 M6 时、`phone.css` / `chrome.css` 只在装配记录的设备类要求时），以及 `components.js`，只携带选中的组件，每个函数体从 `assets/templates/js/modules/` 复制进 `alpine:init` 监听器（`search.js` / `gate.js` / `access.js` / `staging.js` / `progress.js` / `read-state.js` / `phone.js`），挂载标记取自 `assets/templates/html/`（`search.html`、`gate-a.html` / `gate-b.html` / `login-multi.html`、`access-protected.html`、`read-entry.html`、`phone-shell.html`）；这些文件实现的规则在 `references/structure/components.md` 与 `references/structure/form-device.md` 中；还有内置的 Alpine 运行时（`assets/js/vendor/alpine.min.js`，由 `node tools/vendor-alpine.mjs` 生成，该脚本固定版本并在写入前校验 sha256）
- 装配记录记下的状态契约：登录一律走内核的会话存储；内核的 `readState` 存储加上 `markRead` 挂载与 `data-after` 锚点只在世界回应下出现（M14）；`progress.js` 的存储按契约执行（`persistent` 保留 localStorage，`session` 换成 sessionStorage，`none` 把该模块整个拿掉）；存档/继续/清除的开机界面只在持久化契约下、且带剧内包装时提供。任何未选中的机制都不得出现 (R13)
- 从本 skill 的 `assets/tools/` 复制到 `tools/` 的工具文件（`config.mjs`——每个检查器都导入的共享约定，也是改名后的项目唯一需要改动的文件——加上 `hash.mjs`、`build-keywords.mjs`、`check-links.mjs`、`check-solvable.mjs`、`check-credentials.mjs`、`check-reachability.mjs`、`vendor-alpine.mjs`、`site-model.mjs`、`site-graph.mjs`；零依赖，只用 Node 内置模块），把渲染器目录树 `assets/viewer/` 整体复制到 `viewer/`（`graph-viewer.html` 外壳加 `css/` 与 `js/`，site-graph 在 `../viewer/graph-viewer.html` 解析模板），以及仅在选中 M1 时提供空而合法的关键词表
- 两个忽略文件，它们随起点项目目录树以 `.gitignore` 与 `.dockerignore` 的形式存在，复制时落到项目根目录。它们不是装饰。没有它们，明文的 `data/*.src.json` 表会被提交并随部署带走，生成的 `docs/site-graph.*` 加上某个代理的 `memory/` 会伪装成项目内容（`references/structure/base.md` §1）
- 选中 M10 时的结局页，以及 `docs/`——不存在则创建、绝不覆盖——随步骤 1 到 5 的产物落地而收存它们
- 按 `references/structure/base.md` §2 骨架做的每一张基础页：正确的皮肤、页头导航、页脚、选中 M7 时的进度编号，正文留空或放占位

框架是一个真实系统的外壳，不是游戏：任何地方都不得出现剧情文案，文件名不得剧透。基础页文案用系统自己的词（通知公告、通讯录），绝不用故事的词。各页保持独立文档、有真实导航；Alpine 只管理页内组件生命周期（`init()` / `destroy()`）——路由与场景切换不归它管。

**返回：**改动文件清单加未决问题，经编排者回传。

## 6b — 页面骨架（看剧情）

在 6a 的框架上，把触达表中列出的每一页都搭成骨架，配好正确的皮肤、页头导航、页脚和进度编号（选中 M7 时）。正文为空在这一步没关系；缺一个文件就会让步骤 8 的走图断掉。结局页在这里只是骨架，文案在步骤 7 落地。

框架已定：不要重建外壳、CSS、组件或工具——只补页面集合。

本步骤的基线测试陷阱：references/common-mistakes.md §6 ——交回产物前先对照检查。
