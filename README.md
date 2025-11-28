# Task Tracker CLI

这是一个用 **Node.js** 编写的命令行任务管理工具，可以在终端中对任务进行新增、查看、更新、删除和状态管理等操作。所有任务数据会保存在当前目录下的 `tasks.json` 文件中。

---

## 环境要求

- Node.js：推荐版本 ≥ 18
- 操作系统：Windows / macOS / Linux 均可（本项目以 Windows 为例）

可以通过以下命令确认 Node.js 是否安装成功：

```bash
node -v
npm -v
```

---

## 项目地址

本项目来自 roadmap.sh 的 Task Tracker 练习：

- 项目页面：[Task Tracker – roadmap.sh](https://roadmap.sh/projects/task-tracker)
- 

## 安装与运行

1. 克隆或下载本项目代码到本地，例如：

   ```bash
   D:\WebProject\Task-Tracker
   ```

2. 使用 VS Code 或其他编辑器打开项目目录，确保目录下包含：

   - `task-cli.js`
   - （运行后会生成）`tasks.json`

3. 在项目目录中打开终端（PowerShell / CMD 等），通过 `node` 命令运行：

   ```bash
   node task-cli.js
   ```

   如果不带任何参数，会显示工具的使用说明。

---

## 使用说明（命令一览）

在项目目录下，通过以下命令使用工具：

### 1. 添加任务

```bash
node task-cli.js add "任务描述"
```

示例：

```bash
node task-cli.js add "Buy groceries"
node task-cli.js add "Finish homework"
```

效果：在 `tasks.json` 中新增一条状态为 `todo` 的任务。

---

### 2. 查看任务列表（简洁表格）

```bash
# 查看全部任务
node task-cli.js list

# 只查看某个状态的任务
node task-cli.js list todo
node task-cli.js list in-progress
node task-cli.js list done
```

示例输出：

```text
当前视图：所有任务列表
ID    状态           描述
--    -----------    -----------------------------
 1    todo           Buy groceries and cook dinner
 2    in-progress    Learn Node.js
 3    done           Finish homework

(详细时间信息请查看 tasks.json)
```

---

### 3. 查看任务列表（详细信息）

```bash
node task-cli.js list-detail
```

示例输出（包含时间）：

```text
ID: 1, 描述: Buy groceries, 状态: todo, 创建时间: 2025-11-28T12:00:00, 更新时间: 2025-11-28T12:00:00
ID: 2, 描述: Finish homework, 状态: done, 创建时间: 2025-11-28T12:05:00, 更新时间: 2025-11-28T12:10:00
```

---

### 4. 更新任务描述

```bash
node task-cli.js update <id> "新的任务描述"
```

示例：

```bash
node task-cli.js update 1 "Buy groceries and cook dinner"
```

效果：修改指定 `id` 的任务描述，并更新其 `updated_at` 时间。

---

### 5. 删除任务

```bash
node task-cli.js delete <id>
```

示例：

```bash
node task-cli.js delete 3
```

效果：删除 `id` 为 3 的任务。如果找不到对应 id，会给出提示。

---

### 6. 修改任务状态

支持三种状态：

- `todo`：待办（新增任务默认状态）
- `in-progress`：进行中
- `done`：已完成

#### 标记为进行中

```bash
node task-cli.js mark-in-progress <id>
```

示例：

```bash
node task-cli.js mark-in-progress 2
```

#### 标记为已完成

```bash
node task-cli.js mark-done <id>
```

示例：

```bash
node task-cli.js mark-done 2
```

---

## 数据存储说明

- 所有任务数据都保存在当前目录下的 `tasks.json` 中。
- 每条任务的结构大致如下：

```json
{
  "id": 1,
  "description": "Buy groceries",
  "status": "todo",
  "created_at": "2025-11-28T12:00:00",
  "updated_at": "2025-11-28T12:00:00"
}
```

你可以直接用编辑器打开 `tasks.json` 查看或备份数据。

---

## 示例使用流程

```bash
# 1. 新增任务
node task-cli.js add "Buy groceries"
node task-cli.js add "Learn Node.js"

# 2. 查看全部任务
node task-cli.js list

# 3. 将某个任务标记为进行中
node task-cli.js mark-in-progress 2

# 4. 将任务标记为已完成
node task-cli.js mark-done 2

# 5. 更新任务描述
node task-cli.js update 1 "Buy groceries and cook dinner"

# 6. 删除任务
node task-cli.js delete 2

# 7. 查看详细信息
node task-cli.js list-detail
```

---

## 项目文件说明

- `task-cli.js`：命令行主程序，包含所有命令的实现逻辑。
- `tasks.json`：任务数据文件（程序运行后自动创建）。

---

## 后续可以改进的方向（可选）

如果你想继续扩展这个项目，可以尝试：

- 增加命令：`mark-todo <id>`（把任务状态改回 `todo`）
- 增加命令：`clear-done`（清理所有已完成的任务）
- 使用第三方库美化终端输出（如 `chalk`、`cli-table3` 等）
- 将项目发布到 npm，上升为全局命令（例如 `task-cli list`）

目前的版本已经是一个完整、可用的命令行任务管理工具。