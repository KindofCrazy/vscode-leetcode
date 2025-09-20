# VS Code 插件市场发布指南

## 📋 发布前检查清单

### 1. 法律和版权
- ✅ 基于MIT许可证的原始项目
- ✅ 明确标注为fork版本
- ✅ 保留原始版权声明
- ✅ 添加自己的贡献说明

### 2. 插件信息
- ✅ 更新了package.json中的名称和发布者
- ✅ 修改了版本号 (0.18.5)
- ✅ 更新了仓库地址
- ✅ 添加了增强功能描述

### 3. 功能测试
- ✅ 分屏显示功能正常
- ✅ 题单功能完整
- ✅ 所有命令可正常使用
- ✅ 编译无错误

## 🚀 发布步骤

### 步骤1：安装vsce工具
```bash
npm install -g vsce
```

### 步骤2：登录Azure DevOps
```bash
# 创建Personal Access Token
# 访问：https://dev.azure.com/your-org/_usersSettings/tokens
vsce login KindofCrazy
```

### 步骤3：验证插件
```bash
vsce ls
```

### 步骤4：打包插件
```bash
vsce package
```

### 步骤5：发布到市场
```bash
vsce publish
```

## ⚠️ 重要注意事项

### 1. 发布者账户
- 需要创建Azure DevOps账户
- 需要创建Visual Studio Marketplace发布者账户
- 发布者ID必须与package.json中的publisher字段匹配

### 2. 版本管理
- 每次发布都需要更新版本号
- 建议使用语义化版本控制 (semver)
- 当前版本：0.18.5

### 3. 市场审核
- 插件会经过VS Code团队审核
- 审核时间通常为1-3个工作日
- 确保功能稳定且无恶意代码

## 📝 发布后维护

### 1. 用户反馈
- 监控GitHub Issues
- 及时回复用户问题
- 收集功能建议

### 2. 版本更新
- 定期同步原项目更新
- 修复bug和改进功能
- 发布新版本

### 3. 文档维护
- 保持README更新
- 添加使用示例
- 更新功能说明

## 🔗 相关链接

- [VS Code扩展发布指南](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Azure DevOps](https://dev.azure.com/)
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
- [语义化版本控制](https://semver.org/)

## 📞 支持

如有问题，请通过以下方式联系：
- GitHub Issues: https://github.com/KindofCrazy/vscode-leetcode/issues
- Email: [您的邮箱]

---

**注意**: 发布前请确保已阅读并理解VS Code扩展发布条款和条件。
