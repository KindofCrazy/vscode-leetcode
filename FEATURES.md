# vscode-leetcode 新功能说明

## 新增功能

### 1. 分屏显示模式 (Split View Mode)

**功能描述**: 支持左栏显示题目描述，右栏显示代码编辑器的分屏模式。

**配置选项**:
- `leetcode.enableSplitView`: 启用分屏显示模式 (默认: true)

**使用方法**:
1. 在设置中启用 `leetcode.enableSplitView`
2. 打开任意LeetCode题目
3. 题目描述将显示在左侧，代码编辑器显示在右侧

**技术实现**:
- 修改了 `showProblemInternal` 函数，添加了 `showProblemWithSplitView` 函数
- 使用 `ViewColumn.One` 显示描述，`ViewColumn.Two` 显示代码编辑器

### 2. 题单功能 (Problem Lists)

**功能描述**: 支持创建和管理自定义题单，以及使用LeetCode官方题单。

**新增命令**:
- `leetcode.createProblemList`: 创建自定义题单
- `leetcode.deleteProblemList`: 删除自定义题单
- `leetcode.addProblemToList`: 将题目添加到题单
- `leetcode.removeProblemFromList`: 从题单中移除题目
- `leetcode.manageProblemLists`: 管理题单

**数据结构**:
```typescript
interface IProblemList {
    id: string;
    name: string;
    description?: string;
    isOfficial: boolean;
    problems: string[]; // 题目ID数组
    createdAt: Date;
    updatedAt: Date;
}
```

**功能特性**:
- 支持创建自定义题单
- 支持官方题单（Top Interview 150, LeetCode 75等）
- 题单数据持久化存储
- 在侧边栏中显示题单分类
- 支持题目的添加和移除操作

**技术实现**:
- 新增 `problemListManager` 类管理题单数据
- 扩展 `explorerNodeManager` 支持题单节点
- 在 `Category` 枚举中添加 `ProblemList` 类型
- 题单数据存储在 `.leetcode/problemLists.json` 文件中

## 文件修改清单

### 新增文件
- `src/problemList/problemListManager.ts` - 题单管理器
- `src/commands/problemList.ts` - 题单相关命令
- `FEATURES.md` - 功能说明文档

### 修改文件
- `src/commands/show.ts` - 添加分屏显示功能
- `src/explorer/explorerNodeManager.ts` - 支持题单节点
- `src/explorer/LeetCodeTreeDataProvider.ts` - 处理题单显示
- `src/shared.ts` - 添加题单相关接口和枚举
- `src/extension.ts` - 注册新命令和初始化题单管理器
- `package.json` - 添加新命令和配置选项

## 使用方法

### 启用分屏模式
1. 打开VS Code设置
2. 搜索 "leetcode.enableSplitView"
3. 确保该选项已启用

### 使用题单功能
1. 在LeetCode侧边栏中找到 "ProblemList" 分类
2. 右键点击题目，选择 "Add to Problem List" 添加到题单
3. 使用命令面板 (Ctrl+Shift+P) 搜索 "LeetCode: Manage Problem Lists" 管理题单

## 注意事项

- 分屏模式需要VS Code支持多列编辑器
- 题单数据存储在项目根目录的 `.leetcode` 文件夹中
- 官方题单的题目列表需要从LeetCode API获取（当前为占位符）
- 自定义题单支持本地存储，不会同步到LeetCode服务器

## 未来改进

1. 集成LeetCode API获取官方题单的完整题目列表
2. 支持题单的导入导出功能
3. 添加题单的搜索和过滤功能
4. 支持题单的拖拽排序
5. 添加题单的统计信息（完成率、难度分布等）
