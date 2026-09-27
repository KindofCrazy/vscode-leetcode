# LeetCode Enhanced

这是 [LeetCode-OpenSource/vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) 的增强版本，可直接在 VS Code 中浏览、编写、测试和提交 LeetCode 题目。

[English](../README.md)

## 新增功能

- **分屏显示**：题目描述显示在左侧，代码编辑器显示在右侧。
- **题单管理**：创建和管理自定义题单，并可从 LeetCode 学习计划或题单 URL 导入。
- **Clear 快捷操作**：恢复官方初始代码框架，同时保留题目元数据和文件结构；支持通过 `Ctrl+Z` 撤销。
- **统一面板位置**：题目描述、测试结果和提交结果会显示在配置的编辑器栏中。

登录、浏览题目、测试、提交、收藏和切换中英文站等原有功能均保留。

## 安装

### 从 VS Code 扩展市场安装

1. 打开 VS Code 扩展面板。
2. 搜索 **LeetCode Enhanced**。
3. 安装发布者为 **keyang** 的扩展。

扩展 ID：`keyang.vscode-leetcode-enhanced`

### 从 GitHub Release 安装

1. 从 [GitHub Releases](https://github.com/KindofCrazy/vscode-leetcode/releases/latest) 下载最新的 `.vsix` 文件。
2. 在 VS Code 扩展面板点击 `...`，选择 **从 VSIX 安装...**。

也可以使用命令行安装：

```bash
code --install-extension vscode-leetcode-enhanced-0.18.6.vsix --force
```

## 快速使用

1. 安装 [Node.js](https://nodejs.org/)，并确保可从 `PATH` 中运行 `node`。
2. 打开 LeetCode 侧边栏并登录，推荐使用 Cookie 登录。
3. 选择题目并点击 **Show Problem**。
4. 使用编辑器中的快捷操作测试、提交、查看描述或清空答案。

常用设置：

```json
{
  "leetcode.enableSplitView": true,
  "leetcode.editor.shortcuts": ["submit", "test", "description", "clear"]
}
```

如果已经自定义过 `leetcode.editor.shortcuts`，请加入 `"clear"` 以显示 Clear 按钮。

## 运行条件

- VS Code 1.57.0 或更高版本
- Node.js 10 或更高版本

## 许可证

[MIT](../LICENSE)。本项目保留了原扩展及其依赖项目的许可证和致谢信息。
