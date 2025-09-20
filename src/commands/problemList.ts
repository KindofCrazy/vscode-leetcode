// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { problemListManager } from "../problemList/problemListManager";
import { leetCodeTreeDataProvider } from "../explorer/LeetCodeTreeDataProvider";
import { urlBasedProblemListService } from "../problemList/officialProblemListService";

export async function createProblemList(): Promise<void> {
    const name = await vscode.window.showInputBox({
        prompt: "Enter problem list name",
        placeHolder: "My Problem List",
    });

    if (!name) {
        return;
    }

    const description = await vscode.window.showInputBox({
        prompt: "Enter problem list description (optional)",
        placeHolder: "Description for this problem list",
    });

    try {
        await problemListManager.createProblemList(name, description);
        vscode.window.showInformationMessage(`Problem list "${name}" created successfully`);
        leetCodeTreeDataProvider.refresh();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create problem list: ${error}`);
    }
}

export async function deleteProblemList(): Promise<void> {
    const customLists = problemListManager.getCustomProblemLists();
    if (customLists.length === 0) {
        vscode.window.showInformationMessage("No custom problem lists to delete");
        return;
    }

    const items = customLists.map(list => ({
        label: list.name,
        description: list.description,
        value: list,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select problem list to delete",
    });

    if (!selected) {
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        `Are you sure you want to delete "${selected.label}"?`,
        "Yes",
        "No"
    );

    if (confirm === "Yes") {
        try {
            await problemListManager.deleteProblemList(selected.value.id);
            vscode.window.showInformationMessage(`Problem list "${selected.label}" deleted successfully`);
            leetCodeTreeDataProvider.refresh();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to delete problem list: ${error}`);
        }
    }
}

export async function addProblemToList(problemId: string): Promise<void> {
    const allLists = problemListManager.getAllProblemLists();
    if (allLists.length === 0) {
        vscode.window.showInformationMessage("No problem lists available");
        return;
    }

    const items = allLists.map(list => ({
        label: list.name,
        description: list.description || (list.isOfficial ? "Official" : "Custom"),
        value: list,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select problem list to add problem to",
    });

    if (!selected) {
        return;
    }

    try {
        await problemListManager.addProblemToList(selected.value.id, problemId);
        vscode.window.showInformationMessage(`Problem added to "${selected.label}"`);
        leetCodeTreeDataProvider.refresh();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to add problem to list: ${error}`);
    }
}

export async function removeProblemFromList(problemId: string): Promise<void> {
    const allLists = problemListManager.getAllProblemLists();
    const listsWithProblem = allLists.filter(list => list.problems.includes(problemId));

    if (listsWithProblem.length === 0) {
        vscode.window.showInformationMessage("Problem is not in any list");
        return;
    }

    const items = listsWithProblem.map(list => ({
        label: list.name,
        description: list.description || (list.isOfficial ? "Official" : "Custom"),
        value: list,
    }));

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select problem list to remove problem from",
    });

    if (!selected) {
        return;
    }

    try {
        await problemListManager.removeProblemFromList(selected.value.id, problemId);
        vscode.window.showInformationMessage(`Problem removed from "${selected.label}"`);
        leetCodeTreeDataProvider.refresh();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to remove problem from list: ${error}`);
    }
}

export async function syncPredefinedProblemLists(): Promise<void> {
    try {
        await urlBasedProblemListService.refreshPredefinedLists();
        leetCodeTreeDataProvider.refresh();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to sync predefined problem lists: ${error}`);
    }
}

export async function createProblemListFromURL(): Promise<void> {
    const url = await vscode.window.showInputBox({
        prompt: "Enter LeetCode study plan or problem list URL",
        placeHolder: "https://leetcode.cn/studyplan/top-100-liked/",
        validateInput: (value) => {
            if (!value) {
                return "URL is required";
            }
            if (!value.startsWith("https://leetcode.cn/") && !value.startsWith("https://leetcode.com/")) {
                return "Please enter a valid LeetCode URL";
            }
            return null;
        }
    });

    if (!url) {
        return;
    }

    const name = await vscode.window.showInputBox({
        prompt: "Enter problem list name (optional)",
        placeHolder: "Auto-generated from URL",
    });

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating problem list from URL...",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Fetching problems from URL..." });
            const problemList = await problemListManager.createProblemListFromURL(url, name);
            progress.report({ message: "Problem list created successfully!" });
            
            vscode.window.showInformationMessage(`Created problem list: ${problemList.name} with ${problemList.problems.length} problems`);
            leetCodeTreeDataProvider.refresh();
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create problem list from URL: ${error}`);
    }
}

export async function manageProblemLists(): Promise<void> {
    const items = [
        {
            label: "🌐 Create from URL",
            description: "Create problem list from LeetCode URL",
            command: "leetcode.createProblemListFromURL",
        },
        {
            label: "🔄 Sync Predefined Lists",
            description: "Sync LeetCode Hot 100, Top Interview 150, etc.",
            command: "leetcode.syncPredefinedProblemLists",
        },
        {
            label: "➕ Create New Problem List",
            description: "Create a custom problem list",
            command: "leetcode.createProblemList",
        },
        {
            label: "🗑️ Delete Problem List",
            description: "Delete a custom problem list",
            command: "leetcode.deleteProblemList",
        },
    ];

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Manage problem lists",
    });

    if (selected) {
        await vscode.commands.executeCommand(selected.command);
    }
}
