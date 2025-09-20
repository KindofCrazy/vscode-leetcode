# 快速开始指南

## 🎯 立即体验新功能

### 1. 安装增强版插件
```powershell
# 在项目目录下运行
powershell -ExecutionPolicy Bypass -File install-enhanced.ps1
```

### 2. 在VS Code中安装
1. 打开 VS Code
2. 按 `Ctrl+Shift+X` 打开扩展页面
3. 点击右上角的 "..." 菜单
4. 选择 "Install from VSIX..."
5. 选择 `enhanced-leetcode.vsix` 文件
6. 重启 VS Code

### 3. 启用分屏模式
1. 按 `Ctrl+,` 打开设置
2. 搜索 "leetcode.enableSplitView"
3. 确保该选项已勾选

### 4. 开始使用

#### 分屏显示
- 打开任意 LeetCode 题目
- 题目描述自动显示在左侧
- 代码编辑器显示在右侧

#### 题单功能
- 在左侧 LeetCode 面板中找到 "ProblemList" 分类
- 右键点击题目 → "Add to Problem List"
- 使用命令面板搜索 "Manage Problem Lists"

## 🔧 常用命令

| 命令 | 快捷键 | 功能 |
|------|--------|------|
| LeetCode: Create Problem List | - | 创建新题单 |
| LeetCode: Manage Problem Lists | - | 管理题单 |
| LeetCode: Add to Problem List | - | 添加题目到题单 |
| LeetCode: Show Problem | - | 显示题目（分屏模式） |

## 📋 功能检查清单

- [ ] 插件已安装并启用
- [ ] 分屏模式已启用
- [ ] 可以创建自定义题单
- [ ] 可以将题目添加到题单
- [ ] 题单在侧边栏中正确显示

## 🆘 遇到问题？

1. **分屏模式不工作**
   - 检查 `leetcode.enableSplitView` 设置
   - 确保VS Code支持多列编辑器

2. **题单功能不可用**
   - 重启VS Code
   - 检查LeetCode登录状态

3. **插件无法安装**
   - 确保VS Code版本 >= 1.57.0
   - 尝试手动安装VSIX文件

## 🎉 享受增强的LeetCode体验！

现在您可以享受更高效的LeetCode刷题体验了！
