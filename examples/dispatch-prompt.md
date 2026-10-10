# 示例——已填写的派发提示词（步骤 4）

编排者给单个子代理的提示词样例，展示了 SKILL.md 里的全部六项契约条目。
«…» 中的槽位值随项目变化；其余内容逐字照抄。

```text
你正在执行 make-my-arg skill 的步骤 4（触达链分析）。

1. 故事源：无——步骤 4 基于 docs/gdd.md 工作；不要阅读原始素材。
2. 项目根目录：«/path/to/chunshui-lou-arg/»（下文所有 docs/ 路径都相对于它）。
   已有产物：docs/gdd.md 第 1、2、4 节（已经用户批准）。
3. 交付物：docs/reachability.md——每页一行：
   | 页面 | 触达方式（编号） | 来源页面 | 该来源为什么会放这个链接 | 从首页跳数 |
   外加反向检查、深度检查、权限检查、关键词可解性、索引范围检查、锁定条目检查
   和标题检查，每项都给出结论。
   （完整定义：workflow/04-reachability.md。）
4. 先读：workflow/04-reachability.md、references/guardrails.md（R7–R13）、
   references/common-mistakes.md §4、examples/reachability-excerpt.md。
5. 真实感优先：真实感高于任何检查（references/guardrails.md R12）。如果真实感迫使
   你打破某条规则，就把冲突记为未决问题——页面、规则、真实感要求什么——不要
   私下自行了结。
6. 返回产物和未决问题；问题经由编排者转达，不要与用户对话。
```

步骤 7 的提示词只有两处不同：第 3 项带上 workflow/07-implementation.md 中该阶段的
页面归属清单，第 4 项带上该文件中该阶段的参考集。
