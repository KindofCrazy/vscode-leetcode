# Fork和推送指南

## 步骤1：在GitHub上Fork原仓库

1. 打开浏览器，访问：https://github.com/LeetCode-OpenSource/vscode-leetcode
2. 点击右上角的 "Fork" 按钮
3. 选择您的GitHub账户作为目标
4. 等待fork完成

## 步骤2：获取您的Fork仓库URL

Fork完成后，您会看到类似这样的URL：
```
https://github.com/YOUR_USERNAME/vscode-leetcode.git
```

## 步骤3：添加您的Fork仓库作为远程仓库

在项目目录下运行以下命令（替换YOUR_USERNAME为您的GitHub用户名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/vscode-leetcode.git
```

## 步骤4：推送代码到您的仓库

```bash
# 推送所有分支到您的仓库
git push -u origin master

# 如果遇到冲突，可能需要强制推送（谨慎使用）
git push -u origin master --force
```

## 步骤5：验证推送成功

1. 访问您的GitHub仓库页面
2. 确认所有文件都已上传
3. 检查提交历史是否完整

## 当前项目状态

- ✅ 已添加upstream远程仓库（原仓库）
- ✅ 代码已提交到本地master分支
- ✅ 包含所有增强功能
- ✅ 包含安装脚本和文档

## 推送后的仓库结构

您的fork仓库将包含：
- 原始vscode-leetcode代码
- 分屏显示功能
- 题单功能
- 安装脚本和文档
- 完整的提交历史

## 后续操作

推送完成后，您可以：
1. 在GitHub上创建Pull Request到原仓库
2. 继续在您的fork仓库中开发新功能
3. 与社区分享您的增强版本

## 注意事项

- 确保您有原仓库的访问权限
- 如果遇到权限问题，检查GitHub认证设置
- 建议定期同步原仓库的更新
