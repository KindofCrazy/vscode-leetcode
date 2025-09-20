// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { problemListManager } from "../problemList/problemListManager";
import { leetCodeTreeDataProvider } from "../explorer/LeetCodeTreeDataProvider";
import { officialProblemListService } from "../problemList/officialProblemListService";

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

export async function syncOfficialProblemLists(): Promise<void> {
    try {
        await officialProblemListService.refreshOfficialLists();
        leetCodeTreeDataProvider.refresh();
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to sync official problem lists: ${error}`);
    }
}

export async function manageProblemLists(): Promise<void> {
    const items = [
        {
            label: "🔄 Sync Official Lists",
            description: "Sync LeetCode Hot 100, Top Interview 150, etc.",
            command: "leetcode.syncOfficialProblemLists",
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
