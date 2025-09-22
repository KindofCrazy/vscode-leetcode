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
                // Check for duplicate names
                const existingLists = problemListManager.getAllProblemLists();
                if (existingLists.some(list => list.name.toLowerCase() === value.trim().toLowerCase())) {
                    return `A problem list with name "${value.trim()}" already exists`;
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

        // Show progress while creating
        const newList = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating problem list",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: "Creating problem list..." });

            // Create the problem list
            const list = await problemListManager.createProblemList(name, description || "");

                    progress.report({ increment: 50, message: "Refreshing tree view..." });

                    // Refresh only the Problem Lists section to maintain other expanded states
                    leetCodeTreeDataProvider.refreshProblemLists();

                    progress.report({ increment: 100, message: "Complete!" });

            return list;
        });

        vscode.window.showInformationMessage(`Problem list "${newList.name}" created successfully!`);
        leetCodeChannel.appendLine(`Created problem list: ${newList.name} (ID: ${newList.id})`);

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to create problem list: ${error}`, DialogType.error);
    }
}

/**
 * Manage existing problem lists
 */
export async function manageProblemLists(): Promise<void> {
    try {
        // Get actual problem lists
        const problemLists = problemListManager.getAllProblemLists();

        if (problemLists.length === 0) {
            const createNew = await vscode.window.showInformationMessage(
                "No problem lists found. Would you like to create one?",
                "Create New List"
            );

            if (createNew === "Create New List") {
                await createProblemList();
            }
            return;
        }

        const listOptions = problemLists.map(list => ({
            label: list.name,
            description: `${list.problems.length} problems${list.description ? ' - ' + list.description : ''}`,
            value: list.id
        }));

        const selectedList = await vscode.window.showQuickPick(listOptions, {
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
                // Show progress while deleting
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Deleting problem list",
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0, message: "Deleting problem list..." });

                    // Delete the problem list
                    await problemListManager.deleteProblemList(selectedList.value);

                    progress.report({ increment: 50, message: "Refreshing tree view..." });

                    // Refresh only the Problem Lists section to maintain other expanded states
                    leetCodeTreeDataProvider.refreshProblemLists();

                    progress.report({ increment: 100, message: "Complete!" });
                });

                vscode.window.showInformationMessage(`"${selectedList.label}" deleted successfully!`);
                leetCodeChannel.appendLine(`Deleted problem list: ${selectedList.label} (ID: ${selectedList.value})`);
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
export async function addToProblemList(node?: any): Promise<void> {
    try {
        // Get current problem from the context (node parameter) or active editor
        let currentProblem = "Unknown Problem";
        let problemData: any;

        if (node && node.name) {
            // If called from context menu with a node
            currentProblem = node.name.replace(/^\[\d+\]\s*/, ''); // Remove [123] prefix if exists
            problemData = {
                id: node.id,
                title: currentProblem,
                titleSlug: currentProblem.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                difficulty: node.difficulty || "Unknown",
                frontendId: node.id,
                questionId: node.id
            };
        } else {
            // TODO: Get from active editor or show input dialog
            const userInput = await vscode.window.showInputBox({
                prompt: "Enter the problem name to add to list",
                placeHolder: "e.g., 两数之和, Three Sum"
            });

            if (!userInput) {
                return;
            }

            currentProblem = userInput;
            problemData = {
                id: Date.now().toString(),
                title: currentProblem,
                titleSlug: currentProblem.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
                difficulty: "Unknown",
                frontendId: Date.now().toString(),
                questionId: Date.now().toString()
            };
        }

        // Get actual problem lists
        const problemLists = problemListManager.getAllProblemLists();

        console.log(`addToProblemList: Found ${problemLists.length} problem lists`);
        problemLists.forEach(list => {
            console.log(`  - ${list.name} (${list.problems.length} problems)`);
        });

        if (problemLists.length === 0) {
            const createNew = await vscode.window.showInformationMessage(
                "No problem lists found. Would you like to create one?",
                "Create New List"
            );

            if (createNew === "Create New List") {
                await createProblemList();
            }
            return;
        }

        // Build the list options
        const listOptions = problemLists.map(list => ({
            label: `${list.name} (${list.problems.length} problems)`,
            description: list.description || "No description",
            value: list.id
        }));

        // Add "Create New List..." option at the end
        listOptions.push({
            label: "$(plus) Create New List...",
            description: "Create a new problem list",
            value: "_new"
        });

        const selectedList = await vscode.window.showQuickPick(listOptions, {
            placeHolder: `Add "${currentProblem}" to which list?`,
            matchOnDescription: true
        });

        if (!selectedList) {
            return;
        }

        if (selectedList.value === "_new") {
            await createProblemList();
            return;
        }

        // Add the problem to the selected list
        const targetList = problemListManager.getProblemList(selectedList.value);
        if (targetList) {
            try {
                // Show progress while adding
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Adding problem to list",
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0, message: "Adding problem..." });

                    // Use the problem data we prepared earlier
                    await problemListManager.addProblemToList(selectedList.value, problemData);

                    progress.report({ increment: 50, message: "Refreshing tree view..." });

                    // Refresh only the Problem Lists section to maintain other expanded states
                    leetCodeTreeDataProvider.refreshProblemLists();

                    progress.report({ increment: 100, message: "Complete!" });
                });

                vscode.window.showInformationMessage(`"${currentProblem}" added to "${targetList.name}" successfully!`);
                leetCodeChannel.appendLine(`Added "${currentProblem}" to problem list: ${targetList.name} (ID: ${targetList.id})`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to add problem to list: ${error}`);
                leetCodeChannel.appendLine(`Error adding "${currentProblem}" to problem list: ${error}`);
            }
        }

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to add problem to list: ${error}`, DialogType.error);
    }
}

/**
 * Remove current problem from a problem list
 */
export async function removeFromProblemList(node?: any): Promise<void> {
    try {
        // Get current problem from the context (node parameter) or active editor
        let currentProblem = "Unknown Problem";
        let problemId = "";

        if (node && node.name) {
            // If called from context menu with a node
            currentProblem = node.name.replace(/^\[\d+\]\s*/, ''); // Remove [123] prefix if exists
            problemId = node.id;
        } else {
            // TODO: Get from active editor or show input dialog
            const userInput = await vscode.window.showInputBox({
                prompt: "Enter the problem name to remove from lists",
                placeHolder: "e.g., 两数之和, Three Sum"
            });

            if (!userInput) {
                return;
            }

            currentProblem = userInput;
            // For user input, we need to find the problem in lists by title
        }

        // Get problem lists containing this problem
        const allLists = problemListManager.getAllProblemLists();
        const containingLists = allLists.filter(list => {
            if (problemId) {
                // Search by ID if we have it
                return list.problems.some(p => p.id === problemId || p.frontendId === problemId);
            } else {
                // Search by title if we only have the name
                return list.problems.some(p => p.title === currentProblem);
            }
        });

        console.log(`removeFromProblemList: Found ${containingLists.length} lists containing "${currentProblem}"`);

        if (containingLists.length === 0) {
            vscode.window.showInformationMessage(`"${currentProblem}" is not in any problem lists.`);
            return;
        }

        // Build the list options
        const listOptions = containingLists.map(list => ({
            label: `${list.name} (${list.problems.length} problems)`,
            description: list.description || "No description",
            value: list.id
        }));

        const selectedList = await vscode.window.showQuickPick(listOptions, {
            placeHolder: `Remove "${currentProblem}" from which list?`,
            matchOnDescription: true
        });

        if (!selectedList) {
            return;
        }

        // Remove the problem from the selected list
        const targetList = problemListManager.getProblemList(selectedList.value);
        if (targetList) {
            try {
                // Show progress while removing
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Removing problem from list",
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0, message: "Removing problem..." });

                    // Find the problem to remove
                    let problemToRemove;
                    if (problemId) {
                        problemToRemove = targetList.problems.find(p => p.id === problemId || p.frontendId === problemId);
                    } else {
                        problemToRemove = targetList.problems.find(p => p.title === currentProblem);
                    }

                    if (problemToRemove) {
                        await problemListManager.removeProblemFromList(selectedList.value, problemToRemove.id);
                    } else {
                        throw new Error(`Problem not found in the list`);
                    }

                    progress.report({ increment: 50, message: "Refreshing tree view..." });

                    // Refresh only the Problem Lists section to maintain other expanded states
                    leetCodeTreeDataProvider.refreshProblemLists();

                    progress.report({ increment: 100, message: "Complete!" });
                });

                vscode.window.showInformationMessage(`"${currentProblem}" removed from "${targetList.name}" successfully!`);
                leetCodeChannel.appendLine(`Removed "${currentProblem}" from problem list: ${targetList.name} (ID: ${targetList.id})`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to remove problem from list: ${error}`);
                leetCodeChannel.appendLine(`Error removing "${currentProblem}" from problem list: ${error}`);
            }
        }

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
            // Refresh only the Problem Lists section to maintain other expanded states
            leetCodeTreeDataProvider.refreshProblemLists();

            vscode.window.showInformationMessage(`Problem list "${newList.name}" imported successfully!`);
            leetCodeChannel.appendLine(`Imported problem list: ${newList.name} (ID: ${newList.id}) from ${url}`);
        }

    } catch (error) {
        await promptForOpenOutputChannel(`Failed to import problem list from URL: ${error}`, DialogType.error);
    }
}
