# 步骤 7 — 实现

**输入：**搭好骨架的目录树加全部 `docs/` 产物。**输出：**完成的站点。每个阶段一个子代理。阶段 1→2→3 串成一条链，其余可重叠：4a 随 1 一同派发，4b 在 3 之后，5 与 3 并行，6 在 3 之后，7 最后。

| 阶段 | 工作 | 派发 |
|---|---|---|
| 1 | 公开页与拟真文档 | 子代理 |
| 2 | 搜索引擎与密码门禁——端到端完成一条最短可玩路径 | 子代理 |
| 3 | 受限区页面（选中 M5 时含换皮） | 子代理 |
| 4a | 图片、印章、扫描件、照片与仿制文档——把 GDD 资产清单声明的**每一件**资产都写出来，放在 `assets/` 下；暂不接入页面 | 子代理——随阶段 1 派发 |
| 4b | 等引用页面存在后，把 4a 的每件资产接进引用它的页面——`<img src>` / 下载链接 | 子代理——阶段 3 之后 |
| 5 | 暂存模块：倒计时黑屏、打字机、滚动渐显（选中 M12 时） | 子代理——可与阶段 3 并行 |
| 6 | 结局与破墙收尾（选中 M10 时） | 子代理 |
| 7 | 入口页：角色分配、开始按钮、声明的需求 | 子代理 |

阶段 7 最后落地，因为它的文案必须描述这个已经存在的游戏。资产工作是独立阶段，不是阶段 1–3 的细枝末节：没有阶段认领的徽标 / 印章 / 扫描件 / 照片，恰恰就是被漏掉的那一件，而且两个检查器都发现不了（从没写出来的 `<img>` 没有 `src` 可解析——references/structure/tooling.md §3 item 9）。4a 随阶段 1 一同派发，4b 在引用页面存在后接线。阶段 5 可与阶段 3 并行。

每个阶段的子代理只拿到它那一行点名的产物章节与参考文件——绝不拿到「列了章节的整份文件」——外加它负责的页面清单。它返回改动文件清单加未决问题。组件行为以项目自己的 `components.js` 为准（由 6a 写出）；`assets/templates/` 与 `references/structure/components.md` 是步骤 6a 的读物，不是步骤 7 的读物。

| 阶段 | 产物章节 | 参考 |
|---|---|---|
| 1 公开页与拟真文档 | gdd 第 1、2、8 节；`docs/registry.md` | `references/guardrails.md` (R5, R6, R12)、`references/design-playbook.md` §4、`references/structure/base.md`、形态文档 |
| 2 搜索引擎与密码门禁 | gdd 第 4、5 节；所负责页面的触达表行 | 项目的 `components.js` (search, gate)、`references/guardrails.md` (R3, R4, R8, R9)、形态文档；选中通配门禁或读态条目时加 `references/structure/form-device.md` §4 |
| 3 受限区页面（选中 M5 时含换皮；选中 M14 时含读态条目） | gdd 第 4 节；所负责页面的触达表行 | 项目的 `components.js` (access, reskin, read-state)、形态文档、`references/guardrails.md` (R10, R12)、`references/structure/form-device.md` §3 |
| 4a 生成资产 | gdd 首部（资产清单） | `references/structure/tooling.md` §3 item 9（资产核对） |
| 4b 把资产接进页面 | gdd 首部（资产清单）；阶段 1–3 的页面集合 | `references/structure/tooling.md` §3 item 9（资产核对） |
| 5 暂存模块（选中 M12 时） | gdd 第 5 节（感官行） | 项目的 `components.js` (staging) |
| 6 结局与破墙收尾（选中 M10 时） | gdd 第 3、6 节 | `references/design-playbook.md` §4、`references/guardrails.md` (R11, R12) |
| 7 入口页 | gdd 第 3、6 节；`docs/system-profile.md` | `references/design-playbook.md` §4、`references/guardrails.md` (R12) |

## 每个阶段的常设规则

- **框架已定。**步骤 6a 已定下外壳、皮肤、组件与工具；各阶段只填充页面文案与内容——不得重建或重新设计框架。
- **只写选中的模块。**只写 `docs/system-profile.md` 选中的模块；未选中的模块不留任何残件（没有闲置的搜索表、皮肤、门禁或账号页）。
- **公开页保持中立 (R5)。**每一页都写成那个组织的一份文档。一条名册条目要有姓名、职务、任职时间、职责。剧情不掺进来。
- **链接取自触达表，且不越出所在区域 (R7)。**不在表里的链接不得写；跨越深度要靠触达模块——绝不用「相关文件 / 档案 / 页面」这类链接。
- **选中 M3 时，系统页只对指名的账号开放 (R10)。**受保护页面带 `data-access`（`references/structure/form-system.md` §1）；管理员账号绝不继承同事的私密文档；只有初始账号会被印出来——其余每个登录串都从线索推出，绝不能从页面上抄。
- **派生/组合凭据只能靠部件拼出，绝不能直接印出 (R3, R12)。**编写 `data/credentials.src.json`（每个门禁字段的 value + rule + 公开页部件 + kind），并运行 `node tools/check-credentials.mjs` + `node tools/check-reachability.mjs`。不要为了让 `check-solvable.mjs` 变绿而印出某个账号——那等于把它泄漏给每一个访客，谜题也就死了（`references/structure/components.md` §3; `references/structure/tooling.md` §3 item 6）。
- **选中 M3 时，一个登录框、会话 cookie (R10)。**一个服务多个角色的登录框用 `data-grants`（账号→身份映射），而不是在页面上放两个表单；权限状态存在会话 cookie 里，这样用 `target="_blank"` 打开的结果页仍是解锁的（`references/structure/form-system.md` §2; `references/structure/components.md` §3）。
- **文档要有格式 (R6)。**发文机关、文号、日期、抬头、正文、签字与印章、分发名单。
- **输入框要写明字段 (R4)。**`placeholder="工号"`、`placeholder="站内搜索…"`。门禁页可以公示账号格式；密码的推导规则不得出现在上面。
- **文案是陈述句 (R11)。**写任何句子之前先看 references/design-playbook.md §4.14。
- **关键词要做哈希 (R3)。**任一 `data/keywords.<layer>.src.json` 改动之后都要跑 `node tools/build-keywords.mjs`。
- **读态条目要带 `data-after` (M14, R13)。**只有读过某页之后才存在的条目，在 `data-after` 里写明那一页——这是检查器看得见的契约。只有运行时 `readState`，这个条目在图上是看不见的。通配门禁把它的输入标为 `data-expect-any`；门禁页上未声明的输入会触发 `check-solvable` 的 NOTE（`references/structure/form-device.md` §4）。
- **存储遵循状态契约 (R13)。**只在装配记录写明持久化的地方写 `localStorage`；登录状态留在会话 cookie 辅助函数里；任何页面都绝不向玩家解释自己的存储方式。
- **共享实体保持一致。**出现在多个页面上的人名、证件号、账号、页面标题或日期，一律从 `docs/registry.md`（步骤 3 写出）复制，绝不重打；登记表是唯一事实源。

每个阶段结束时，对该阶段动过的文件重跑 workflow/05-puzzle-audit.md Q4 的泄漏扫描。

本步骤的基线测试陷阱：references/common-mistakes.md §7 ——交回产物前先对照检查。
