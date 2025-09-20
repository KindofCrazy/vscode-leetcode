# LeetCode Enhanced

> Solve LeetCode problems in VS Code with enhanced split view and problem list management

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

## 🚀 Enhanced Features

This is an enhanced version of the original [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) extension with the following improvements:

### ✨ New Features

#### 1. **Split View Mode** 
- **Description on Left, Code on Right**: When viewing a problem, the description automatically opens in the left column and the code editor in the right column
- **Consistent Layout**: All related views (submit results, test results, description) open in the left column for better organization
- **Configurable**: Can be enabled/disabled via `leetcode.enableSplitView` setting

#### 2. **Problem List Management**
- **Custom Problem Lists**: Create and manage your own problem lists
- **Official Lists Support**: Support for both official LeetCode problem lists and custom lists
- **URL-Based Problem Lists**: Create problem lists from any LeetCode study plan or problem list URL
- **Easy Management**: Right-click on problems to add/remove from lists
- **Persistent Storage**: Problem lists are saved locally and persist across VS Code sessions

### 🔧 Enhanced Functionality

#### **Improved User Experience**
- **Better Layout**: All webview panels (submit, test, description) now respect the split view setting
- **Consistent Behavior**: Unified display behavior across all LeetCode-related views
- **Smart Positioning**: Views automatically position themselves based on your split view preference

#### **New Commands**
- `LeetCode: Create Problem List` - Create a new custom problem list
- `LeetCode: Delete Problem List` - Delete an existing problem list  
- `LeetCode: Add to Problem List` - Add current problem to a list
- `LeetCode: Remove from Problem List` - Remove current problem from a list
- `LeetCode: Manage Problem Lists` - Open problem list management interface
- `LeetCode: Create Problem List from URL` - Create problem lists from LeetCode URLs

#### **New Settings**
- `leetcode.enableSplitView` - Enable/disable split view mode (default: true)

## 📋 Comparison with Original Extension

| Feature | Original | Enhanced |
|---------|----------|----------|
| **Split View** | ❌ No | ✅ Yes - Description left, code right |
| **Problem Lists** | ❌ No | ✅ Yes - Custom and official lists |
| **View Consistency** | ❌ Mixed | ✅ Yes - All views respect split setting |
| **List Management** | ❌ No | ✅ Yes - Full CRUD operations |
| **Layout Control** | ❌ Limited | ✅ Yes - Configurable split behavior |

- [English Document](https://github.com/KindofCrazy/vscode-leetcode#requirements) | [中文文档](https://github.com/KindofCrazy/vscode-leetcode/blob/master/docs/README_zh-CN.md)

## 🎯 Quick Start

### Installation

1. **Download the extension**:
   ```bash
   # Download the .vsix file from releases
   code --install-extension vscode-leetcode-enhanced-0.18.5.vsix
   ```

2. **Or install from source**:
   ```bash
   git clone https://github.com/KindofCrazy/vscode-leetcode.git
   cd vscode-leetcode
   npm install
   npm run compile
   vsce package
   code --install-extension vscode-leetcode-enhanced-0.18.5.vsix
   ```

### Basic Usage

1. **Sign in to LeetCode** using the LeetCode Explorer panel
2. **Browse problems** - click any problem to open it with split view
3. **Create problem lists** - right-click on problems to add them to lists
4. **Manage your lists** - use the Problem List section in the explorer

## 🔧 Configuration

### Split View Settings

```json
{
  "leetcode.enableSplitView": true  // Enable split view mode
}
```

### Problem List Management

- **Create List**: Use `LeetCode: Create Problem List` command
- **Add Problems**: Right-click on any problem → "Add to Problem List"
- **Manage Lists**: Use `LeetCode: Manage Problem Lists` command
- **Create from URL**: Use `LeetCode: Create Problem List from URL` command

#### Supported URL Types

- 📚 **Study Plans** - Any LeetCode study plan URL (e.g., `/studyplan/top-100-liked/`)
- 📋 **Problem Lists** - Any LeetCode problem list URL (e.g., `/problem-list/2ckc81c/`)
- 🌐 **Both Domains** - Support for both leetcode.cn and leetcode.com
- 🎯 **Auto-Naming** - Intelligent naming based on URL patterns

## Requirements

- [VS Code 1.30.1+](https://code.visualstudio.com/)
- [Node.js 10+](https://nodejs.org)
  > NOTE: Please make sure that `Node` is in your `PATH` environment variable. You can also use the setting `leetcode.nodePath` to specify the location of your `Node.js` executable.

## ❗️ Login Recommendation ❗️

> **Recommended**: Use Cookie login for the best experience with this enhanced extension.

### Why Cookie Login is Recommended

- **Web Authorization** may redirect to the original LeetCode extension
- **Cookie Login** provides direct access to this enhanced version
- **More Reliable** for the enhanced features (split view, problem lists)

### How to Use Cookie Login

1. **Get your LeetCode Cookie**:
   - Open LeetCode website in your browser
   - Press F12 to open Developer Tools
   - Go to Application/Storage → Cookies
   - Copy the value of `LEETCODE_SESSION` cookie

2. **Login with Cookie**:
   - Click `Sign In` in the LeetCode Explorer
   - Select `LeetCode Cookie` (marked as Recommended)
   - Paste your cookie value
   - You're logged in!

> **Note**: If you're using `leetcode.cn`, the process is the same but use the Chinese LeetCode website.

## Features

### Sign In/Out

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/sign_in.png" alt="Sign in" />
</p>

- Simply click `Sign in to LeetCode` in the `LeetCode Explorer` will let you **sign in** with your LeetCode account.

- You can also use the following command to sign in/out:
  - **LeetCode: Sign in**
  - **LeetCode: Sign out**

---

### Switch Endpoint

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/endpoint.png" alt="Switch Endpoint" />
</p>

- By clicking the button ![btn_endpoint](https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/btn_endpoint.png) at the **explorer's navigation bar**, you can switch between different endpoints.

- The supported endpoints are:

  - **leetcode.com**
  - **leetcode.cn**

  > Note: The accounts of different endpoints are **not** shared. Please make sure you are using the right endpoint. The extension will use `leetcode.com` by default.

---

### Pick a Problem

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/pick_problem.png" alt="Pick a Problem" />
</p>

- Directly click on the problem or right click the problem in the `LeetCode Explorer` and select `Preview Problem` to see the problem description.
- Select `Show Problem` to directly open the file with the problem description.

  > Note：You can specify the path of the workspace folder to store the problem files by updating the setting `leetcode.workspaceFolder`. The default value is：**$HOME/.leetcode/**.

  > You can specify whether including the problem description in comments or not by updating the setting `leetcode.showCommentDescription`.

  > You can switch the default language by triggering the command: `LeetCode: Switch Default Language`.

---

### Editor Shortcuts

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/shortcuts.png" alt="Editor Shortcuts" />
</p>

- The extension supports 5 editor shortcuts (aka Code Lens):

  - `Submit`: Submit your answer to LeetCode.
  - `Test`: Test your answer with customized test cases.
  - `Star/Unstar`: Star or unstar the current problem.
  - `Solution`: Show the top voted solution for the current problem.
  - `Description`: Show the problem description page.

  > Note: You can customize the shortcuts using the setting: `leetcode.editor.shortcuts`. By default, only `Submit` and `Test` shortcuts are enabled.

---

### Search problems by Keywords

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/search.png" alt="Search problems by Keywords" />
</p>

- By clicking the button ![btn_search](https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/btn_search.png) at the **explorer's navigation bar**, you can search the problems by keywords.

---

### Manage Session

<p align="center">
  <img src="https://raw.githubusercontent.com/LeetCode-OpenSource/vscode-leetcode/master/docs/imgs/session.png" alt="Manage Session" />
</p>

- To manage your LeetCode sessions, just clicking the `LeetCode: ***` at the bottom of the status bar. You can **switch** between sessions or **create**, **delete** a session.

## Settings

| Setting Name                      | Description                                                                                                                                                                                                                                                   | Default Value      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **🆕 Enhanced Settings**          |                                                                                                                                                                                                                                                               |                    |
| `leetcode.enableSplitView`        | **NEW**: Enable split view mode - description on left, code editor on right                                                                                                                                                                                  | `true`             |
| **Original Settings**             |                                                                                                                                                                                                                                                               |                    |
| `leetcode.hideSolved`             | Specify to hide the solved problems or not                                                                                                                                                                                                                    | `false`            |
| `leetcode.defaultLanguage`        | Specify the default language used to solve the problem. Supported languages are: `bash`, `c`, `cpp`, `csharp`, `golang`, `java`, `javascript`, `kotlin`, `mysql`, `php`, `python`,`python3`,`ruby`,`rust`, `scala`, `swift`, `typescript`                     | `N/A`              |
| `leetcode.useWsl`                 | Specify whether to use WSL or not                                                                                                                                                                                                                             | `false`            |
| `leetcode.endpoint`               | Specify the active endpoint. Supported endpoints are: `leetcode`, `leetcode-cn`                                                                                                                                                                               | `leetcode`         |
| `leetcode.workspaceFolder`        | Specify the path of the workspace folder to store the problem files.                                                                                                                                                                                          | `""`               |
| `leetcode.filePath`               | Specify the relative path under the workspace and the file name to save the problem files. More details can be found [here](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/Customize-the-Relative-Folder-and-the-File-Name-of-the-Problem-File). |                    |
| `leetcode.enableStatusBar`        | Specify whether the LeetCode status bar will be shown or not.                                                                                                                                                                                                 | `true`             |
| `leetcode.editor.shortcuts`       | Specify the customized shortcuts in editors. Supported values are: `submit`, `test`, `star`, `solution` and `description`.                                                                                                                                    | `["submit, test"]` |
| `leetcode.enableSideMode`         | Specify whether `preview`, `solution` and `submission` tab should be grouped into the second editor column when solving a problem.                                                                                                                            | `true`             |
| `leetcode.nodePath`               | Specify the `Node.js` executable path. for example, C:\Program Files\nodejs\node.exe                                                                                                                                                                          | `node`             |
| `leetcode.showCommentDescription` | Specify whether to include the problem description in the comments                                                                                                                                                                                            | `false`            |
| `leetcode.useEndpointTranslation` | Use endpoint's translation (if available)                                                                                                                                                                                                                     | `true`             |
| `leetcode.colorizeProblems`       | Add difficulty badge and colorize problems files in explorer tree                                                                                                                                                                                             | `true`             |
| `leetcode.problems.sortStrategy`  | Specify sorting strategy for problems list                                                                                                                                                                                                                    | `None`             |
| `leetcode.allowReportData`        | Allow LeetCode to report anonymous usage data to improve the product. list                                                                                                                                                                                    | `true`             |

## 📁 File Structure

```
src/
├── commands/
│   ├── problemList.ts          # New: Problem list management commands
│   └── show.ts                 # Enhanced: Split view support
├── problemList/
│   └── problemListManager.ts   # New: Problem list data management
├── webview/
│   ├── leetCodePreviewProvider.ts    # Enhanced: Split view support
│   └── leetCodeSubmissionProvider.ts # Enhanced: Split view support
└── shared.ts                   # Enhanced: New interfaces and types
```

## 🆕 What's New in This Version

### Version 0.18.5
- ✅ **Split View Mode**: Description and code editor side-by-side layout
- ✅ **Problem List System**: Create, manage, and organize custom problem lists
- ✅ **Consistent View Behavior**: All LeetCode views respect split view setting
- ✅ **Enhanced User Experience**: Better layout and organization
- ✅ **New Commands**: Full problem list management commands
- ✅ **Configuration Options**: Customizable split view behavior
- ✅ **Documentation Updates**: Enhanced documentation with future development roadmap

## 🚀 Future Development Plan

### 📋 Problem Sets (题单) Feature - Coming Soon

We are actively developing a comprehensive **Problem Sets** feature that will revolutionize how you organize and tackle LeetCode problems:

#### 🎯 Planned Features

##### **1. Intelligent Problem Sets**
- **Auto-Generated Sets**: AI-powered problem set creation based on difficulty progression
- **Topic-Based Sets**: Curated problem sets for specific algorithms (DFS, BFS, DP, etc.)
- **Company-Specific Sets**: Problem sets tailored for specific tech companies
- **Interview Preparation**: Complete interview preparation tracks with realistic problem sequences

##### **2. Advanced Set Management**
- **Set Templates**: Pre-built templates for common learning paths
- **Custom Set Builder**: Drag-and-drop interface for creating personalized sets
- **Set Sharing**: Share your problem sets with the community
- **Import/Export**: Import sets from external sources or export for backup

##### **3. Progress Tracking & Analytics**
- **Set Progress**: Visual progress tracking for each problem set
- **Performance Metrics**: Detailed analytics on solving patterns and improvement
- **Weakness Identification**: AI analysis to identify knowledge gaps
- **Recommendation Engine**: Smart suggestions for next problems to solve

##### **4. Enhanced Learning Experience**
- **Adaptive Difficulty**: Dynamic difficulty adjustment based on performance
- **Spaced Repetition**: Intelligent review scheduling for better retention
- **Study Plans**: Structured learning paths with milestones and achievements
- **Gamification**: Points, badges, and leaderboards for motivation

##### **5. Integration Features**
- **Calendar Integration**: Schedule problem-solving sessions
- **Study Group Support**: Collaborative problem solving with friends
- **Mentor Mode**: Expert guidance and hints for complex problems
- **Mobile Sync**: Seamless synchronization across devices

#### 📅 Development Timeline

- **Phase 1 (Q1 2024)**: Core problem set creation and management
- **Phase 2 (Q2 2024)**: Progress tracking and analytics
- **Phase 3 (Q3 2024)**: AI-powered features and recommendations
- **Phase 4 (Q4 2024)**: Advanced learning features and community integration

#### 🤝 Contributing to Development

We welcome community contributions for the Problem Sets feature:

- **Feature Requests**: Share your ideas on our [GitHub Issues](https://github.com/KindofCrazy/vscode-leetcode/issues)
- **Beta Testing**: Join our beta program to test new features early
- **Code Contributions**: Help us build the future of LeetCode problem solving
- **Feedback**: Your input shapes our development priorities

> **Note**: The Problem Sets feature is our top priority for 2024. We're committed to delivering a world-class learning experience that goes beyond traditional problem lists.

## 🔄 Migration from Original Extension

1. **Backup your settings** (optional)
2. **Uninstall the original extension**
3. **Install this enhanced version**
4. **Your existing problems and settings will be preserved**

## 🤝 Contributing

This project is based on the original [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) extension.

### Original Features Preserved
- All original LeetCode functionality
- Sign in/out capabilities
- Problem browsing and solving
- Test and submit functionality
- All original settings and configurations

### New Contributions
- Split view layout system
- Problem list management
- Enhanced user interface
- Improved view consistency

## Want Help?

When you meet any problem, you can check out the [Troubleshooting](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/Troubleshooting) and [FAQ](https://github.com/LeetCode-OpenSource/vscode-leetcode/wiki/FAQ) first.

If your problem still cannot be addressed, feel free to reach us in the [Gitter Channel](https://gitter.im/vscode-leetcode/Lobby) or [file an issue](https://github.com/KindofCrazy/vscode-leetcode/issues/new/choose).

## Release Notes

Refer to [CHANGELOG](https://github.com/LeetCode-OpenSource/vscode-leetcode/blob/master/CHANGELOG.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Project**: Based on [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) by [@LeetCode-OpenSource](https://github.com/LeetCode-OpenSource)
- **Core CLI**: Built on [leetcode-cli](https://github.com/skygragon/leetcode-cli) by [@skygragon](https://github.com/skygragon)
- **Contributors**: Thanks to all contributors of the original project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/KindofCrazy/vscode-leetcode/issues)
- **Documentation**: [Wiki](https://github.com/KindofCrazy/vscode-leetcode/wiki)
- **Original Project**: [vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode)

---

**Note**: This is an enhanced fork of the original vscode-leetcode extension. All original functionality is preserved while adding new features for better user experience.
