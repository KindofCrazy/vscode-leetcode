# LeetCode Enhanced

> 在 VS Code 中练习 LeetCode，支持增强的分屏显示和题单管理功能

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/resources/LeetCode.png" alt="">
</p>
<p align="center">
  <a href="https://github.com/KindofCrazy/vscode-leetcode/actions?query=workflow%3ACI+branch%3Amaster">
    <img src="https://img.shields.io/github/workflow/status/KindofCrazy/vscode-leetcode/CI/master?style=flat-square" alt="">
  </a>
  <a href="https://github.com/KindofCrazy/vscode-leetcode">
    <img src="https://img.shields.io/github/stars/KindofCrazy/vscode-leetcode.svg?style=flat-square" alt="">
  </a>
  <a href="https://github.com/KindofCrazy/vscode-leetcode/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/KindofCrazy/vscode-leetcode.svg?style=flat-square" alt="">
  </a>
</p>

## 🚀 增强功能

这是原始 [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) 插件的增强版本，包含以下改进：

### ✨ 新增功能

#### 1. **分屏显示模式**
- **左侧题目描述，右侧代码编辑器**：查看题目时，描述自动在左栏打开，代码编辑器在右栏打开
- **统一布局**：所有相关视图（提交结果、测试结果、描述）都在左栏打开，布局更整齐
- **可配置**：可通过 `leetcode.enableSplitView` 设置启用/禁用

#### 2. **题单管理功能**
- **自定义题单**：创建和管理您自己的题单
- **官方题单支持**：支持 LeetCode 官方题单和自定义题单
- **基于URL的题单**：从任何LeetCode学习计划或题单URL创建题单
- **便捷管理**：右键点击题目即可添加到题单或从题单中移除
- **持久化存储**：题单保存在本地，在 VS Code 会话间保持

### 🔧 增强功能

#### **改进的用户体验**
- **更好的布局**：所有 webview 面板（提交、测试、描述）现在都遵循分屏设置
- **一致的行为**：所有 LeetCode 相关视图都有统一的显示行为
- **智能定位**：视图会根据您的分屏偏好自动定位

#### **新增命令**
- `LeetCode: Create Problem List` - 创建新的自定义题单（空题单或从 URL 导入）
- `LeetCode: Manage Problem Lists` - 查看和管理现有题单
- `LeetCode: Add to Problem List` - 将当前题目添加到题单
- `LeetCode: Remove from Problem List` - 从题单中移除当前题目

#### **新增设置**
- `leetcode.enableSplitView` - 启用/禁用分屏显示模式（默认：true）

## 📋 与原始插件对比

| 功能 | 原始版本 | 增强版本 |
|------|----------|----------|
| **分屏显示** | ❌ 无 | ✅ 有 - 描述在左，代码在右 |
| **题单管理** | ❌ 无 | ✅ 有 - 自定义和官方题单 |
| **视图一致性** | ❌ 混合 | ✅ 有 - 所有视图遵循分屏设置 |
| **题单操作** | ❌ 无 | ✅ 有 - 完整的增删改查操作 |
| **布局控制** | ❌ 有限 | ✅ 有 - 可配置的分屏行为 |

- [English Document](https://github.com/KindofCrazy/vscode-leetcode#requirements) | 中文文档

## ❗️ 登录建议 ❗️

> **推荐**：使用 Cookie 登录以获得此增强版插件的最佳体验。

### 为什么推荐 Cookie 登录

- **网页授权** 可能会跳转到原始 LeetCode 插件
- **Cookie 登录** 可以直接访问此增强版本
- **更可靠** 对于增强功能（分屏显示、题单管理）

### 如何使用 Cookie 登录

1. **从 Network → GraphQL 获取 Cookie**：
   - 打开 LeetCode 网站（`leetcode.com` 或 `leetcode.cn`）并确保已在浏览器中登录
   - 按 F12 打开开发者工具，切换到 Network 面板，筛选为 Fetch/XHR，然后按 F5 刷新
   - 在请求列表中点击任意 `graphql` 请求
   - 在右侧 Request Headers 中找到 `Cookie` 字段，复制其完整值

2. **使用 Cookie 登录**：
   - 在 LeetCode Explorer 中点击 `Sign In`
   - 选择 `LeetCode Cookie`（推荐）
   - 粘贴第 1 步复制的 Cookie 请求头完整值
   - 登录成功！

> **提示**：在 `leetcode.cn` 上流程相同，仅需在中文站点上执行上述步骤。参考社区教程（[CSDN 博客](https://blog.csdn.net/m0_73531461/article/details/137224171)）。

## 🎯 快速开始

### 安装方法

#### 选项1：从 VS Code 扩展市场安装
- 在 VS Code 扩展市场中搜索 "LeetCode Enhanced"
- 点击安装
- *发布者：keyang*

#### 选项2：从 GitHub Releases 安装
1. **从 [GitHub Releases](https://github.com/KindofCrazy/vscode-leetcode/releases) 下载最新 .vsix 文件**
2. **通过 VS Code 安装**：
   ```bash
   code --install-extension vscode-leetcode-enhanced-[版本号].vsix
   ```

#### 选项3：从源码安装
```bash
git clone https://github.com/KindofCrazy/vscode-leetcode.git
cd vscode-leetcode
npm install
npm run compile
vsce package
code --install-extension *.vsix
```

### 基本使用

1. **登录 LeetCode** 使用 LeetCode Explorer 面板
2. **浏览题目** - 点击任意题目即可打开分屏显示
3. **创建题单** - 右键点击题目添加到题单
4. **管理题单** - 使用资源管理器中的题单部分

## 🔧 配置说明

### 分屏显示设置

```json
{
  "leetcode.enableSplitView": true  // 启用分屏显示模式
}
```

### 题单管理

- **创建题单**：使用 `LeetCode: Create Problem List` 命令
- **添加题目**：右键点击任意题目 → "Add to Problem List"
- **管理题单**：使用 `LeetCode: Manage Problem Lists` 命令
- **从URL创建**：使用 `LeetCode: Create Problem List` 命令（选择"Import from URL"选项）

#### 支持的URL类型

- 📚 **学习计划** - 任何LeetCode学习计划URL（如：`/studyplan/top-100-liked/`）
- 📋 **题单** - 任何LeetCode题单URL（如：`/problem-list/5VgExJRB/`）
- 🌐 **双域名支持** - 支持 leetcode.cn 和 leetcode.com
- 🎯 **智能命名** - 根据URL模式智能命名

## 运行条件

- [VS Code 1.57.0+](https://code.visualstudio.com/)
- [Node.js 10+](https://nodejs.org)
  > 注意：请确保`Node`在`PATH`环境变量中。您也可以通过设定 `leetcode.nodePath` 选项来指定 `Node.js` 可执行文件的路径。

## 快速开始

![demo](https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/gifs/demo.gif)

## 功能

### 登入登出

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/sign_in.png" alt="登入登出" />
</p>

- 点击 `LeetCode Explorer` 中的 `Sign in to LeetCode` 即可登入。

- 你也可以使用下来命令登入或利用 cookie 登入或登出:
  - **LeetCode: Sign in**
  - **LeetCode: Sign out**

---

### 切换 LeetCode 版本

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/endpoint.png" alt="切换 LeetCode 版本" />
</p>

- LeetCode 目前有**英文版**和**中文版**两种版本。点击 `LeetCode Explorer` 导航栏中的 ![btn_endpoint](https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/btn_endpoint.png) 按钮可切换版本。

- 目前可切换的版本有:

  - **leetcode.com**
  - **leetcode.cn**

  > 注意：两种版本的 LeetCode 账户并**不通用**，请确保当前激活的版本是正确的。插件默认激活的是**英文版**。

---

### 选择题目

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/pick_problem.png" alt="选择题目" />
</p>

- 直接点击题目或者在 `LeetCode Explorer` 中**右键**题目并选择 `Preview Problem` 可查看题目描述
- 选择 `Show Problem` 可直接进行答题。

  > 注意：你可以通过更新配置项 `leetcode.workspaceFolder` 来指定保存题目文件所用的工作区路径。默认工作区路径为：**$HOME/.leetcode/**。

  > 注意：你可以通过更新配置项 `leetcode.showCommentDescription` 来指定是否要在注释中包含题目描述。

  > 注意：你可以通过 `LeetCode: Switch Default Language` 命令变更答题时默认使用编程语言。

---

### 编辑器快捷方式

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/shortcuts.png" alt="Editor Shortcuts" />
</p>

- 插件会在编辑区域内支持五种不同的快捷方式（Code Lens）:

  - `Submit`: 提交你的答案至 LeetCode；
  - `Test`: 用给定的测试用例测试你的答案；
  - `Star`: 收藏或取消收藏该问题；
  - `Solution`: 显示该问题的高票解答；
  - `Description`: 显示该问题的题目描述。

  > 注意：你可以通过 `leetcode.editor.shortcuts` 配置项来定制需要激活的快捷方式。默认情况下只有 `Submit` 和 `Test` 会被激活。

---

### 通过关键字搜索题目

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/search.png" alt="通过关键字搜索题目" />
</p>

- 点击 `LeetCode Explorer` 导航栏中的 ![btn_search](https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/btn_search.png) 按钮可按照关键字搜索题目。

---

### 管理存档

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/session.png" alt="管理存档" />
</p>

- 点击位于 VS Code 底部状态栏的 `LeetCode: ***` 管理 `LeetCode 存档`。你可以**切换**存档或者**创建**，**删除**存档。

## 插件配置项

| 配置项名称                        | 描述                                                                                                                                                                                                                                                                                                          | 默认值             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **🆕 增强设置**                   |                                                                                                                                                                                                                                                                                                                |                    |
| `leetcode.enableSplitView`        | **新增**：启用分屏显示模式 - 描述在左侧，代码编辑器在右侧                                                                                                                                                                                                                                                      | `true`             |
| **原始设置**                      |                                                                                                                                                                                                                                                                                                                |                    |
| `leetcode.hideSolved`             | 指定是否要隐藏已解决的问题                                                                                                                                                                                                                                                                                    | `false`            |
| `leetcode.defaultLanguage`        | 指定答题时使用的默认语言，可选语言有：`bash`, `c`, `cpp`, `csharp`, `golang`, `java`, `javascript`, `kotlin`, `mysql`, `php`, `python`,`python3`,`ruby`, `rust`, `scala`, `swift`, `typescript`                                                                                                               | `N/A`              |
| `leetcode.useWsl`                 | 指定是否启用 WSL                                                                                                                                                                                                                                                                                              | `false`            |
| `leetcode.endpoint`               | 指定使用的终端，可用终端有：`leetcode`, `leetcode-cn`                                                                                                                                                                                                                                                         | `leetcode`         |
| `leetcode.workspaceFolder`        | 指定保存文件的工作区目录                                                                                                                                                                                                                                                                                      | `""`               |
| `leetcode.filePath`               | 指定生成题目文件的相对文件夹路径名和文件名。点击查看[更多详细用法](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%98%E7%9B%AE%E6%96%87%E4%BB%B6%E7%9A%84%E7%9B%B8%E5%AF%B9%E6%96%87%E4%BB%B6%E5%A4%B9%E8%B7%AF%E5%BE%84%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D)。 |                    |
| `leetcode.enableStatusBar`        | 指定是否在 VS Code 下方显示插件状态栏。                                                                                                                                                                                                                                                                       | `true`             |
| `leetcode.editor.shortcuts`       | 指定在编辑器内所自定义的快捷方式。可用的快捷方式有: `submit`, `test`, `star`, `solution`, `description`。                                                                                                                                                                                                     | `["submit, test"]` |
| `leetcode.enableSideMode`         | 指定在解决一道题时，是否将`问题预览`、`高票答案`与`提交结果`窗口集中在编辑器的第二栏。                                                                                                                                                                                                                        | `true`             |
| `leetcode.nodePath`               | 指定 `Node.js` 可执行文件的路径。如：C:\Program Files\nodejs\node.exe                                                                                                                                                                                                                                         | `node`             |
| `leetcode.showCommentDescription` | 指定是否要在注释中显示题干。                                                                                                                                                                                                                                                                                  | `false`            |
| `leetcode.useEndpointTranslation` | 是否显示翻译版本内容。                                                                                                                                                                                                                                                                                        | `true`             |
| `leetcode.allowReportData`        | 为了更好的产品体验允许上报用户埋数据                                                                                                                                                                                                                                                                          | `true`             |

## 📁 文件结构

```
src/
├── commands/
│   ├── problemList.ts          # 新增：题单管理命令
│   └── show.ts                 # 增强：分屏显示支持
├── problemList/
│   └── problemListManager.ts   # 新增：题单数据管理
├── webview/
│   ├── leetCodePreviewProvider.ts    # 增强：分屏显示支持
│   └── leetCodeSubmissionProvider.ts # 增强：分屏显示支持
└── shared.ts                   # 增强：新接口和类型
```

## 🔄 从原始插件迁移

1. **备份您的设置**（可选）
2. **卸载原始插件**
3. **安装此增强版本**
4. **您现有的题目和设置将被保留**

## 🤝 贡献

本项目基于原始 [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) 插件。

### 保留的原始功能
- 所有原始 LeetCode 功能
- 登录/登出功能
- 题目浏览和解答
- 测试和提交功能
- 所有原始设置和配置

### 新增贡献
- 分屏布局系统
- 题单管理
- 增强用户界面
- 改进视图一致性

## 需要帮助？

在遇到任何问题时，可以先查看一下[疑难解答](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/%E7%96%91%E9%9A%BE%E8%A7%A3%E7%AD%94)以及[常见问题](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)寻求帮助。

如果您的问题依然没有解决，可以在 [Gitter Channel](https://gitter.im/vscode-leetcode/Lobby) 联系我们，或者您也可以[记录一个新的 issue](https://github.com/KindofCrazy/vscode-leetcode/issues/new/choose)。

## 更新日志

请参考[更新日志](https://github.com/LeetCode-OpenSource/vscode-leetcode/blob/master/CHANGELOG.md)

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **原始项目**：基于 [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) 由 [@LeetCode-OpenSource](https://github.com/LeetCode-OpenSource) 开发
- **核心 CLI**：基于 [leetcode-cli](https://github.com/skygragon/leetcode-cli) 由 [@skygragon](https://github.com/skygragon) 开发
- **贡献者**：感谢原始项目的所有贡献者

## 📞 支持

- **问题反馈**：[GitHub Issues](https://github.com/KindofCrazy/vscode-leetcode/issues)
- **文档**：[Wiki](https://github.com/KindofCrazy/vscode-leetcode/wiki)
- **原始项目**：[vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode)

---

**注意**：这是原始 vscode-leetcode 插件的增强版分支。在添加新功能以提供更好用户体验的同时，保留了所有原始功能。
