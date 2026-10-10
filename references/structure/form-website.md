# 形态——仿官方网站（容器 A）

面向玩家潜入某组织公开网站的游戏：原生触达模型是**搜索 + 门禁**（模块 M1/M2；
规则 R7–R9 见 `references/guardrails.md`）。先读 `references/structure/base.md`；
本文件在共享基础之上叠加网站层。

## 1. 结构

基础树，加上网站特有的部分：

- `search.html` ——枢纽（M1），用搜索组件挂载。
- 按受众命名的关键词表：默认为 `data/keywords.surface.src.json`（公开）与
  `data/keywords.secret.src.json`（深层）。
- 页面按虚构作品自身的区域划分；受限区使用虚构作品自己的词（`internal/`、`staff/`、
  `archive/`）——绝不用 `secret/` 目录。把 `CONFIG.secretUrl` 指向它
  （`references/structure/tooling.md` §2）。

## 2. 访问模型

本容器没有账号（内网子区域可以嵌套系统形态，§4）。每个隐藏页面都通过关键词搜索
（M1）或门禁（M2）到达：

- 公开页用 `data-index="data/keywords.surface.json"` 挂载搜索组件；深层页把
  `data-index` 指向深层表（`references/structure/components.md` §2）。受众作用域
  是强制的（R8）——一张扁平索引会把搜索框变成通关攻略。
- 公开关键词路由到公开页或门禁——绝不能直入受限文档。访客无权打开的命中结果解析
  到它的门禁或一条朴素的锁定提示（R8）。
- 门禁采用形态 A/B（`references/structure/components.md` §3）；凭据三件套适用（R3）。
  通配门禁声明 `data-expect-any`，读态条目声明 `data-after`，写法与系统形态完全
  一致（`references/structure/form-device.md` §4）。

## 3. 信息架构规则

导航栏、索引页与列表页、站点地图、页脚链接与搜索一起承担线索投放。每条链接的
存在理由都是"该组织确实会发布它"（R7）；任何页面都不得携带通向更深区域的
"相关文件 / 档案"链接（R7；`workflow/04-reachability.md` 审计这一点）。结果标题
是编目条目，不是剧情摘要（R9）。

## 4. 内网子区域

如果虚构设定包含员工内网或管理后台，那块飞地就使用系统形态的模式：账号登录 +
按账号访问（`references/structure/form-system.md`）。
