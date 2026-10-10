# 示例——触达链摘录（步骤 4）

`docs/reachability.md` 的形态锚点。每页一行；第四列是从组织方视角写的一句话
（workflow/04-reachability.md）。

## 交付物表（摘录）

| 页面 | 触达方式（编号） | 来源页面 | 该来源为什么会放这个链接 | 从首页跳数 |
|---|---|---|---|---|
| pages/news.html | 1 导航栏 | index.html | 官网导航固定含"新闻动态" | 1 |
| pages/staff-chen.html | 2 列表页 | pages/staff.html | 员工名录逐人成页，官网惯例 | 2 |
| pages/login.html | 3 页脚 | 全站页脚 | 页脚"员工入口"是真实站点标配 | 1 |
| pages/internal/s21-ledger.html | 4 搜索命中 | search.html（暗层索引） | 深区搜索指向暗层表 | 3 |
| pages/internal/s22-diary.html | 5 门解锁 | login.html `data-next` | 登录后跳转的目标页 | 3 |

## 缺陷示例（本步骤存在的意义就是抓住这两类）

| 缺陷行 | 为什么不合格 | 修复（按优先级） |
|---|---|---|
| pages/internal/s23.html ← 正文内链自 news.html | 编号外私植链接；组织不会在新闻正文链向私密页（R7） | 改为暗层索引加关键词，search-only 触达 |
| pages/menu.html → pages/internal/s21-ledger.html（"相关文件"） | 浅层页跨区链深层页（R7/R8） | 删除该链；由搜索或门触达 |

## 各项检查结论（每项一行）

- 反向检查：删除 2 条边（news.html 正文内链 ×2），改由列表页触达。
- 深度检查：最深 3 跳，无线索深过 3 层列表层级。
- 关键词可解性：每个公开区关键词都逐字出现在可达的公开页里。
- 索引范围检查：keywords.surface.json 不含任何 `pages/internal/` URL。PASS。
- 标题检查：所有标题都是目录条目（R9）。PASS。
