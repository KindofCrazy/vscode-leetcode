// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { leetCodeChannel } from "../leetCodeChannel";
import { DialogType, promptForOpenOutputChannel } from "../utils/uiUtils";
import { problemListManager } from "../problemList/problemListManager";
import { leetCodeTreeDataProvider } from "../explorer/LeetCodeTreeDataProvider";

/**
 * Create a new problem list - shows selection menu
 */
export async function createProblemList(): Promise<void> {
    try {
        const options = [
            {
                label: "$(add) Create Empty Problem List",
                description: "Create a new empty problem list manually",
                value: "create"
            },
            {
                label: "$(cloud-download) Import from URL",
                description: "Import problems from a LeetCode URL (study plan, problem list, etc.)",
                value: "import"
            }
        ];

        const selectedOption = await vscode.window.showQuickPick(options, {
            placeHolder: "Select how you want to create a problem list",
            matchOnDescription: true
        });

        if (!selectedOption) {
            return;
        }

        if (selectedOption.value === "create") {
            await createEmptyProblemList();
        } else if (selectedOption.value === "import") {
            await importProblemListFromUrl();
        }

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to create problem list: ${error}`, DialogType.error);
    }
}

/**
 * Create an empty problem list manually
 */
export async function createEmptyProblemList(): Promise<void> {
    try {
        const name = await vscode.window.showInputBox({
            prompt: "Enter the name for the new problem list",
            placeHolder: "e.g., Dynamic Programming, Top 100",
            validateInput: (value: string) => {
                if (!value.trim()) {
                    return "Problem list name cannot be empty";
                }
                return null;
            }
        });

        if (!name) {
            return;
        }

        const description = await vscode.window.showInputBox({
            prompt: "Enter a description for the problem list (optional)",
            placeHolder: "e.g., Collection of dynamic programming problems"
        });

        // Create the problem list
        const newList = await problemListManager.createProblemList(name, description || "");

        // Refresh the tree view to show the new problem list
        await leetCodeTreeDataProvider.refresh();

        vscode.window.showInformationMessage(`Problem list "${name}" created successfully!`);
        leetCodeChannel.appendLine(`Created problem list: ${name} (ID: ${newList.id})`);

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to create problem list: ${error}`, DialogType.error);
    }
}

/**
 * Manage existing problem lists
 */
export async function manageProblemLists(): Promise<void> {
    try {
        // TODO: Get actual problem lists
        const mockLists = [
            { label: "My Favorites", description: "5 problems", value: "favorites" },
            { label: "Dynamic Programming", description: "10 problems", value: "dp" },
            { label: "Top Interview Questions", description: "20 problems", value: "top-interview" }
        ];

        const selectedList = await vscode.window.showQuickPick(mockLists, {
            placeHolder: "Select a problem list to manage",
            matchOnDescription: true
        });

        if (!selectedList) {
            return;
        }

        const action = await vscode.window.showQuickPick([
            { label: "$(edit) Edit", value: "edit" },
            { label: "$(trash) Delete", value: "delete" },
            { label: "$(list-unordered) View Problems", value: "view" },
            { label: "$(export) Export", value: "export" }
        ], {
            placeHolder: `Select an action for "${selectedList.label}"`
        });

        if (!action) {
            return;
        }

        // TODO: Implement actual actions
        if (action.value === "delete") {
            const confirmDelete = await vscode.window.showWarningMessage(
                `Are you sure you want to delete "${selectedList.label}"?`,
                { modal: true },
                "Delete"
            );

            if (confirmDelete === "Delete") {
                // TODO: Implement delete logic
                // await problemListManager.deleteProblemList(selectedList.value);
                // await leetCodeTreeDataProvider.refresh();
                vscode.window.showInformationMessage(`"${selectedList.label}" will be deleted`);
            }
        } else {
            vscode.window.showInformationMessage(`Action "${action.label}" selected for "${selectedList.label}"`);
        }

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to manage problem lists: ${error}`, DialogType.error);
    }
}

/**
 * Add current problem to a problem list
 */
export async function addToProblemList(): Promise<void> {
    try {
        // TODO: Get current problem from active editor
        const currentProblem = "Two Sum"; // Mock data

        // TODO: Get actual problem lists
        const mockLists = [
            { label: "My Favorites", value: "favorites" },
            { label: "Dynamic Programming", value: "dp" },
            { label: "Create New List...", value: "_new" }
        ];

        const selectedList = await vscode.window.showQuickPick(mockLists, {
            placeHolder: `Add "${currentProblem}" to which list?`
        });

        if (!selectedList) {
            return;
        }

        if (selectedList.value === "_new") {
            await createProblemList();
            return;
        }

        // TODO: Implement actual add logic
        vscode.window.showInformationMessage(`"${currentProblem}" added to "${selectedList.label}"`);

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to add problem to list: ${error}`, DialogType.error);
    }
}

/**
 * Remove current problem from a problem list
 */
export async function removeFromProblemList(): Promise<void> {
    try {
        // TODO: Get current problem from active editor
        const currentProblem = "Two Sum"; // Mock data

        // TODO: Get problem lists containing this problem
        const mockLists = [
            { label: "My Favorites", value: "favorites" },
            { label: "Dynamic Programming", value: "dp" }
        ];

        const selectedList = await vscode.window.showQuickPick(mockLists, {
            placeHolder: `Remove "${currentProblem}" from which list?`
        });

        if (!selectedList) {
            return;
        }

        // TODO: Implement actual remove logic
        vscode.window.showInformationMessage(`"${currentProblem}" removed from "${selectedList.label}"`);

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to remove problem from list: ${error}`, DialogType.error);
    }
}

/**
 * Import problem list from URL
 */
export async function importProblemListFromUrl(): Promise<void> {
    try {
        const url = await vscode.window.showInputBox({
            prompt: "Enter a LeetCode URL to import problems from",
            placeHolder: "e.g., https://leetcode.com/studyplan/top-100-liked/",
            validateInput: (value: string) => {
                if (!value.trim()) {
                    return "URL cannot be empty";
                }
                // Basic URL validation
                if (!value.match(/^https?:\/\/(www\.)?(leetcode\.com|leetcode\.cn)/)) {
                    return "Please enter a valid LeetCode URL";
                }
                return null;
            }
        });

        if (!url) {
            return;
        }

        let newList: any = null;

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Importing problem list from URL",
            cancellable: true
        }, async (progress, token) => {
            progress.report({ increment: 0, message: "Analyzing URL..." });

            // Simulate progress
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (token.isCancellationRequested) {
                return;
            }

            progress.report({ increment: 50, message: "Creating problem list..." });

            // Create problem list from URL
            newList = await problemListManager.importFromUrl(url);

            progress.report({ increment: 100, message: "Complete!" });
        });

        if (newList) {
            // Refresh the tree view to show the new problem list
            await leetCodeTreeDataProvider.refresh();

            vscode.window.showInformationMessage(`Problem list "${newList.name}" imported successfully!`);
            leetCodeChannel.appendLine(`Imported problem list: ${newList.name} (ID: ${newList.id}) from ${url}`);
        }

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to import problem list from URL: ${error}`, DialogType.error);
    }
}
