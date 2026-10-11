# 示例——游戏设计文档（GDD）摘录（步骤 3）

`docs/gdd.md` 与 `docs/registry.md` 的形态锚点（两者都由 workflow/03-gdd.md 定义）。
表中各行为示例，与其他示例取自同一个假想的餐厅故事设定。

## 0. 首部 + `docs/registry.md`（形态）

| 实体 | 值 | 派生规则 | 出现页 |
|---|---|---|---|
| 陈国栋 | 工号 `chen.gd` | 拼音首字母 + 姓 | pages/roster.html, pages/internal/s21-ledger.html |

账号串都带有自己的派生规则；初始凭据（账号 + 密码）在入口仪式页给出，其余一律推导（`references/credential-design.md` 方式 0、3）。

## 1. 编号页面地图（摘录）

| # | 页面 | 层 | 解锁来源 |
|---|---|---|---|
| 06/36 | pages/news.html | 表层 | 导航栏（index 起第 1 跳） |
| 14/36 | pages/login.html | 中层 | 页脚"员工入口" |
| 21/36 | pages/internal/s21-ledger.html | 暗层 | 搜索"癸巳"命中（暗层索引） |
| 17/36 | pages/mail/yuxia-inbox.html | 中层 | 读完 thread-fenglou 后出现（`data-after`，M14/R13） |

## 4. 权限清单（摘录）

| 门（页面） | 账号线索页 A | 密码线索页 B | 凭据三件套推理链 | 承载关键词的索引层 | 不可读命中解析为 |
|---|---|---|---|---|---|
| pages/login.html | 员工名录（姓名 + 部门，账号格式见门禁页） | 老帖《老蛇的本命年》2013 | 账号 = 拼音首字母 + 姓（方式 3）；2013 癸巳 → 陈生于 1977 → 密码 `1977` | surface | 跳本门（不给文档） |

第一道门（login.html）另挂初始凭据：账号 + 密码在入口仪式页直接给出（`references/credential-design.md` 方式 0）——入场，不是谜题；谜题预算从第二道门起算。

系统容器在此补上权限矩阵：页面 ↔ `data-access` 账号 ↔ 授予它的 `data-grant` 登录门 ↔
该账号登录串的推理链（R10）。通配门禁把它的输入标为 `data-expect-any`；读态条目携带
`data-after` 并注明来源页（`references/structure/form-device.md` §4）。

## 5. 谜题分配表（摘录）

| 谜题 | 类型（references/design-playbook.md §3） | 守护内容 | 跳数 |
|---|---|---|---|
| 本命年推生日 | B 跨页凭据 | 员工邮箱入口 | 1 |
| 黑底选字 | F 视觉隐藏 | 账本附言 | 0 |

## 6–8（形态提醒）

- 双结局：两个选项都复用 `s31-verdict.html` 的文案，那是玩家几分钟前刚读过的。
- 氛围页：`pages/menu-2019.html`（不在关键路径上，内部没有进度）。
- 文档规格：每份公告记发文单位/文号/日期/主送/印章/抄送（R6）。

第 2–3 节（IA + 语域切分）与第 4–5 节是步骤 4 和步骤 5 审计的输入；写得单薄，
两次审计都必然不通过。
