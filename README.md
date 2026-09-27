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

> [!WARNING]
> The VS Code Marketplace currently provides an older version that does **not** include the `Clear` shortcut. Use one of the following recommended methods to install the latest version.

### Recommended: GitHub Release

1. Download the latest `.vsix` from [GitHub Releases](https://github.com/KindofCrazy/vscode-leetcode/releases/latest).
2. In VS Code, open the Extensions view, select `...`, and choose **Install from VSIX...**.

You can also install it from the command line:

```bash
code --install-extension vscode-leetcode-enhanced-0.18.6.vsix --force
```

### Recommended: Build from Source

```bash
git clone https://github.com/KindofCrazy/vscode-leetcode.git
cd vscode-leetcode
npm ci
npx @vscode/vsce package
code --install-extension vscode-leetcode-enhanced-0.18.6.vsix --force
```

### VS Code Marketplace (Older Version)

Search for **LeetCode Enhanced**, published by **keyang** (`keyang.vscode-leetcode-enhanced`). This version does not currently contain the `Clear` feature.

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
