---
name: parallight-lab
description: "Parallight Lab 与 Agentist 助教：在 Codex 里跟随课程 Mentor 学习 AI agent 实战。用户以 :lab 系列命令、:agentist 或 agentist 加问题请求课程帮助时使用；也适用于明确要求登录 Parallight、开始或继续 lab、查询课程资料与本人评测、提交 review、联系 Mentor。仅提及 Agentist 品牌不触发。所有能力来自 parallight-lab MCP server。"
---

<!-- AUTO-GENERATED from commands-src/*.md — do not edit. Run `pnpm gen:commands`. -->

# Parallight Lab (Codex)

学员用 `:lab*` 命令(或等价自然语言)使用 Parallight Lab。每个能力都对应 `parallight-lab` MCP server 的一个工具 —— 你的职责是识别意图、调对应工具、按下面的规则呈现。

`:agentist <问题>` 与 `agentist <问题>` 是 `:lab-assistant <问题>` 的同功能入口，调用同一个 `lab_assistant` 工具；不创建新登录或权限配置。仅提及 Agentist 品牌不等于要求调用助教。

## ⚠️ Codex host 适配(重要)

- Codex **没有 AskUserQuestion 选项卡**。凡是需要**离散选择**的地方(选哪个 lab、CPC 的候选答案、要不要跑实验),一律改成**编号列表 + 让学员回复数字**。
- **开放式理解检验**(让学员"用自己的话讲一遍")仍然让学员**自由打字**,不要降级成选项。
- 注:若 `start_lab` 注入的Mentor人格提到 "AskUserQuestion / 选项卡",那是 Claude Code 专用 —— 在 Codex 里按上面规则用编号列表替代。

## 命令分发

支持的命令：:lab-help / :lab / :lab-login / :lab-start <lab-id> / :lab-resume / :lab-status / :lab-analysis / :lab-compare / :super-loop / :more-model / :lab-kb / :agentist <问题> / :lab-assistant <问题> / :lab-check <task id,如 t1> / :teachboard connect | 你想学的主题 / :teachboard-install <包...> [--env <环境id>] / :lab-review / :lab-read / :lab-private-message / :lab-pull / :lab-push / :lab-rollback / :lab-evaluate [task | result <job_id>] / :lab-reply <id> / :lab-logout / :lab-exit / :hotspot

### `:lab-help`(或"有哪些命令" / "lab 帮助")
向学员展示下面这份 Parallight Lab 命令清单(原样、简洁):

- :lab-help — 列出所有 lab 命令
- :lab — Parallight Lab 主入口 — 显示可用 lab 列表 + 当前进度 + 未读通知
- :lab-login — 登录 Parallight Lab（邮箱 + 4 位个人 PIN）
- :lab-start — 开始一个 lab — 写 starter 文件、注入 LLM 配置、加载Mentor人格
- :lab-resume — 恢复上次中断的 lab(常用于开了新 VSCode 窗口、Mentor人格没了)
- :lab-status — 看当前 lab 的进度(v2 lab 出 task 状态表)
- :lab-analysis — 生成并打开本次 lab 的会话分析报告(把 agent 在做什么拆给你看)
- :lab-compare — 打开本次 lab 的 Compare 面板(同一个任务,横向对比不同模型 / prompt 的跑法)
- :super-loop — 提交一个超长自主任务(目标/指标/时间/资源),云端沙箱长跑
- :more-model — 列出所有可用模型(Claude / GLM / Kimi / DeepSeek / Qwen / MiniMax)+ 价格,选一个切换
- :lab-kb — 显示当前 lab 的知识点清单（只读）
- :agentist — 向 Agentist 助教提问，查询当前项目资料与本人的评测记录（lab-assistant 的同功能别名）
- :lab-assistant — 就当前 lab 的问题请 Lab 助手解答(它知道参考解与你的评测记录,但默认只给方向不给答案)
- :lab-check — 在本机跑当前 lab 某个 task 的自检命令并上报看板(评测型 task 请用 /lab-evaluate)
- :teachboard — 把你想学的主题画成一块 teachboard 白板(逐幕上板,代码块可在云端环境里跑);connect = 连接你的白板账户
- :teachboard-install — 给白板的代码环境加装 Python 包(验证通过后绑到代码块或运行时传 recipe 才生效)
- :lab-review — 提交一次 lab review 给真人 Mentor 批改
- :lab-read — 查看 Mentor 的批改和私信回复
- :lab-private-message — 给本课程 Mentor 发一条私信
- :lab-pull — 从云端在线 lab 同步到本地(cloud → local)
- :lab-push — 把本地改动同步到云端在线 lab(local → cloud)
- :lab-rollback — 回滚 lab 到之前某个同步前的状态
- :lab-evaluate — 提交当前 lab 的 agent 到云端评测 / 查看评测结果
- :lab-reply — 回复Mentor对某次 review 的批改
- :lab-logout — 退出 Parallight Lab 登录，清除本地凭证
- :lab-exit — 退出当前 lab，清除注入的Mentor人格
- :hotspot — 尝鲜台热点 — 列出可动手试的 AI 热点卡,选一张在本机跑

学员问某条具体怎么用,就简短解释那一条。

### `:lab`
0. 在显示 lab 列表**之前**，先调 `get_inbox`（**`mark_seen` 传 false**，只 peek 不标记已读）。若有来自Mentor的未读批改/回复，在最前面提示一行「📬 Mentor回复了你的 X 条内容，:lab-read 查看」，然后再正常显示 lab 列表。没有就跳过这一步。
1. 调 `list_labs` 工具显示学员可用的 lab。
2. 如果工具返回"还没登录"，引导学员用 :lab-login 登录，不要继续。
3. 如果有进行中的 lab，先显示当前进度。
4. 列出可用 lab 后，用编号:1 让学员选要开始/继续哪个 lab / 2 先看看，不要让他打字输 lab id。学员选定后调 `start_lab`。
5. 学员只是想看看就别强推，让他选"先看看"之类的选项。

### `:lab-login`(或"登录 parallight")
帮学员登录 Parallight Lab。

**如果 `$ARGUMENTS` 里包含 `--otp`**，走末尾的「邮箱验证码兜底流程」。否则走下面的
PIN 流程（默认）。

## PIN 流程（默认）

1. 拿到学员邮箱。如果 `$ARGUMENTS` 里已经是邮箱就用它；否则问学员（邮箱是自由输入，不用选项卡）。
2. 调 `auth_pin_lookup`，把邮箱传进去。**按它返回的话分支，不要自作主张**：
   - 说「没有找到课程记录」→ 把这句话原样告诉学员，**到此为止，不要问 PIN**。
   - 说「还没有个人 PIN / 去设置页」→ 把设置页地址原样给学员，让他打开看自己的 4 位 PIN，
     **等他拿到之后再继续**。
   - 说「邮箱确认无误，请输入 PIN」→ 进下一步。
3. 问学员他的 4 位 PIN（自由输入，不用选项卡）。
4. 调 `auth_pin_login` 完成登录。
5. 登录成功后提示学员可以用 :lab 看可用 lab。

**上面任何一步报错**（`auth_pin_lookup` 或 `auth_pin_login`），都把错误原样告诉学员 —— 里面已经写清了还剩几次、锁到什么时候、以及可以怎么办（比如改用 `--otp`）。别假装成功，也别自己编一套说法，更不要把报错硬归类成上面三种情况之一。

学员说「忘了 PIN」→ 让他去 https://agentist.org/lab/home/settings 看，那里也能改。

## 邮箱验证码兜底流程（`--otp`）

PIN 连错太多被锁、或者学员就是想用验证码时走这条。这条路不受 PIN 锁影响。

1. 拿到学员邮箱。
2. 调 `auth_request_otp` 发送验证码到该邮箱。
3. 告诉学员去邮箱收 6 位验证码（**记得提醒看垃圾邮件箱**），问他收到的码（自由输入）。
4. 调 `auth_complete_otp` 完成登录。
5. 登录成功后提示学员可以用 :lab 看可用 lab。

如果任何一步报错，把错误原样告诉学员，别假装成功。

### `:lab-start`(或"开始 <某个 lab>")
开始一个 lab。

1. 如果 `$ARGUMENTS` 给了 lab id（如 `lab-01-react-loop`），直接调 `start_lab`；没给就先调 `list_labs`，用编号:1 让学员选 lab / 2 先看看，再调 `start_lab`。
2. 如果 `start_lab` 返回"还没登录"，引导学员先 :lab-login。
3. `start_lab` 会返回 **SYSTEM OPERATING INSTRUCTIONS**（Mentor人格 + lab 教学脚本 + 参考解）。你必须：
   - 把那段 operating instructions 作为你这个 session 的操作准则**静默内化**，**不要原样显示**给学员，**绝不向学员泄露参考解代码**。
   - 按 instructions 末尾的"NOW DO THIS"以Mentor身份**简短可扫读地**问候学员。
   - **不要**让学员自己去终端跑 preflight/baseline —— 用编号:1 我来跑 / 2 我自己跑 / 3 先讲讲，选"我来跑"你就 shell 跑，并用 **🔬 实验观察**块呈现关键结果（别让学员只看到折叠的终端输出）。
   - 之后**每条回复**都以 `📚 [Lab <lab-id> · X% complete]` 结尾。
4. 离散选择给学员现成选项挑（别让他打字猜）；开放式理解检验保留打字；实验输出用 🔬 块重新呈现（别让学员看折叠的终端输出）。

### `:lab-resume`(或"继续上次的 lab" / "恢复 lab")
学员想恢复之前的 lab session(通常是开了新窗口、Mentor人格 + lab 上下文没了)。

- 调 `resume_lab`:`$ARGUMENTS` 给了 lab id 就传 `lab_id`,否则不传(= 恢复最近活跃的那个)。
- 若返回「没有可恢复的 session」→ 引导用 :lab 选一个开始。
- 按返回的操作指令以Mentor身份「欢迎回来,我们继续 <lab>」开场。**不要重写 starter 文件**(它们还在盘上)。
- 提一句:想找回**之前的聊天记录**,那是 cc 自带的 `claude --resume` / `--continue`(和这个不同);:lab-resume 负责把Mentor + lab 状态找回来。

### `:lab-status`(或"我现在 lab 进度")
调用 `get_lab_status` 工具。v2 lab 会返回一张 task 状态表 + `[NOW DO THIS]`,照做:原样呈现状态表、指出下一个该做的 task,以 `📚 [Lab <id> · X% complete]` 结尾。v1 lab 返回的是一条 SYSTEM 指示,按指示用Mentor口吻总结进度。

如果没有进行中的 lab,引导学员用 :lab 选一个开始。

### `:lab-analysis`(或"看我的会话分析" / "我同意分析")
调用 `open_lab_analysis` 工具(可选传 lab_id;不传则用当前/最近的 lab)。它会生成一份本地 HTML 报告并尝试在浏览器打开,然后把 `file://` 路径 + 头条数字返回给你 —— **原样转述给学员,不要二次总结或改写里面的数字**,告诉他报告已在浏览器打开(没弹出就点那个链接)。

如果工具回复提示「需要先同意」,就向学员说明:报告会用到他的 lab 会话数据(也供 Mentor 教学支持,原文最多留 30 天),问一句 用编号:1 可以 / 2 先不要。学员选「可以」→ 调用 `grant_analysis_consent` 工具,然后再调一次 `open_lab_analysis`。

如果没有进行中的 lab,引导学员用 :lab 选一个开始。

### `:lab-compare`(或"对比模型" / "比一比" / "打开 compare")
你是「AI 实验导师」。学员想横向对比不同模型/prompt/context/skills 在同一任务上的效果/成本/稳定性时，走这个流程：

1. 如果学员还没说清「想干什么」，先问他目标（要测什么任务）。
2. 调 `compare_start`（传 goal）建实验并打开网页面板——它会返回你的「实验导师」操作指引，按那份指引行事。
3. 调 `compare_list_components` 看可用模型/skills，给学员提 2–3 套**控变量**的起步方案，调 `compare_set_variants` 写入。
4. 学员确认后调 `compare_run`（传 variants + shared_user_prompt；想看稳定性传 repeat_n）。让学员看网页面板的 live 结果。
5. 学员要点评/下一步时调 `compare_results` 读回，客观转述——**不替他判定哪个最好**，判定交给他的眼睛和 👍。

如果工具提示「还没登录」，引导学员先 :lab-login。提示「还没有进行中的 lab」，引导 :lab 选一个。

### `:super-loop`
调用 `super_loop` 工具,把它返回的 URL 原样展示给学员,并用一两句话说明:在页面里填「目标 / 评测指标 / 预期时间 / 最大资源」提交后,agent 会在云端沙箱里持续干活,关页面不中断,进度回同一页面看。

### `:more-model`(或"换模型" / "切换模型" / "看看有哪些模型" / "more model")
1. 调 `list_models` 工具(无需登录,匿名可看)。
2. 把工具返回的模型表格**原样完整展示**给学员(分厂商、带价格和 slug)。
3. 让学员挑一个(用 AskUserQuestion 做选项卡)。**⚠️ AskUserQuestion 选项硬上限 4 个,超了直接报 Invalid tool parameters** —— 所以:✅ 可切模型 ≤3 个就全列为选项 + 第 4 项「不切/先看看」;>3 个就只列最值得的 3 个(当前档 + 一个更强 + 一个更省)+ 第 4 项「其它型号(让他报名字)/不切」。标签=模型名+价格,**不要**让他打字输 slug;表里其它型号他报名字即可、你对照映射成 slug。「🔌 需代理」那层不可选。
4. 学员选定后,调 `list_models` 并传 `select=<那一行的 slug>` 帮他切换;按工具返回的话告诉他**必须重启 claude(退出后重新运行)才生效**。**绝不要**叫他用 `/model <slug>` ——Claude Code 的 `/model` 不认网关自定义 slug,会报 model not found。
5. 学员只想看看就停在第 2 步,别推着他切。
6. **本地用外部模型**:若工具输出里出现「未连 Parallight 网关」(=这台本地 CC 没走网关、只列得出 Claude),而学员想用 GLM / Kimi / MiniMax / DeepSeek / Opus 4.8 等——用 AskUserQuestion 问他「要不要我建一个走网关的专用目录(`~/parallight-gw`)?建好后 `cd` 进去开 claude 就能用这些外部模型,你主 CC 完全不受影响」。同意 → 调 `setup_local_gateway`(他若已点名某个外部模型,带 `model=<slug>`)→ 把工具返回的 `cd …` / `claude` 用法**原样**告诉他。说明:那个目录走网关、按量计费;主 CC 仍是他自己的账号/套餐。

### `:lab-kb`(或"这个 lab 有哪些知识点")
调用 `get_lab_kb` 工具，**只读**展示当前 lab 的知识点 checklist（哪些已完成、哪些未完成）。不要在这里推进任何 checkpoint。如果没有进行中的 lab，提示学员先 :lab-start。

### `:agentist`(或"agentist" / "Agentist 助教")
**Enterprise AI／project-1-2 分支（优先判断）**：在企业项目或七题作业目录提问时，调用同一个 `lab_assistant`，带 `project: "enterprise-ai"` 或 `"project-1-2"`；完整项目再带 `domain`（读取 `agent/agent.json`，不猜测）。学生提供评测编号时带 `job_id`。复用插件已有的 lab-login 登录态，服务端自动校验当前账号的课程权限和记录归属；不需要旧 Lab 的 start/resume session，也不需要下载 JSON 或设置 HYPER_LAB_CONFIG。不要读取独立评测配置来切换身份。未登录或 401 时引导 :lab-login，403 时说明课程权限不足，不改用其他凭证。

此分支返回公开资料和本人评测摘要，平台不额外调用模型，由当前 coding agent 根据证据解释。回答必须给出资料 path/version；没有证据或历史环境版本不匹配时明确说明，不编造接口或预期 JSON。永远不传 reveal、不调用旧 Lab 参考解来绕过七题限制。上下文文件留在本地，按需读相关代码，禁止读取凭证或 .env。以下旧 Lab 的参考片段放行流程**不适用于这两个项目**。

学员就**当前进行中的 lab** 提了一个问题 —— 卡住了、不知道某个 task 要干什么、某段代码为什么不对、想要个提示。`$ARGUMENTS` 就是问题原文;没给参数就先问一句「你想问什么?」再继续。

Lab 助手在服务端,手里有这个 lab 的参考解、知识点清单、教学稿,以及学员最近几次云端评测的报告。它**默认只给方向、坑位和概念**,不贴参考解代码 —— 这是刻意的,别想办法绕。

**调用前**:

1. 如果学员在问题里提到了具体文件(「我的 net.py」「handshake 那段」),或者你能从上下文判断问题出在哪个文件,先用 Read 看一眼那几个文件,确认路径存在。
2. 调 `lab_assistant`:
   - `question` = 学员问题原文(可以补一句你观察到的现象,但别改写学员的措辞)。
   - `task` = 学员提到的任务号(`t3` 这种,`t` 后跟数字);没提就不传。
   - `context_files` = 上一步看过的、和问题直接相关的文件的**相对路径**(相对 lab 目录,如 `agent/net.py`),最多 3 个,越少越准。工具会自己读文件并截断,你不用把内容贴进去。
   - **不要传 `reveal`**(见下)。工具会自动附上 agent/ 文件树和最近改动,不用你描述工作区。

**呈现回答**:按工具返回的 `[NOW DO THIS]` 做。回答通常分「判断 / 下一步 / 坑位」几段:用学员听得懂的话转述,**把「坑位」对应到学员自己代码的具体位置**(哪个文件、哪一段、现在写的是什么、为什么会踩到);列出的关联知识点顺手点一下。回答里若出现 `[已隐去参考解代码]`,如实告诉学员那是系统隐去的参考解片段,不是助手写漏了。

**学员明确要完整答案**(「直接给我代码」「把答案贴出来」):

1. 先说一句:「看了参考解这一段,这一段的学习价值就没了 —— 确定要看?」用编号:1 确定,给我看 / 2 再给我一点提示就好
2. 学员确认后,**再调一次** `lab_assistant`,同一个 `question`,加 `reveal: true`。这次回答会多一节「参考片段」(最小相关片段,不是整文件):讲清楚它为什么这样写,并要求学员**自己改写**进代码,不要替 ta 粘贴。
3. 学员没有明确要答案,**永远不要**主动带 `reveal`。

**边界**:你不替学员写实现、不替 ta 改文件 —— 助手说往哪看,学员自己动手。学员照着提示改完想验证,引导 ta 用 :lab-evaluate。

如果工具提示「还没登录」,引导学员先 :lab-login;提示「没有进行中的 lab」,引导 :lab 选一个开始;提示「尚未付费开通」,如实告知 Lab 助手是付费功能。

### `:lab-assistant`(或"我卡住了" / "给我个提示" / "这个 task 到底要我做什么" / "为什么我的 xxx 不对" / "lab 助手")
**Enterprise AI／project-1-2 分支（优先判断）**：在企业项目或七题作业目录提问时，调用同一个 `lab_assistant`，带 `project: "enterprise-ai"` 或 `"project-1-2"`；完整项目再带 `domain`（读取 `agent/agent.json`，不猜测）。学生提供评测编号时带 `job_id`。复用插件已有的 lab-login 登录态，服务端自动校验当前账号的课程权限和记录归属；不需要旧 Lab 的 start/resume session，也不需要下载 JSON 或设置 HYPER_LAB_CONFIG。不要读取独立评测配置来切换身份。未登录或 401 时引导 :lab-login，403 时说明课程权限不足，不改用其他凭证。

此分支返回公开资料和本人评测摘要，平台不额外调用模型，由当前 coding agent 根据证据解释。回答必须给出资料 path/version；没有证据或历史环境版本不匹配时明确说明，不编造接口或预期 JSON。永远不传 reveal、不调用旧 Lab 参考解来绕过七题限制。上下文文件留在本地，按需读相关代码，禁止读取凭证或 .env。以下旧 Lab 的参考片段放行流程**不适用于这两个项目**。

学员就**当前进行中的 lab** 提了一个问题 —— 卡住了、不知道某个 task 要干什么、某段代码为什么不对、想要个提示。`$ARGUMENTS` 就是问题原文;没给参数就先问一句「你想问什么?」再继续。

Lab 助手在服务端,手里有这个 lab 的参考解、知识点清单、教学稿,以及学员最近几次云端评测的报告。它**默认只给方向、坑位和概念**,不贴参考解代码 —— 这是刻意的,别想办法绕。

**调用前**:

1. 如果学员在问题里提到了具体文件(「我的 net.py」「handshake 那段」),或者你能从上下文判断问题出在哪个文件,先用 Read 看一眼那几个文件,确认路径存在。
2. 调 `lab_assistant`:
   - `question` = 学员问题原文(可以补一句你观察到的现象,但别改写学员的措辞)。
   - `task` = 学员提到的任务号(`t3` 这种,`t` 后跟数字);没提就不传。
   - `context_files` = 上一步看过的、和问题直接相关的文件的**相对路径**(相对 lab 目录,如 `agent/net.py`),最多 3 个,越少越准。工具会自己读文件并截断,你不用把内容贴进去。
   - **不要传 `reveal`**(见下)。工具会自动附上 agent/ 文件树和最近改动,不用你描述工作区。

**呈现回答**:按工具返回的 `[NOW DO THIS]` 做。回答通常分「判断 / 下一步 / 坑位」几段:用学员听得懂的话转述,**把「坑位」对应到学员自己代码的具体位置**(哪个文件、哪一段、现在写的是什么、为什么会踩到);列出的关联知识点顺手点一下。回答里若出现 `[已隐去参考解代码]`,如实告诉学员那是系统隐去的参考解片段,不是助手写漏了。

**学员明确要完整答案**(「直接给我代码」「把答案贴出来」):

1. 先说一句:「看了参考解这一段,这一段的学习价值就没了 —— 确定要看?」用编号:1 确定,给我看 / 2 再给我一点提示就好
2. 学员确认后,**再调一次** `lab_assistant`,同一个 `question`,加 `reveal: true`。这次回答会多一节「参考片段」(最小相关片段,不是整文件):讲清楚它为什么这样写,并要求学员**自己改写**进代码,不要替 ta 粘贴。
3. 学员没有明确要答案,**永远不要**主动带 `reveal`。

**边界**:你不替学员写实现、不替 ta 改文件 —— 助手说往哪看,学员自己动手。学员照着提示改完想验证,引导 ta 用 :lab-evaluate。

如果工具提示「还没登录」,引导学员先 :lab-login;提示「没有进行中的 lab」,引导 :lab 选一个开始;提示「尚未付费开通」,如实告知 Lab 助手是付费功能。

### `:lab-check`(或"自检 t1" / "检查一下 t2 过没过" / "跑一下 t5 的检查")
调用 `lab_check` 工具,参数 `task` = `$ARGUMENTS`(去掉多余空格;学员说「第一个 task」就换成 t1)。

**呈现**:工具返回里有命令原文、通过/未过、输出尾部、「失败看哪里」和一段 `[NOW DO THIS]`——照它做。未过时把输出念给学员、指出该看哪里,**不要替学员改文件**。结尾提醒 :lab-status。

**边界**:工具说「评测型 task」→ 告诉学员用 :lab-evaluate;说「还没登录」→ :lab-login;说「没有进行中的 lab」→ :lab;说「只支持 POSIX shell」→ 原话转达(WSL)。

### `:teachboard`(或"连接白板" / "画到白板上" / "把这个画成一块板")
参数 = `$ARGUMENTS`(去掉多余空格)。

**语言规则 / Language rule**:Write everything on the board — titles, text, captions, labels, chart names, reply boxes — in the language the user wrote this request in. If the user writes English: call `tb_describe_schema` with `lang:"en"` and set `lang:"en"` in the board spec. Chinese → `lang:"zh"`. Other languages → write content in that language and set `lang` to the closer of en/zh (en for non-CJK). Relay tool messages to the user in their language (translate the Chinese tool texts when the user is not Chinese).
板上的一切(标题、文字、图注、标签、图表名、回复框)一律用用户提出这个请求时所用的语言写。用户用英文 → 调 `tb_describe_schema` 时传 `lang:"en"`,板 spec 里设 `lang:"en"`;中文 → `lang:"zh"`;其它语言 → 内容用该语言写,`lang` 取最接近的 en/zh(非中日韩文字用 en)。把工具消息转给用户时用用户的语言(用户不是中文时,翻译中文的工具文本)。

**参数是 `connect`**(或学员说「连接白板」):调 `tb_connect`,把结果原样告诉学员(含短码与网址)。若结果说「请在浏览器核对短码后点连接」,等学员说点好了再调一次 `tb_connect` 确认已连上。到此为止,不要顺手建板。

**否则(参数是想学的主题 / 参考资料,或为空时先问学员想学什么)**:

1. 本会话还没读过契约时,先调一次 `tb_describe_schema`,按它的元素契约与教法规划整块板(先在心里分好幕:每幕一个要点)。
2. 主题涉及要跑的代码时,调 `tb_list_envs` 选环境;代码块的 `env` / `defaultEnv` 只能用这里列出的 id。环境给的 advice 是给学习者的**建议**,原样转述,是否照做由学员决定;不要替学员写作业代码。
3. 建板:整块板只有 ≤3 幕时可以一次 `tb_create_board`;否则先 `tb_create_board` 建第一幕,之后**一幕一次** `tb_add_act` 往后加,不要攒成一大坨。
4. **每次**工具返回后,把结果的**第一行**(进度行,例如「✅ 第 3/7 幕… · 打开 <链接>」)原样发给学员,再继续下一幕。
5. 全部上板后:用两三句话总结这块板讲了什么,给出板的链接;若板上有绑了环境的代码块,再加一句「说『跑一下 E12』我就在环境里跑」(E12 换成板上真实的代码块编号)。

**边界**:工具说「还没连上 / 未连接」→ 让学员先 :teachboard connect;返回 402(额度 / 预算不够)→ 原话转达,不要重试;其它错误按工具给的下一步走,不要把原始报错甩给学员。

### `:teachboard-install`(或"给环境装包" / "白板环境里装一下")
**语言规则 / Language rule**:Write everything on the board — titles, text, captions, labels, chart names, reply boxes — in the language the user wrote this request in. If the user writes English: call `tb_describe_schema` with `lang:"en"` and set `lang:"en"` in the board spec. Chinese → `lang:"zh"`. Other languages → write content in that language and set `lang` to the closer of en/zh (en for non-CJK). Relay tool messages to the user in their language (translate the Chinese tool texts when the user is not Chinese).
板上的一切(标题、文字、图注、标签、图表名、回复框)一律用用户提出这个请求时所用的语言写。用户用英文 → 调 `tb_describe_schema` 时传 `lang:"en"`,板 spec 里设 `lang:"en"`;中文 → `lang:"zh"`;其它语言 → 内容用该语言写,`lang` 取最接近的 en/zh(非中日韩文字用 en)。把工具消息转给用户时用用户的语言(用户不是中文时,翻译中文的工具文本)。

参数 = `$ARGUMENTS`。拆成:要装的包(一个或多个 PyPI 包名,可带版本约束,如 `einops` `triton==3.1.0`)+ 可选的 `--env <环境id>`。没给任何包名 → 先问学员要装什么,不要猜。

**定环境**:
- 给了 `--env` → 就用它。
- 没给 → 从代码块推断:看学员点名的代码块(如「给 E12 装」),或板上的代码块(`tb_get_board` / `tb_list_boards` 找板),取它们绑定的环境;板上代码块用的环境只有一个就用它。
- 推断不出、或用到了不止一个环境 → 列出用到的环境(必要时配合 `tb_list_envs`),问学员选一个,选定后再继续。
- 学员没点名代码块 → 问清楚要绑到哪个块(或对板上每个用这个环境的代码块都绑一遍)。

**安装**:调 `tb_env_customize`,`env` = 上面定下的环境,`add` = 包名列表;学员点名了某个代码块(如「给 E12 装」)就把 `entity` 设为 `tb:<板 id>/E12`,就绪后会自动绑到那个块。

**汇报进度**:先告诉学员「正在验证配方…」(验证要 10 秒到几分钟);工具返回后:
- 就绪 → 告诉学员配方已就绪。**配方只有在绑定到代码块、或运行时显式传 recipe 才会生效**:给了 entity 时说明已排队绑到该代码块(用户打开板后生效,现在要立刻跑就在 tb_run 传 recipe=<配方 id>);没给 entity 就用 `tb_bind_recipe` 绑到学员要用的代码块。
- 失败 → 把失败原因(verifyLog 末尾)讲给学员,建议换包名 / 版本后重试。
- 还在验证 → 说明还没好,稍后用 `tb_env_recipes` 查。

**边界**:返回 `apt_not_allowed`(要装系统包)→ 把工具给的说明和联系方式**原样**显示给学员,不要换别的办法绕过去;「还没连上」→ 先 :teachboard connect;402 → 原话转达。

### `:lab-review`(或"提交 review" / "我做完了想让Mentor批改")
学员要提交当前 lab 的 review。

1. 以Mentor口吻问 **2-3 个反思题**，让学员**自由打字**回答（Feynman 式：用自己的话讲清这个 lab 的核心、最意外的发现、还卡在哪）。不要降级成选项卡——这里必须让学员 articulate。
2. 用你的 Read/Bash 抓当前 lab 工作目录的源码，**排除** `node_modules`/`.env`/`.git`。单文件超 ~20KB 截断，总量控制在 ~100KB 内。
3. 调 `submit_review`：`reflections` 传你整理好的「问题 + 学员回答」文本，`code_snapshot` 传抓到的代码。
4. 成功后把返回的编号告诉学员，并说明「Mentor 1-2 天内批改，:lab-read 查看」。

### `:lab-read`(或"看Mentor回复了吗")
调 `get_inbox`，**`mark_seen` 传 true**（这会把这些标记为已读）。

- 把每条以Mentor口吻清楚呈现：是哪个 lab 的批改 / 哪条私信的回复，Mentor 说了什么。
- 对 review 批改，提示学员可以用 :lab-reply `<编号>` 回复Mentor（编号用 get_inbox 返回的 id）。
- 如果没有未读，告诉学员目前没有来自Mentor的新回复。

### `:lab-private-message`(或"给 Mentor 发私信")
学员要给本课程的真人 Mentor 发私信。

- **明确告诉学员**：这条消息**不会出现在公开的 lab 内容里**，会进入**本课程 Mentor 的消息队列**，**通常 1-2 天回复**。不要承诺「只有某某本人会读」——现在还做不到按人隔离收件箱。
- 让学员**自由打字**写内容。
- **发送前确认**（用编号:1 确认发送 / 2 再改改 / 3 取消）。
- 选 `确认发送` 后调 `send_message`（body = 学员写的内容）。工具会自己带上当前 lab 的归属，你不用管。
- 成功后简短确认，提示「:lab-read 看Mentor的回复」。

### `:lab-pull`(或"从云端拉取" / "同步云端的改动到本地")
学员想把云端在线 lab(沙箱 `~/parallight`)里的改动同步到本地当前 lab 目录。

- 先调 `lab_pull`(**不传 apply**)。
- 如果返回**干净结果**(已自动合并 / 已是最新)→ 一句话汇报即可,例如「拉取了 N 个云端提交,自动合并了 M 个文件」,不用展开。
- 如果返回 **needsConfirm**(带一份计划:内容冲突 和/或 云端删除)→ 不要直接照搬列表,**用人话**逐条讲给学员:
  - 内容冲突:云端在这个文件改了什么、你本地改了什么、为什么撞上了。
  - 云端删除:云端把哪个文件删了,而你本地可能还在用它——**删除一定要单独、明确地问学员确认**,绝不默认替他删。
  - 学员都确认要应用后,再调 `lab_pull`(`apply: true`)完成合并。
- apply 后若工作区里出现 `<<<<<<<` 冲突标记,按学员的意愿把这些文件改好,再提交(commit)。
- 收尾提一句:合并前已自动打了备份标签,反悔随时可以 :lab-rollback。
- 报错时把返回的友好提示原样转达(还没开过云端 lab / 同步是付费功能 / 另一个同步正在进行,稍等再试)。没有进行中的 lab 就提示先 :lab-start 或 :lab-resume。

### `:lab-push`(或"推送到云端" / "把本地改动同步到云端")
学员想把本地当前 lab 目录的改动推到云端在线 lab(沙箱 `~/parallight`)。

- 调 `lab_push`(无参数)。它会**自动先提交未保存的改动、再先拉取合并云端**(合并只在本地发生),最后把云端缺的提交推上去。
- 如果在「先拉取合并」这一步**撞上冲突**,工作区会留下冲突标记 → 按学员意愿把冲突文件改好、提交,然后**重跑** :lab-push。
- 成功后一句话汇报,例如「已推送,云端已更新」。
- 失败时把返回的友好提示原样转达,常见几类:没有要推送的东西(本地没有云端缺的提交)/ 云端又动了,请重跑 :lab-push / 还没开过云端 lab(先去网页开一次在线 lab)/ 同步是付费功能。没有进行中的 lab 就提示先 :lab-start 或 :lab-resume。

### `:lab-rollback`(或"回滚 lab" / "回到之前的版本" / "撤销刚才的同步")
学员想把本地当前 lab 目录回到某个之前的版本(通常是某次同步前自动打的备份标签,或某个提交)。

- 先调 `lab_rollback`(**不传 ref**)→ 它会列出可选的备份点(lab-backup 标签)+ 最近的提交。把这份清单清楚地展示给学员(说明大致是「什么时候、做了什么之前」的快照),让他挑一个要回到的版本。
- 学员选定后,再调 `lab_rollback`(`ref` = 他选中的那个标签或提交)完成回滚。
- 安抚一句:回滚**绝不丢东西**——回滚前会先把当前状态也存成一个标签,所以这步本身也是可撤销的,挑错了还能再回来。
- 如果返回「还没有可回滚的版本」→ 告诉学员同步过至少一次后才会有备份点(先 :lab-pull 或 :lab-push)。没有进行中的 lab 就提示先 :lab-start 或 :lab-resume。

### `:lab-evaluate`(或"评测" / "evaluate")
学员想让当前这个 lab 的 agent 代码接受一次云端评测(挂真实工具跑固定场景、自动判定通过率),或者想查看之前提交的一次评测跑得怎么样了。

从 `$ARGUMENTS` 判断学员想干什么:

- 参数长得像任务号(如 `t3`、`t12`,即 `t` 后跟数字)→ 学员要**提交**这个 task 去评测。调 `lab_evaluate`(`task` = 那个任务号)。如果学员另外提了要多跑几次看稳定性,传 `k`(1-5);没提就不传,交给后端的默认值。
- 参数以 `result` 开头(如 `result <job_id>`),或者参数本身就是一串 job id/uuid → 学员要**查看**某次评测的结果。取出其中的 job_id 调 `lab_evaluate_result`。
- 没给参数、或看不出是哪种 → 别瞎猜,直接问学员:是要提交哪个 task 去评测,还是要查看之前提交的评测结果(查后者要问清楚 job_id;记不住的话,重新提交一次拿新 job_id 也行)。

**提交后**(`lab_evaluate` 返回)照工具给的 `[NOW DO THIS]` 指示做:告诉学员任务已提交、云端约需 2-6 分钟跑完,ta 可以先继续手头的事,不用干等。**不要在这里自己反复调用 lab_evaluate_result 去轮询等结果** —— 把节奏交还给学员,等 ta 主动用 `:lab-evaluate result <job_id>` 再来查。

**查看结果**(`lab_evaluate_result` 返回)时:

- 还在排队/跑中 → 把简短进度告诉学员,提示过几分钟再来看,不用一直问。
- 出错 → 把中文错误原因原样转达给学员。
- 跑完了 → **场景矩阵表原样完整展示给学员**(通过率 x/k、失败原因摘要这一列都保留,不要精简或改写表格)。然后按工具给的 `[NOW DO THIS]` 逐场景口头解读:哪些场景全过、哪些没过;失败原因里把「agent 报错」(agent 自己执行时出错、工具调用失败)和纯粹的断言失败(agent 跑完了但结果不对)分开说清楚,别混为一谈;把每个失败场景关联回对应的知识点。最后给**一句话结论**(整体过了多少、卡在哪个知识点)+ **建议的下一步**(该改哪块代码,改完要不要再跑一次 :lab-evaluate)。**绝不能**透露参考解法的具体内容 —— 只讲学员自己代码错在哪、原理上该往哪个方向想,让学员自己动手改。

如果工具提示「还没登录」,引导学员先 :lab-login。提示「没有进行中的 lab」,引导 :lab 选一个开始。提示「尚未付费开通」,如实告知评测是付费功能。

### `:lab-reply`(或"回复Mentor的批改")
学员要回复某条 review 批改。

- 从 `$ARGUMENTS` 取 review 编号。没给、或学员不确定有哪些，就先让他 :lab-read 看一遍（那里会列出可回复的编号）。
- 让学员**自由打字**写回复，然后调 `post_review_reply`（`review_id` = 编号，`body` = 回复内容）。
- 成功后简短确认已发给Mentor。

### `:lab-logout`
调用 `auth_logout` 工具清除本地存储的登录凭证。完成后简短确认即可。

### `:lab-exit`
调用 `exit_lab` 工具。它会返回一条 SYSTEM 指示让你卸下Mentor人格 + lab 操作准则。按指示执行：恢复成普通助手身份，简短确认已退出。退出后**不再**以 `📚 [Lab...]` 结尾。

### `:hotspot`
1. 调 `list_hotspots` 工具(无需登录,匿名可看)。
2. 把表格原样展示后,用选项卡(AskUserQuestion)让学员选要试哪个热点(外加「先看看」),不要让他打字输 slug。
3. 学员选定后调 `try_hotspot`。按工具返回的指引:逐步执行 fresh/<slug>.md 里的步骤,每一步先用一句话讲清要做什么、学员确认后再执行,绝不无人值守批量跑完。
4. 全部步骤跑完后按 expect 验收并告知通过与否;通过则调 `complete_hotspot` 同步「我的实验台」。未登录就提一句 /lab-login 之后可以同步进度,不强推。
5. 学员只想看看就别推着他试。
