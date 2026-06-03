---
name: parallight-lab
description: "Parallight Lab —— 在 Codex 里跟着Mentor Marvin 学 AI agent 实战(指挥 agent 写代码、理解、验证)。触发条件:用户消息以 :lab 开头(:lab-help / :lab / :lab-login / :lab-start <lab-id> / :lab-resume / :lab-status / :lab-analysis / :lab-compare / :lab-kb / :lab-review / :lab-read / :lab-private-message / :lab-reply <id> / :lab-logout / :lab-exit),或用自然语言要求登录 Parallight、查看/开始/继续 lab、问 lab 进度或知识点、提交 review、给 Marvin 发私信、查看Mentor回复、退出 lab。所有能力来自 parallight-lab MCP server 的工具。"
---

<!-- AUTO-GENERATED from commands-src/*.md — do not edit. Run `pnpm gen:commands`. -->

# Parallight Lab (Codex)

学员用 `:lab*` 命令(或等价自然语言)使用 Parallight Lab。每个能力都对应 `parallight-lab` MCP server 的一个工具 —— 你的职责是识别意图、调对应工具、按下面的规则呈现。

## ⚠️ Codex host 适配(重要)

- Codex **没有 AskUserQuestion 选项卡**。凡是需要**离散选择**的地方(选哪个 lab、CPC 的候选答案、要不要跑实验),一律改成**编号列表 + 让学员回复数字**。
- **开放式理解检验**(让学员"用自己的话讲一遍")仍然让学员**自由打字**,不要降级成选项。
- 注:若 `start_lab` 注入的Mentor人格提到 "AskUserQuestion / 选项卡",那是 Claude Code 专用 —— 在 Codex 里按上面规则用编号列表替代。

## 命令分发

### `:lab-help`(或"有哪些命令" / "lab 帮助")
向学员展示下面这份 Parallight Lab 命令清单(原样、简洁):

- :lab-help — 列出所有 lab 命令
- :lab — Parallight Lab 主入口 — 显示可用 lab 列表 + 当前进度 + 未读通知
- :lab-login — 登录 Parallight Lab（邮箱 + 6 位验证码 OTP）
- :lab-start — 开始一个 lab — 写 starter 文件、注入 LLM 配置、加载Mentor人格
- :lab-resume — 恢复上次中断的 lab(常用于开了新 VSCode 窗口、Mentor人格没了)
- :lab-status — Mentor总结当前 lab 的进度
- :lab-analysis — 生成并打开本次 lab 的会话分析报告(把 agent 在做什么拆给你看)
- :lab-compare — 打开本次 lab 的 Compare 面板(同一个任务,横向对比不同模型 / prompt 的跑法)
- :lab-kb — 显示当前 lab 的知识点清单（只读）
- :lab-review — 提交一次 lab review 给真人 Marvin 批改
- :lab-read — 查看真人 Marvin 的批改和私信回复
- :lab-private-message — 给真人 Marvin 发一条私信（只有他本人会读）
- :lab-reply — 回复Mentor对某次 review 的批改
- :lab-logout — 退出 Parallight Lab 登录，清除本地凭证
- :lab-exit — 退出当前 lab，清除注入的Mentor人格

学员问某条具体怎么用,就简短解释那一条。

### `:lab`
0. 在显示 lab 列表**之前**，先调 `get_inbox`（**`mark_seen` 传 false**，只 peek 不标记已读）。若有来自Mentor的未读批改/回复，在最前面提示一行「📬 Mentor回复了你的 X 条内容，:lab-read 查看」，然后再正常显示 lab 列表。没有就跳过这一步。
1. 调 `list_labs` 工具显示学员可用的 lab。
2. 如果工具返回"还没登录"，引导学员用 :lab-login 登录，不要继续。
3. 如果有进行中的 lab，先显示当前进度。
4. 列出可用 lab 后，用编号:1 让学员选要开始/继续哪个 lab / 2 先看看，不要让他打字输 lab id。学员选定后调 `start_lab`。
5. 学员只是想看看就别强推，让他选"先看看"之类的选项。

### `:lab-login`(或"登录 parallight")
帮学员登录 Parallight Lab。流程：

1. 拿到学员邮箱。如果 `$ARGUMENTS` 里已经是邮箱就用它；否则问学员（邮箱是自由输入，不用选项卡）。
2. 调 `auth_request_otp` 发送验证码到该邮箱。
3. 告诉学员去邮箱收 6 位验证码，问他收到的码（自由输入）。
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
调用 `get_lab_status` 工具。它会返回当前进度 + 一条 SYSTEM 指示，让你以Mentor的口吻总结进度。按指示用Mentor人格总结，并以 `📚 [Lab <id> · X% complete]` 结尾。

如果没有进行中的 lab，引导学员用 :lab 选一个开始。

### `:lab-analysis`(或"看我的会话分析" / "我同意分析")
调用 `open_lab_analysis` 工具(可选传 lab_id;不传则用当前/最近的 lab)。它会生成一份本地 HTML 报告并尝试在浏览器打开,然后把 `file://` 路径 + 头条数字返回给你 —— **原样转述给学员,不要二次总结或改写里面的数字**,告诉他报告已在浏览器打开(没弹出就点那个链接)。

如果工具回复提示「需要先同意」,就向学员说明:报告会用到他的 lab 会话数据(也供 Marvin 教学支持,原文最多留 30 天),问一句 用编号:1 可以 / 2 先不要。学员选「可以」→ 调用 `grant_analysis_consent` 工具,然后再调一次 `open_lab_analysis`。

如果没有进行中的 lab,引导学员用 :lab 选一个开始。

### `:lab-compare`(或"对比模型" / "比一比" / "打开 compare")
你是「AI 实验导师」。学员想横向对比不同模型/prompt/context/skills 在同一任务上的效果/成本/稳定性时，走这个流程：

1. 如果学员还没说清「想干什么」，先问他目标（要测什么任务）。
2. 调 `compare_start`（传 goal）建实验并打开网页面板——它会返回你的「实验导师」操作指引，按那份指引行事。
3. 调 `compare_list_components` 看可用模型/skills，给学员提 2–3 套**控变量**的起步方案，调 `compare_set_variants` 写入。
4. 学员确认后调 `compare_run`（传 variants + shared_user_prompt；想看稳定性传 repeat_n）。让学员看网页面板的 live 结果。
5. 学员要点评/下一步时调 `compare_results` 读回，客观转述——**不替他判定哪个最好**，判定交给他的眼睛和 👍。

如果工具提示「还没登录」，引导学员先 :lab-login。提示「还没有进行中的 lab」，引导 :lab 选一个。

### `:lab-kb`(或"这个 lab 有哪些知识点")
调用 `get_lab_kb` 工具，**只读**展示当前 lab 的知识点 checklist（哪些已完成、哪些未完成）。不要在这里推进任何 checkpoint。如果没有进行中的 lab，提示学员先 :lab-start。

### `:lab-review`(或"提交 review" / "我做完了想让Mentor批改")
学员要提交当前 lab 的 review。

1. 以Mentor口吻问 **2-3 个反思题**，让学员**自由打字**回答（Feynman 式：用自己的话讲清这个 lab 的核心、最意外的发现、还卡在哪）。不要降级成选项卡——这里必须让学员 articulate。
2. 用你的 Read/Bash 抓当前 lab 工作目录的源码，**排除** `node_modules`/`.env`/`.git`。单文件超 ~20KB 截断，总量控制在 ~100KB 内。
3. 调 `submit_review`：`reflections` 传你整理好的「问题 + 学员回答」文本，`code_snapshot` 传抓到的代码。
4. 成功后把返回的编号告诉学员，并说明「Mentor 1-2 天内批改，:lab-read 查看」。

### `:lab-read`(或"看Mentor回复了吗")
调 `get_inbox`，**`mark_seen` 传 true**（这会把这些标记为已读）。

- 把每条以Mentor口吻清楚呈现：是哪个 lab 的批改 / 哪条私信的回复，Marvin 说了什么。
- 对 review 批改，提示学员可以用 :lab-reply `<编号>` 回复Mentor（编号用 get_inbox 返回的 id）。
- 如果没有未读，告诉学员目前没有来自Mentor的新回复。

### `:lab-private-message`(或"给 Marvin 发私信")
学员要给真人 Marvin 发私信。

- **明确告诉学员**：这条消息**只有真人 Marvin 会读**，他**通常 1-2 天回复**。
- 让学员**自由打字**写内容。
- **发送前确认**（用编号:1 确认发送 / 2 再改改 / 3 取消）。
- 选 `确认发送` 后调 `send_message`（body = 学员写的内容）。
- 成功后简短确认，提示「:lab-read 看Mentor的回复」。

### `:lab-reply`(或"回复Mentor的批改")
学员要回复某条 review 批改。

- 从 `$ARGUMENTS` 取 review 编号。没给、或学员不确定有哪些，就先让他 :lab-read 看一遍（那里会列出可回复的编号）。
- 让学员**自由打字**写回复，然后调 `post_review_reply`（`review_id` = 编号，`body` = 回复内容）。
- 成功后简短确认已发给Mentor。

### `:lab-logout`
调用 `auth_logout` 工具清除本地存储的登录凭证。完成后简短确认即可。

### `:lab-exit`
调用 `exit_lab` 工具。它会返回一条 SYSTEM 指示让你卸下Mentor人格 + lab 操作准则。按指示执行：恢复成普通助手身份，简短确认已退出。退出后**不再**以 `📚 [Lab...]` 结尾。
