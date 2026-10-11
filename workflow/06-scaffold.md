# 步骤 6 — 脚手架

按顺序两次派发：6a 构建系统框架，其上下文里不含任何剧情；6b 用剧情产物补齐页面骨架。**输出：**整棵文件树，每一页都有骨架。

**6a 不等门禁。**步骤 2 一返回就派发，与步骤 3–5 并行；6b 要等 6a 和门禁都完成。文案可能在步骤 3–5 的产物出现之前就落盘：`docs/` 不存在则创建，绝不覆盖。`docs/story-canon.md` 及后续产物随各自轮次返回而落到那里。

**输入（6a，不看剧情）：**`docs/system-profile.md`、references/guardrails.md（禁止形态）、references/structure/base.md、references/structure/components.md（规则与约定，代码本身作为文件随 `assets/templates/` 发出，索引见 `assets/templates/README.md`）、所选容器的形态文档（A 用 references/structure/form-website.md，B/C/D 用 references/structure/form-system.md），以及——当装配记录的设备类不是纯 Web、其状态契约选了持久化或世界回应、或第 3 轴选了装置形态时——references/structure/form-device.md。

**输入（6b，看剧情）：**`docs/gdd.md` 第 1、2 节、`docs/registry.md`、`docs/reachability.md`、`docs/puzzle-audit.md`、6a 的框架、references/guardrails.md（禁止形态）、references/structure/base.md，以及形态文档。6b 读项目自己的 `components.js` 和 `base.css`（6a 已经实例化了选中的组件）来代替 references/structure/components.md，而且它不写文案，所以设计手册不进它的上下文。

## 6a — 前端系统框架（不看剧情）

步骤 2 与用户一起写出了 `docs/system-profile.md`；6a 消费它。装配记录就是那份组装账：容器与形态文档；设备类与状态契约（登录 cookie · 进度 持久化 / 会话 / 无 · 世界回应行）；技术形态（多页，或带五项在案条件的装置单页）；系统身份（类型、组织、时代、语域、语言）；选中的模块；外壳信息架构（顶栏、目录布局、页面根、C 的站点根）；基础页；基础设施（base.md 各节、components.js、内置的 Alpine、tools/、CONFIG 旋钮）；索引/权限约定；编号方案。它不含人物、剧情、秘密、线索设计、结局、原始故事源，也不含先前的产物。

严格按 `references/structure/base.md` §1 构建框架，每一页都从 `assets/templates/html/page-skeleton.html` 复制页面骨架（它是 `references/structure/base.md` §2 背后的规范文件），并遵循形态文档：

- **先跑初始化脚本。**机械镜像一步落地：起点项目（入口外壳、`base.css`、`surface.css`、`components.js` 内核、两个 ignore 文件、README）、`tools/`、`viewer/`、`docs/`，加上按 flag 选中的皮肤、组件函数体与 M1 空关键词表。它对已存在文件一律跳过、绝不覆盖：

  `node <skill 仓库>/assets/tools/init-project.mjs <项目根> [--m1] [--m2] [--m3] [--m5] [--m6] [--m7] [--m12] [--m14] [--device phone|desktop|browser-chrome|pure-web]`

  flag 与装配记录逐行对应：选中的模块各给一个 `--m*`，设备类为 phone 或 browser-chrome 时传对应 `--device`。flag 与模板文件的对照表在 `assets/templates/README.md`；各文件为何存在，在 `references/structure/base.md` §1。跑完在项目根执行 `node tools/vendor-alpine.mjs`，把钉住版本的 Alpine 写进 `assets/js/vendor/alpine.min.js`（校验 sha256）。组件内核已被手工改过时，脚本会点名哪些函数体需要手动拼接。
- 完整的目录树，含各区域（按 base.md 的命名规则：受限区用虚构作品自己的词，绝不用 `secret/`）——区域命名是判断题，脚本不猜虚构词汇
- `index.html` 入口外壳改成装配记录的组织名与它的一句话自我介绍（开始按钮；只有装配记录列了规则才放规则占位，其文案在步骤 7 阶段 7 落地）；保留指回本 skill 仓库的链接
- 系统外壳与基础页：
  - A：主页、导航/索引/列表模板、搜索结果、登录/门禁模板
  - B：`desk.html` 加空白应用外壳
  - C：站点根、内网主页与登录页
  - D：`query.html`、`results.html`、详情模板
- 装配记录记下的状态契约：
  - 登录走内核的会话存储（默认会话 cookie，跨标签页；装配记录写明剧情依据时可改为 `localStorage` 持久化）
  - 内核的 `readState` 存储加上 `markRead` 挂载与 `data-after` 锚点只在世界回应下出现（M14）
  - `progress.js` 的存储按契约执行（`persistent` 保留 localStorage，`session` 换成 sessionStorage，`none` 把该模块整个拿掉）
  - 存档/继续/清除的开机界面只在持久化契约下、且带剧内包装时提供。任何未选中的机制都不得出现 (R13)
- 按 `references/structure/base.md` §2 骨架做的每一张基础页：正确的皮肤、页头导航、页脚、选中 M7 时的进度编号，正文留空或放占位；门禁、搜索、登录、权限、读态与手机外壳的挂载标记在写页面时取自 `assets/templates/html/`，标记属性逐字保持（检查器读它们）
- 选中 M10 时的结局页；`docs/` 已由初始化脚本建好，随步骤 1 到 5 的产物落地而收存它们

框架是一个真实系统的外壳，不是游戏：任何地方都不得出现剧情文案，文件名不得剧透。基础页文案用系统自己的词（通知公告、通讯录），绝不用故事的词。各页保持独立文档、有真实导航；Alpine 只管理页内组件生命周期（`init()` / `destroy()`）——路由与场景切换不归它管。

**返回：**改动文件清单加未决问题，经编排者回传。

## 6b — 页面骨架（看剧情）

在 6a 的框架上，把触达表中列出的每一页都搭成骨架，配好正确的皮肤、页头导航、页脚和进度编号（选中 M7 时）。正文为空在这一步没关系；缺一个文件就会让步骤 8 的走图断掉。结局页在这里只是骨架，文案在步骤 7 落地。

框架已定：不要重建外壳、CSS、组件或工具——只补页面集合。

## 完成判据

逐项核对 6a 与 6b 合起来的交付；任何一项未过，本步就未完成。

- [ ] 完整目录树存在；每个区域命名遵循 `references/structure/base.md` §1，受限区用虚构作品自己的词
- [ ] 触达表中列出的每一页都有对应 HTML 文件；缺一个文件就让步骤 8 的走图断掉
- [ ] 全站零剧情文案、文件名零剧透；基础页只承载系统自己的话语，正文为空或占位
- [ ] 未选中的模块零残件：没有闲置的皮肤、搜索表、门禁组件或账号家具 (R13)
- [ ] `tools/`、`viewer/`、两个忽略文件已落地；`docs/` 不存在则创建、绝不覆盖

本步骤的基线测试陷阱：references/common-mistakes.md §6 ——交回产物前先对照检查。
