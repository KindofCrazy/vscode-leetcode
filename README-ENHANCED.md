# vscode-leetcode Enhanced

这是基于官方 vscode-leetcode 插件的增强版本，添加了分屏显示和题单功能。

## 🚀 新功能

### 1. 分屏显示模式 (Split View Mode)
- **左栏显示题目描述**，右栏显示代码编辑器
- 提供更好的编程体验，无需切换窗口
- 可通过设置 `leetcode.enableSplitView` 启用/禁用

### 2. 题单功能 (Problem Lists)
- **自定义题单**：创建和管理个人题单
- **官方题单**：支持 LeetCode 官方题单（Top Interview 150, LeetCode 75等）
- **题目管理**：轻松添加/移除题目到题单
- **持久化存储**：题单数据本地保存

## 📦 安装方法

### 方法1：从VSIX文件安装
1. 下载 `enhanced-leetcode.vsix` 文件
2. 打开 VS Code
3. 进入扩展页面 (Ctrl+Shift+X)
4. 点击 "..." 菜单，选择 "Install from VSIX..."
5. 选择下载的 `enhanced-leetcode.vsix` 文件
6. 重启 VS Code

### 方法2：从源码构建
```bash
git clone <repository-url>
cd vscode-leetcode-enhanced
npm install
npm run compile
vsce package
```

## ⚙️ 配置选项

### 分屏显示
```json
{
    "leetcode.enableSplitView": true
}
```

### 题单功能
题单功能无需额外配置，安装后即可使用。

## 🎯 使用方法

### 分屏模式
1. 确保 `leetcode.enableSplitView` 设置为 `true`
2. 打开任意 LeetCode 题目
3. 题目描述将自动显示在左侧，代码编辑器在右侧

### 题单管理
1. 在 LeetCode 侧边栏中找到 "ProblemList" 分类
2. 右键点击题目，选择 "Add to Problem List" 添加到题单
3. 使用命令面板 (Ctrl+Shift+P) 搜索 "LeetCode: Manage Problem Lists" 管理题单

## 🔧 新增命令

- `leetcode.createProblemList` - 创建自定义题单
- `leetcode.deleteProblemList` - 删除自定义题单
- `leetcode.addProblemToList` - 将题目添加到题单
- `leetcode.removeProblemFromList` - 从题单中移除题目
- `leetcode.manageProblemLists` - 管理题单

## 📁 文件结构

```
src/
├── problemList/
│   └── problemListManager.ts    # 题单管理器
├── commands/
│   └── problemList.ts           # 题单相关命令
├── explorer/
│   ├── explorerNodeManager.ts   # 扩展节点管理器
│   └── LeetCodeTreeDataProvider.ts # 更新树形数据提供者
├── commands/
│   └── show.ts                  # 添加分屏显示功能
└── shared.ts                    # 添加题单相关接口
```

## 🐛 问题反馈

如果您遇到任何问题或有功能建议，请：

1. 检查 VS Code 开发者控制台是否有错误信息
2. 确保已正确安装并启用了插件
3. 尝试重启 VS Code

## 📄 许可证

本项目基于 MIT 许可证，继承自原始 vscode-leetcode 项目。

## 🙏 致谢

感谢 [LeetCode-OpenSource](https://github.com/LeetCode-OpenSource/vscode-leetcode) 提供的原始插件。

---

**注意**: 这是增强版本，建议在安装前备份您的 LeetCode 相关设置和数据。
