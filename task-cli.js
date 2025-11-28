const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    if (!data.trim()) {
        return [];
    }
    return JSON.parse(data);
}

function saveTasks(tasks) {
    const json = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(TASKS_FILE, json, 'utf8');
}

function updateTaskStatus(id, newStatus) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
        console.log(`错误：未找到ID为${id}的任务`);
        return false;
    }

    task.status = newStatus;
    task.updated_at = new Date().toISOString().replace(/\.\d{3}Z$/, '');

    saveTasks(tasks);
    return true;
}

function printUsage() {
    console.log(`
        用法：
        node task-cli.js add "任务描述"
        node task-cli.js list
        node task-cli.js list-detail
        node task-cli.js list todo
        node task-cli.js list in-progress
        node task-cli.js list done
        node task-cli.js update <id> "新的任务描述"
        node task-cli.js delete <id>
        node task-cli.js mark-in-progress <id>
        node task-cli.js mark-done <id>
        `);
}

function main() {
    // 取命令行参数
    const args = process.argv.slice(2);

    if (args.length === 0) {
        printUsage();
        return;
    }

    const command = args[0];

    switch (command) {
        case 'add': {
            console.log('你执行了add命令');

            const taskDescription = args[1];
            if (!taskDescription) {
                console.log('错误：缺少任务描述');
                printUsage();
                return;
            }

            const tasks = loadTasks();
            const newId = tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1;
            const now = new Date().toISOString().replace(/\.\d{3}Z$/, '');

            const newTask = {
                id: newId,
                description: taskDescription,
                status: 'todo',
                created_at: now,
                updated_at: now,
            };

            tasks.push(newTask);
            saveTasks(tasks);

            console.log('任务已添加：', newTask);
            break;
        }
        case 'list': {
            console.log('你执行了list命令');

            const statusFilter = args[1]; // 可选参数，用于过滤任务状态

            if (statusFilter && !['todo', 'in-progress', 'done'].includes(statusFilter)) {
                console.log('错误：无效的状态过滤器。可用状态：todo, in-progress, done');
                return;
            }

            let tasks = loadTasks();

            if (statusFilter) {
                tasks = tasks.filter(t => t.status === statusFilter);
            }

            if (tasks.length === 0) {
                console.log('没有任务可显示');
                return;
            }

            // 打印任务列表
            const title = statusFilter ? `状态为"${statusFilter}"的任务列表` : '所有任务列表';
            console.log(`当前视图：${title}`);
            console.log('ID    状态           描述');
            console.log('--    -----------    -----------------------------');

            for (const t of tasks) {
                // 关键是这两句：先把 ID / status 变成固定宽度的字符串
                const idStr = String(t.id).padStart(2, ' ');      // 2 位宽，左边补空格
                const statusStr = String(t.status).padEnd(11, ' '); // 11 位宽，右边补空格
                
                console.log(`${idStr}    ${statusStr}     ${t.description}`);
            }

            console.log('\n(详细时间信息请查看 tasks.json)');
            break;
        }
        case 'list-detail': {
            console.log('你执行了list-detail命令');

            const tasks = loadTasks();

            if (tasks.length === 0) {
                console.log('没有任务可显示');
                return;
            }

            for (const task of tasks) {
                console.log(`ID: ${task.id}, 描述: ${task.description}, 状态: ${task.status}, 创建时间: ${task.created_at}, 更新时间: ${task.updated_at}`);
            }

            break;
        }
        case 'update': {
            // 用法检查
            console.log('你执行了update命令');

            const taskId = args[1];
            const newDescription = args[2];

            if (!taskId || !newDescription) {
                console.log('错误：缺少任务ID或新描述，用法：node task-cli.js update <id> "新的任务描述"');
                return;
            }

            const id = Number(taskId);
            if (!Number.isInteger(id)) {
                console.log('错误，任务ID必须是整数');
                return;
            }

            const tasks = loadTasks();
            const task = tasks.find(t => t.id === id);

            if (!task) {
                console.log(`错误：未找到ID为${id}的任务`);
                return;
            }

            task.description = newDescription;
            task.updated_at = new Date().toISOString().replace(/\.\d{3}Z$/, '');

            saveTasks(tasks);

            console.log('任务已更新：', task);
            break;
        }
        case 'delete': {
            console.log('你执行了delete命令');
            const taskId = args[1];

            if (!taskId) {
                console.log('错误：缺少任务ID，用法：node task-cli.js delete <id>');
                return;
            }

            const id = Number(taskId);
            if (!Number.isInteger(id)) {
                console.log('错误，任务ID必须是整数');
                return;
            }

            const tasks = loadTasks();
            const orininalLength = tasks.length;

            const updatedTasks = tasks.filter(t => t.id !== id);

            if (updatedTasks.length === orininalLength) {
                console.log(`错误：未找到ID为${id}的任务`);
                return;
            }

            saveTasks(updatedTasks);
            console.log(`任务ID为${id}的任务已删除`);
            break;
        }
        case 'mark-in-progress': {
            console.log('你执行了mark-in-progress命令');
            const taskId = args[1];
            if (!taskId) {
                console.log('错误：缺少任务ID，用法：node task-cli.js mark-in-progress <id> "新的状态"');
                return;
            }

            const id = Number(taskId);
            if (!Number.isInteger(id)) {
                console.log('错误，任务ID必须是整数');
                return;
            }

            const success = updateTaskStatus(id, 'in-progress');
            if (success) {
                console.log(`任务ID为${id}的任务状态已更新为in-progress`);
            }
            break;
        }
        case 'mark-done': {
            console.log('你执行了mark-done命令');
            const taskId = args[1];
            if (!taskId) {
                console.log('错误：缺少任务ID，用法：node task-cli.js mark-done <id> "新的状态"');
                return;
            }

            const id = Number(taskId);
            if (!Number.isInteger(id)) {
                console.log('错误，任务ID必须是整数');
                return;
            }

            const success = updateTaskStatus(id, 'done');
            if (success) {
                console.log(`任务ID为${id}的任务状态已更新为done`);
            }
            break;
        }
        default: {
            console.log('未知命令：', command);
            printUsage();
        }
    }
}

main();
// task-cli.js
// 这是一个简单的命令行任务管理工具
// 支持添加任务、列出任务、更新任务和删除任务