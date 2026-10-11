# 前端模板（`assets/templates/`）

这里是真实文件，不是 markdown 代码块：步骤 6a 用初始化脚本按 flag 复制
`docs/system-profile.md` 选中的部分，其余不发（flag 表见下）。把装配记录没有选中的
机制一起交付出去就是模块漂移（`references/common-mistakes.md` §6）。
每个模板的行文规则都留在逐文件引用的参考文档里。没有对应装配记录行的模板，绝不能
「为了保险」而粘贴进来。

## init-project.mjs 的 flag（步骤 6a 运行）

`node <skill 仓库>/assets/tools/init-project.mjs <项目根> [flags]`——对已存在文件
一律跳过、绝不覆盖：

| flag | 落地什么 |
|---|---|
| 无 flag 也落地 | 起点项目（入口外壳、`base.css`、`surface.css`、`components.js` 内核、两个 ignore 文件、README）、`tools/`、`viewer/`、`docs/` |
| `--m1` | `js/modules/search.js` 注入内核；空而合法的 `data/keywords.*.src.json` 与生成的哈希表 |
| `--m2` `--m3` `--m7` `--m12` `--m14` | 分别注入 `gate.js` / `access.js` / `progress.js` / `staging.js` / `read-state.js` |
| `--m5` `--m6` | `css/secret.css` / `css/forbidden.css` |
| `--device phone` | `css/phone.css` + 注入 `js/modules/phone.js` |
| `--device browser-chrome` | `css/chrome.css` |
| `--device desktop` / `--device pure-web` | 无额外文件 |

M5 换皮不需要组件函数体：内核的 `session.reskin()` 已携带令牌，深层页面直接链接
`secret.css`。挂载标记（`html/*.html`）不是复制件：写页面时按形态逐字取用。

## js/modules/*.js —— Alpine 组件函数体

每个文件都是某一次 `Alpine.data(...)` 注册的函数体。初始化脚本按 flag 把它注入项目
`components.js` 里的 `alpine:init` 监听器（内核已被手改时，脚本会点名需要手动粘贴的
文件）。**绝不要在组件文件里重新定义 `hash`、`session` 或 `readState`**。它们住在起点
项目的内核（`assets/starter/assets/js/components.js`）里，是共用的。

| 文件 | 模块 | 依赖 | 挂载 / 规则 |
|---|---|---|---|
| `search.js` | M1 | `hash()` 内核 | `assets/templates/html/search.html` · `references/structure/components.md` §2 |
| `gate.js` | M2 | `hash()` + `session` 内核 | `assets/templates/html/gate-a.html` / `gate-b.html` / `login-multi.html` · `references/structure/components.md` §3 |
| `access.js` | M3 | `session` 内核 | `assets/templates/html/access-protected.html` · `references/structure/form-system.md` §3 |
| `staging.js` | M12 | — | 文件尾部注释里的内联挂载 · `references/structure/components.md` §4 |
| `progress.js` | M7 | 页脚挂载（骨架页脚槽位） | `assets/templates/html/page-skeleton.html` · `references/structure/components.md` §6 · `references/guardrails.md` R13 |
| `read-state.js` | M14 | `readState` 内核 | `assets/templates/html/read-entry.html` · `references/structure/form-device.md` §3–4 · `references/guardrails.md` R13 |
| `phone.js` | 设备类：phone | — | `assets/templates/html/phone-shell.html` + `assets/templates/css/phone.css` · `references/structure/form-device.md` §2 |

## html/*.html —— 挂载形态

`page-skeleton.html` 是每一页的统一骨架（规则：`references/structure/base.md` §2）。
门禁 / 搜索 / 权限挂载是组件的宿主标记；标记属性（`x-show="unlocked"`、`data-expect-hash`、
`data-index`）必须逐字保持原样。`tools/check-solvable.mjs` 和 `tools/check-links.mjs`
读取的正是它们。

## css/*.css —— 皮肤与外壳

| 文件 | 由谁选中 | 内容 |
|---|---|---|
| `secret.css` | M5 | 深层皮肤：重新调校 base.css 的自定义属性 + `body.secret` |
| `forbidden.css` | M6 | 禁用词全页状态（`body-forbidden`） |
| `phone.css` | 设备类：phone | 状态栏 / 应用外壳 / 聊天气泡 / 灰线 / 手机边框 |
| `chrome.css` | 设备类：browser-chrome | 画出来的地址栏 / 标签条 / 装置单页 |

`base.css` 和 `surface.css` 随起点项目一起交付（`assets/starter/assets/css/`），这里不重复。
每个皮肤文件都重新调校 base.css 读取的同一批自定义属性（`--ink`、`--paper`、`--rule`、
`--accent`……）。项目只在皮肤里改颜色，绝不动内核 CSS。
