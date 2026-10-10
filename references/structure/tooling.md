# 工具——检查节奏、共享配置、人工方法

> `references/structure/base.md` 与 `references/structure/components.md` 的配套
> 文档。步骤 8 的必读材料（步骤 6 把 `tools/` 复制进项目时也是）。

## 1. 运行检查

规范的通过/失败清单——每条命令与每个人工项——是 **`workflow/08-self-check.md`**；
本节只讲节奏与脚本自动化的内容。

```bash
node tools/build-keywords.mjs     # 只要改过任何 data/keywords*.src.json，就重新生成哈希表
node tools/check-links.mjs        # 死链 + 公开索引泄漏；期望输出 "0 dead · 0 layer leaks"
node tools/check-solvable.mjs     # 冷启动走图；期望输出 "fixpoint in N round(s) · gates 4/4 unlocked · pages 28/28 reachable"
node tools/check-credentials.mjs  # 组合/派生凭据：部件 + 规则 + 零明文（只要 data/credentials.src.json 存在就跑）
node tools/check-reachability.mjs # 演练构建：把凭据注入一次性副本，再证明门禁可解、页面可达
node tools/site-graph.mjs       # 写出 docs/site-graph.json 与渲染器树 docs/site-graph/（报告工具——有问题也退出 0）
```

`check-solvable.mjs` **针对逐字凭据**把人工走查中"凭据出处"那一半自动化了，因此
人工那一轮只需评判语气与节奏。当线索被删除、密码被改动、线索被错放进某个页面自己的
解锁后区块、或列表条目被删掉时，它以非零码退出——每次内容编辑后都要运行它，而不仅
是在部署前。它从 components.md §3 读取门禁约定（`data-expect-hash`、
`x-show="unlocked"` / `<template x-if="unlocked">`、`x-data="search"`）；重命名这些
标记的项目要改 `tools/config.mjs`（§2），然后用 `node tools/check-solvable.mjs --self-test` 重新校验匹配器。

**派生/组合**凭据（由部分拼装、从不整体印出）在 check-solvable 的逐字模型之外——
它会把那道门禁报为 STUCK。不要为了让检查变绿而把它印出来（那会泄露给每个访客；
静态站点没有服务端鉴权）。`check-credentials.mjs` 证明它能从公开页面的组成部分
零明文拼出；`check-reachability.mjs` 证明一旦知晓它、图依然能解锁（§3 item 6）。

`hash.mjs` 是设计期辅助工具（步骤 3/5，计算门禁的 `data-expect-hash` 值时使用）；
`vendor-alpine.mjs` 在脚手架阶段运行一次（步骤 6）。

`site-graph.mjs` 与 `check-solvable.mjs` 共享 `site-model.mjs`，因此图绝不会与
走图不一致。它绘制的跳转关系与走图所跟随的完全相同——包括 `<form action>` 提交，
走图一直都在跟随它们（`linksOf`），而只认锚点的边集会把它们漏掉，进而把经由表单
到达的结果页判为不可达。倘若某个跳转表单仍然逃出了图，走图能到达的那个页面会以
`walk-divergence` 问题的形式出现，而不是给出静默的 `unreachable` 判定。它报告
检查器用于把关的同样缺陷（不可达页面、卡死门禁、失效目标、层泄漏），外加检查器
不建模的设计面信号：M7 进度提取及其不一致、步骤 4 封闭清单对每条边的路线判定，
以及非 chrome 边上的负进度增量（回跳）。有问题时它仍以 0 退出——把关仍归检查器。

## 2. 共享配置（tools/config.mjs）

工具是面向接口写成的，而不是写死在某一套约定上。每个检查器都从共享的
**`tools/config.mjs`** 读取自己的假设；重命名目录、层名或标记的项目只需改这一个
文件，而不必重写检查器（重写会丢掉这些检查所针对的缺陷积累）。

| 旋钮 | 默认值 | 使用者 |
|---|---|---|
| `dataDir` / `pagesDir` | `data` / `pages` | check-links, check-solvable, build-keywords |
| `surfaceTable` / `secretUrl` | 文件名上的 `/surface/i` / `/^internal\//` | check-links |
| `entry` | `index.html` | check-solvable, check-reachability |
| `gateHashAttr` / `indexAttr` | `data-expect-hash` / `data-index` | check-solvable, check-credentials |
| `grantAttr` / `accessAttr` / `nextAttr` | `data-grant` / `data-access` / `data-next` | check-solvable (system-form accounts) |
| `afterAttr` / `expectAnyAttr` / `gateMount` | `data-after` / `data-expect-any` / gate mount test | site-model route 10 · check-solvable undeclared-input NOTE |
| `unlockMarkers` / `unlockEnd` | `x-show="unlocked"` … `</main>` | check-solvable, check-reachability |
| `searchMount` | `x-data="search"` | check-solvable |
| `maxTokenLen` / `maxPhraseWords` / `maxPhraseLen` | 8 / 4 / 48 | check-solvable matcher |
| `credTable` | `data/credentials.src.json` | check-credentials, check-reachability |
| `derivedKinds` / `zeroPlaintextKinds` | `['account','secret']` / `['account']` | check-credentials |
| `skipDirs` | `.git node_modules tools viewer docs deploy` | 页面走图（check-links、check-solvable、site-graph）· check-credentials |
| `solver` | `tools/check-solvable.mjs` | check-reachability |

改过配置后，用 `node tools/check-solvable.mjs --self-test` 校验匹配器（多词、长词、
HTML 实体、CJK）。

## 3. 哪些仍需人工

静态检查器看不见的十件事。每一件都有人工方法或配套工具；跳过它就是泄漏通道。

1. **运行时绑定** —— `:href`、`x-bind`、在 JS 里拼装的 DOM。两个链接检查器都只解析静态 `href`、静态 `<form action>` 以及门禁的 `data-next` 目标。人工方法是关键词表（搜索结果路由放在那里；`data-index` 告诉检查器某个搜索页能触到哪张表），以及把会话状态建模为 `data-grant` / `data-access`（`references/structure/form-system.md` §5）。
2. **自身即数据库的枢纽** —— 容器 B 的明文 `FILE_DATABASE`、容器 C 的绝对跨站链接。人工方法：在步骤 4 的走图中把枢纽当作列表页处理，然后在步骤 8 的 chrome 扫描中把每个条目各点一次。
3. **不可跳过性** —— check-solvable 只能证明门禁可解，永远证明不了它不可绕过；人工方法是受众作用域（M1）：按受众分表、逐页 `data-index`、check-links 的泄漏防护（R8）。
4. **哈希归一化是四方契约** —— 页内辅助函数、`hash.mjs`、`build-keywords.mjs` 与 `check-credentials.mjs` 必须逐字节一致（`trim().toLowerCase()` → md5 → base64）。更换算法意味着在一次改动中把它们全部改掉，然后 grep 查找按旧规则生成的表（R3）。
5. **多站点布局** —— 容器 C 给每个站点自己的根目录；每个根目录跑一次工具（绝对路径的跨站 url 按设计被跳过，因此跨站图始终是步骤 4 的产物）。
6. **派生 / 组合凭据** —— check-solvable 只在值*逐字*出现时才匹配，因此由部分拼出的账号会被判为 STUCK。修复办法**不是**把它印出来（R12）：声明它，并用 `check-credentials.mjs`（组成部分 + 规则 + 零明文）加 `check-reachability.mjs`（一份注入了这些值的演练副本）证明它。
7. **按标签页的会话 vs 新标签页结果** —— check-solvable 把身份建模为一个全局集合，因此它看不见 `sessionStorage` 是按标签页的、而结果会以 `target="_blank"` 在新标签页里打开；浏览器显示文档锁定时它仍报绿。人工方法：步骤 8 的跨标签页测试；结构性修复：会话 cookie（components.md §2–§3，`references/structure/form-system.md` §6）。
8. **元素级权限遮蔽** —— 检查器读的是页面*文本*，不是计算后的可见性；仅靠 `x-show` / CSS 类 / 元素级 `data-access` 藏起来的凭据，仍然在发给每个访客的 HTML 里，而客户端遮蔽不是隐私（R12）。把它当作公开信息处理：步骤 8 的 chrome 泄漏扫描与 `check-credentials` 的零明文断言能抓住它。
9. **游戏设计文档声明了却从未落地的资产** —— 资产清单列出、却没有任何页面引用的徽章 / 印章 / 扫描件 / 照片 / 伪造文档，没有 `src` 可解析，两个检查器都不会报错。人工方法：步骤 8 的资产清单对账——每个声明的资产都存在于 `assets/` 下，且至少被一个页面引用。
10. **路线判定与进度回跳** —— `site-graph.mjs` 用步骤 4 的封闭清单给每条边判定路线（机器可判定的标 `structural`，正文里被读成相关文档引用的链接标 `heuristic`），并标出进度增量为负的非 chrome 边。请对照 `docs/reachability.md` 核实每一个 `heuristic` 判定与每一次回跳——工具无法判断该组织是否真的会印出那条链接。
11. **装置单页豁免（R1 例外）** —— 当装配记录写明"边框即装置"形态（`references/structure/form-device.md` §5）时，走图只看到一份文档：模板页没有文件供 check-links 解析，门禁/关键词的出处需要人工走查。五项条件在 `workflow/08-self-check.md` 中重新核验，并记录在 `docs/self-check.md` 中。
12. **加密内容层（R3）** —— 由生活痕迹拼出的 AES-GCM 密钥在逐字/派生模型之外：`check-credentials.mjs` 证明各组成部分（公开页面、零明文）；解密本身由构建时对随附 `enc.json` 的一次演练解密来证明——绝不把密钥印进页面。

匹配器读的是*页面文本*，不是 DOM，原因和玩家一样：它要证明某个字符串在门禁之前
就是可读的。藏在 `placeholder`、`title` 或 JS 字符串里的线索，对玩家和检查器都
不可见——步骤 8 的 chrome 泄漏扫描覆盖这一类问题（R4）。
