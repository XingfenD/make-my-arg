# 形态——系统类虚构（容器 B/C/D）

当容器是一台机器——桌面（B）、模拟互联网 / 内网（C）、档案系统（D）——触达靠
**账号登录 + 按账号访问**（R10）来区分，而不是靠页面链接。先读
`references/structure/base.md`；本文件在其上叠加系统层（门禁 / 暂存 / 换皮组件：
`references/structure/components.md`；工具：`references/structure/tooling.md`）。
只有当虚构设定中确实存在身份与登录时才选择 M3 模块——触达服从容器。

## 1. 触达模型——是账号，不是等级（RBAC 式）

- **登录门禁**认证一个账号：组件根上放 `data-grant="chen"` +
  `data-next="apps/mail.html"`。成功后把账号记入**会话 cookie**（跨标签页，浏览器
  关闭时清除）——而不是每标签页一份的 `sessionStorage`，`target="_blank"` 的结果
  会在全新标签页中打开、状态就此丢失（`references/structure/components.md`
  §2–§3）。一个输入框可通过 `data-grants` 服务多个角色（§2）。
- **受保护页面或区块**指明获准读取它的账号：`data-access="chen"`（逗号分隔 = 任一，
  `*` = 任何已认证者）。它仍以 `x-show="unlocked"` 开头，好让
  `check-solvable.mjs` 建模这条边界。
- **没有权限阶梯（R10）。** 页面只对它点名的账号开放；管理员账号绝不继承同事的
  私密文件。如果剧情需要管理员访问某份文件，就在页面上点名它，并由虚构设定给出
  理由。
- **跨越深度只能靠搜索、门禁或账号——绝不能靠链接（R7）。** 浅层页面不得携带通往
  更深区域的"相关文件 / 档案 / 页面"链接（`workflow/04-reachability.md` 审计这一点）；
  每份私密文档都保持关闭，直到找到并使用它自己的账号。
- **账号在会话内累积**（有意的简化）：认证一次，跨标签页可用；关闭浏览器即全部
  清除。找到每个账号本身就是一个谜题节拍。
- **账号靠推断得出，不是印出来（R10）。** 只有初始账号可以印出；其他每个账号都由
  文本线索（一个姓名、一个工号、一个入职年份、一个署名邮箱）加上门禁页公布的
  账号格式拼出来。把同事的登录名印出来会让权限矩阵塌掉；
  `workflow/05-puzzle-audit.md` Q4 专门扫查这种问题。
- **派生账号靠组成部分证明，绝不印出。** `check-solvable.mjs` 只匹配逐字出现的
  字符串，所以拼出来的账号会被判为 STUCK——把它印出来让检查变绿，等于泄露给每个
  访客（静态站点没有服务端鉴权；客户端遮蔽不是隐私）。在
  `data/credentials.src.json` 中声明值 + 规则 + 组成部分；
  `check-credentials.mjs` 与 `check-reachability.mjs` 负责证明（`tooling.md` §3 item 6）。

### 搜索 / 查询结果服从权限矩阵

检索系统是另一条触达路径，因此它经由同一个矩阵解析——关键词索引**不是**存放权限
的地方：

- 全站一张索引（`data/keywords.json`）；系统形态没有分层 JSON 拆分。
- 目标页面执行它自己的 `data-access`：会话内账号无权读取的文档只显示锁定提示 /
  登录链接，绝不显示文档本身。
- 剧情内列表（档案检索结果、邮箱行）把不可读条目显示为一条朴素的锁定提示，或把
  它导向登录门禁；绝不把文档链接开来。
- `check-solvable.mjs` 对此建模：搜索边只有在它点名的某个账号通过认证后，才能打开
  受保护文档（关键词必须先在某个可读页面里被读到）。

网站形态保留按受众分表的做法（`references/structure/form-website.md`）；在这里，
权限矩阵取代了它们。

## 2. 登录页（`gate` + `data-grant` / `data-grants`）

一个登录框，一套凭据对应一个身份。`data-grant` 是该门禁可授予的身份扁平列表——
`check-solvable.mjs` 走的就是它。`data-grants` 是根上的 JSON 映射，把*键入的账号*
解析为它的身份、它自己的密码哈希，以及可选的换皮令牌；运行时按条目把账号与密码
配对，所以 `intern + handler-pw` 会被拒绝。**不要把一次登录拆成两个表单来给检查器
制造"一个表单 = 一个身份"**——第二个表单的标题会泄露设计意图，读起来像游戏 UI。

规范文件：**`assets/templates/html/login-multi.html`**（组件体：
`assets/templates/js/modules/gate.js`）。

`gate` 组件先读 `data-grants`，再回退到 `data-grant`
（`references/structure/components.md` §3）。凭据三件套仍然适用（A 页放账号线索、
B 页放密码线索、C 页放门禁）。账号字符串就是其他页面比对的身份；除了初始账号
（§1）之外，它不印在任何地方。

## 3. 受保护页面（`access` 组件）

规范文件：**`assets/templates/html/access-protected.html`**（挂载：
`<main x-data="access" data-access="chen">`，锁定提示放在 `x-show="!unlocked"` 上，
文档放在 `x-show="unlocked"` 内）与 **`assets/templates/js/modules/access.js`**
（组件体——读取门禁设置的跨标签页会话 cookie，隐私模式下回退到 sessionStorage；
在新标签页中打开的文档依然能解锁，而按标签页的存储做不到这一点）。

一个页面可以既受保护*又*带门禁（金库）：门禁表单位于被锁定的部分内，因此走图先
认证账号，再解门禁。

## 4. 各容器外壳

- **B 桌面**：`desk.html`（图标网格 + Dock + 菜单栏）；每个应用一页（`chat.html`、
  `mailbox.html`、`cloud-drive.html`…）。Spotlight `FILE_DATABASE` 是明文 JS，对
  `check-solvable` 不可见——把它的条目镜像到关键词表里，或人工验证（`tooling.md`
  §3 item 2）。操作系统账号就是登录。
- **C 模拟互联网**：每个站点一个顶层目录（`sites/forum/`、`sites/blog-2009/`…），
  跨站链接用绝对路径；内网登录就是账号系统。每个站点根目录跑一次工具
  （`tooling.md` §3 item 5）。
- **D 档案系统**：`query.html`（多字段门禁：姓名 / 证件号 / 日期）→ `results.html`
  （编目条目；不可读的行显示朴素的锁定提示，或解析到它们的登录门禁）→ 档案详情页，
  每页携带 `data-access`。访问权限取决于账号，绝不是等级。
- **A 仿官方网站**可以为内网子区域借用这套模式；它的公开页面遵循
  `references/structure/form-website.md`。

## 5. 检查器约定（`assets/tools/`）

- 登录门禁：`data-grant`（+ `data-grants`）+ `data-next`。`check-links.mjs` 像解析
  链接一样解析 `data-next`；`check-solvable.mjs` 把它当作解锁后的边来跟随，并走
  扁平的 `data-grant` 列表。
- 受保护页面/区块：`data-access` + `x-show="unlocked"`。在某个已认证账号被点名之前，
  该区块对走图保持不可读；`data-access` 点名了一个任何门禁都不授予的账号时，会被
  报为不可达——这是线索图断裂，不是检查器出错。
- 派生/组合账号在逐字匹配模型之外：在 `data/credentials.src.json` 中声明它，并运行
  `check-credentials.mjs` + `check-reachability.mjs`；绝不要为了让 `check-solvable`
  变绿而把它印出来（§1）。
- 若页面根目录不是 `pages/`（如 `apps/`），在 `tools/config.mjs` 里设置 `pagesDir`
  （`tooling.md` §2）。只存于 JS 的状态，以及按标签页与跨标签页会话存储的差别，对
  检查器不可见——用 `data-grant` / `data-access` 对它建模，或人工验证（`tooling.md`
  §3 第 1 与第 7 项）。

## 6. 会话状态（登录）——其他状态族遵循 R13

**登录**状态存放在**会话 cookie**（跨标签页，浏览器关闭时清除）里，绝不在
`localStorage`，绝不在 `target="_blank"` 结果背后那每标签页一份的
`sessionStorage` 里。这是实现要求，不是面向玩家的文案。进度与世界回应状态是另一份
契约：状态跟随设备归属（`references/guardrails.md` R13），细节见
`references/structure/form-device.md` §3——玩家自有的设备（容器 B）可以持久化已读
内容，并提供剧情内的存档 / 继续 / 清档；远程系统（A/C/D）只用会话级存储，除非
装配记录写明剧情依据。

## 7. 反模式

| 反模式 | 为何失败 |
|---|---|
| 数字化权限阶梯，或一个能打开一切的管理员账号（R10） | 这不是按人分配的访问权限：私密文档会泄露给等级最高的账号，登录也不再是谜题；workflow/04 的访问检查把它判为缺陷 |
| 浅层页面用"相关档案 / 文件"链接通向深区（R7） | 用链接跨越了深度；触达必须经过搜索、门禁或账号 |
| `data-access` 点名了一个任何门禁都不授予的账号 | 私密页变成死页；check-solvable 报告它不可达 |
| 登录状态放进 `localStorage`，或放进 `target="_blank"` 结果背后那每标签页一份的 `sessionStorage` | 远程系统若在浏览器关闭后仍记得你，就破坏了会话式虚构（R13）；按标签页的 sessionStorage 会在结果打开的新标签页里显示为未登录——请用会话 cookie |
| 从参考实现抄来的持久化，背后没有装配记录的对应行 | 状态契约（进度 / 世界回应）在步骤 2 由设备归属决定（R13）；未经授权的 `localStorage` 写入通不过步骤 8 的契约检查 |
| 在公开页面印出派生账号，好让 `check-solvable` 变绿 | check-solvable 只匹配逐字字符串；印出凭据会把它泄露给每个访客（没有服务端鉴权），并让谜题塌掉。请改用 `check-credentials.mjs` 证明它 |
| 把一次登录拆成两个表单，让每个都是"一个身份" | 第二个表单的标题泄露设计意图，读起来像游戏 UI；一个输入框 + `data-grants` 就能承载矩阵（§2） |
| 公开页面印出同事的登录名（花名册里的 `账号：chen.gd`） | 只有初始账号可以印出；其他登录名都要从线索推断（workflow/05 Q4 会扫查它） |
