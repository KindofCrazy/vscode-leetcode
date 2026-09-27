# LeetCode Enhanced

An enhanced fork of [LeetCode-OpenSource/vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) for solving LeetCode problems inside VS Code.

[简体中文](docs/README_zh-CN.md)

## Added Features

- **Split view**: opens the problem description on the left and the code editor on the right.
- **Problem lists**: creates and manages custom lists, including imports from LeetCode study-plan and problem-list URLs.
- **Clear shortcut**: restores the official starter code while keeping the problem metadata and file structure. The change can be undone with `Ctrl+Z`.
- **Consistent panels**: keeps descriptions, test results, and submission results in the configured editor column.

The original extension features, including sign-in, problem browsing, testing, submission, favorites, and endpoint switching, remain available.

## Installation

### VS Code Marketplace

1. Open the Extensions view in VS Code.
2. Search for **LeetCode Enhanced**.
3. Install the extension published by **keyang**.

Extension ID: `keyang.vscode-leetcode-enhanced`

### GitHub Release

1. Download the latest `.vsix` from [GitHub Releases](https://github.com/KindofCrazy/vscode-leetcode/releases/latest).
2. In VS Code, open the Extensions view, select `...`, and choose **Install from VSIX...**.

You can also install it from the command line:

```bash
code --install-extension vscode-leetcode-enhanced-0.18.6.vsix --force
```

## Quick Start

1. Install [Node.js](https://nodejs.org/) and ensure `node` is available in `PATH`.
2. Open the LeetCode view and sign in. Cookie login is recommended.
3. Select a problem and choose **Show Problem**.
4. Use the editor shortcuts to test, submit, view the description, or clear your answer.

Useful settings:

```json
{
  "leetcode.enableSplitView": true,
  "leetcode.editor.shortcuts": ["submit", "test", "description", "clear"]
}
```

If `leetcode.editor.shortcuts` is already customized, add `"clear"` to enable the Clear shortcut.

## Requirements

- VS Code 1.57.0 or later
- Node.js 10 or later

## License

[MIT](LICENSE). This project preserves the licenses and acknowledgements of the original extension and its dependencies.
