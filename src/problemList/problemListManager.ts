// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { ProblemList, Problem } from "../shared";
import { fetchProblemsFromUrl, isValidLeetCodeUrl } from "../utils/urlImportUtils";

/**
 * Problem List Manager - handles all problem list operations
 */
export class ProblemListManager {
    private static instance: ProblemListManager;
    private context: vscode.ExtensionContext | undefined;

    private readonly STORAGE_KEY = "leetcode.problemLists";
    private problemLists: Map<string, ProblemList> = new Map();

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): ProblemListManager {
        if (!ProblemListManager.instance) {
            ProblemListManager.instance = new ProblemListManager();
        }
        return ProblemListManager.instance;
    }

    /**
     * Initialize the problem list manager with extension context
     */
    public initialize(context: vscode.ExtensionContext): void {
        this.context = context;
        this.loadProblemLists();
    }

    /**
     * Load problem lists from storage
     */
    private loadProblemLists(): void {
        if (!this.context) {
            console.log("ProblemListManager: No context available for loading");
            return;
        }

        const stored = this.context.globalState.get<any[]>(this.STORAGE_KEY, []);
        this.problemLists.clear();

        stored.forEach(list => {
            this.problemLists.set(list.id, list);
        });

        console.log(`ProblemListManager: Loaded ${stored.length} problem lists from storage`);
    }

    /**
     * Save problem lists to storage
     */
    private async saveProblemLists(): Promise<void> {
        if (!this.context) {
            return;
        }

        const lists = Array.from(this.problemLists.values());
        await this.context.globalState.update(this.STORAGE_KEY, lists);
    }

    /**
     * Create a new problem list
     */
    public async createProblemList(name: string, description: string = "", url: string = ""): Promise<ProblemList> {
        // Validate input
        if (!name || !name.trim()) {
            throw new Error("Problem list name cannot be empty");
        }

        // Check for duplicate names
        const existingLists = this.getAllProblemLists();
        if (existingLists.some(list => list.name.toLowerCase() === name.trim().toLowerCase())) {
            throw new Error(`A problem list with name "${name.trim()}" already exists`);
        }

        const id = this.generateId();
        const now = new Date().toISOString();

        const newList: ProblemList = {
            id,
            name: name.trim(),
            description: description.trim(),
            url,
            problems: [],
            createdAt: now,
            updatedAt: now
        };

        this.problemLists.set(id, newList);
        await this.saveProblemLists();

        console.log(`ProblemListManager: Created new problem list "${newList.name}" with ID: ${newList.id}`);

        return newList;
    }

    /**
     * Get all problem lists
     */
    public getAllProblemLists(): ProblemList[] {
        return Array.from(this.problemLists.values());
    }

    /**
     * Get a problem list by ID
     */
    public getProblemList(id: string): ProblemList | undefined {
        return this.problemLists.get(id);
    }

    /**
     * Update a problem list
     */
    public async updateProblemList(id: string, updates: Partial<ProblemList>): Promise<void> {
        const list = this.problemLists.get(id);
        if (!list) {
            throw new Error(`Problem list with id ${id} not found`);
        }

        Object.assign(list, updates, {
            updatedAt: new Date().toISOString()
        });

        await this.saveProblemLists();
    }

    /**
     * Delete a problem list
     */
    public async deleteProblemList(id: string): Promise<void> {
        const list = this.problemLists.get(id);
        if (!list) {
            throw new Error(`Problem list with id ${id} not found`);
        }

        const listName = list.name;
        this.problemLists.delete(id);
        await this.saveProblemLists();

        console.log(`ProblemListManager: Deleted problem list "${listName}" with ID: ${id}`);
    }

    /**
     * Add a problem to a list
     */
    public async addProblemToList(listId: string, problem: Problem, categoryId?: string): Promise<void> {
        const list = this.problemLists.get(listId);
        if (!list) {
            throw new Error(`Problem list with id ${listId} not found`);
        }

        // Check if problem already exists in the main list
        if (list.problems.some(p => p.id === problem.id)) {
            throw new Error(`Problem ${problem.title} already exists in the list`);
        }

        // If no category specified, just add to main list (backward compatibility)
        if (!categoryId || !list.categories || list.categories.length === 0) {
            list.problems.push(problem);
            console.log(`ProblemListManager: Added problem "${problem.title}" to list "${list.name}" (main list). List now has ${list.problems.length} problems.`);
        } else {
            // Find the specified category
            const category = list.categories.find(cat => cat.id === categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} not found in list ${list.name}`);
            }

            // Check if problem already exists in this category
            if (category.problems.some(p => p.id === problem.id)) {
                throw new Error(`Problem ${problem.title} already exists in category ${category.name}`);
            }

            // Add to both main list and category
            list.problems.push(problem);
            category.problems.push(problem);

            console.log(`ProblemListManager: Added problem "${problem.title}" to list "${list.name}" (category: ${category.name}). Category now has ${category.problems.length} problems.`);
        }

        list.updatedAt = new Date().toISOString();
        await this.saveProblemLists();
    }

    /**
     * Remove a problem from a list
     */
    public async removeProblemFromList(listId: string, problemId: string): Promise<void> {
        const list = this.problemLists.get(listId);
        if (!list) {
            throw new Error(`Problem list with id ${listId} not found`);
        }

        const index = list.problems.findIndex(p => p.id === problemId);
        if (index === -1) {
            throw new Error(`Problem with id ${problemId} not found in the list`);
        }

        const removedProblem = list.problems[index];
        list.problems.splice(index, 1);

        // Also remove from all categories that contain this problem
        if (list.categories && list.categories.length > 0) {
            for (const category of list.categories) {
                const categoryIndex = category.problems.findIndex(p => p.id === problemId);
                if (categoryIndex !== -1) {
                    category.problems.splice(categoryIndex, 1);
                    console.log(`ProblemListManager: Also removed problem "${removedProblem.title}" from category "${category.name}". Category now has ${category.problems.length} problems.`);
                }
            }
        }

        list.updatedAt = new Date().toISOString();
        await this.saveProblemLists();

        console.log(`ProblemListManager: Removed problem "${removedProblem.title}" from list "${list.name}". List now has ${list.problems.length} problems.`);
    }

    /**
     * Get lists containing a specific problem
     */
    public getListsContainingProblem(problemId: string): ProblemList[] {
        return Array.from(this.problemLists.values()).filter(
            list => list.problems.some(p => p.id === problemId)
        );
    }

    /**
     * Import problems from URL using LeetCode GraphQL API
     */
    public async importFromUrl(url: string, customName?: string): Promise<ProblemList> {
        // Validate URL
        if (!isValidLeetCodeUrl(url)) {
            throw new Error("Invalid LeetCode URL. Please provide a valid study plan, problem list, or tag URL.");
        }

        // Fetch problems from the URL
        const { name: urlName, problems, categories } = await fetchProblemsFromUrl(url);

        if (!problems || problems.length === 0) {
            throw new Error("No problems found from the provided URL.");
        }

        // Use custom name if provided, otherwise use the name from URL
        const finalName = customName && customName.trim() ? customName.trim() : urlName;

        // Create the problem list
        const list = await this.createProblemList(finalName, `Imported from ${url}`, url);

        // Add all fetched problems to the list
        list.problems = problems;

        // If categories are available, add them to the list
        if (categories && categories.length > 0) {
            list.categories = categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                problems: cat.problems || []
            }));
            console.log(`ProblemListManager: Added ${categories.length} categories to the problem list`);
            console.log(`ProblemListManager: Categories: ${categories.map(cat => cat.name).join(', ')}`);
            console.log(`ProblemListManager: Total problems: ${problems.length}, Categories problems: ${categories.reduce((sum, cat) => sum + (cat.problems?.length || 0), 0)}`);
        } else {
            console.log(`ProblemListManager: No categories provided, using flat problem list with ${problems.length} problems`);
        }

        list.updatedAt = new Date().toISOString();

        // Save the updated list
        await this.saveProblemLists();

        // Verify the saved data
        const savedList = this.getProblemList(list.id);
        if (savedList && savedList.categories && savedList.categories.length > 0) {
            console.log(`ProblemListManager: Verified saved data - list: ${savedList.name}, categories: ${savedList.categories.map(cat => cat.name).join(', ')}`);
        } else {
            console.log(`ProblemListManager: Verified saved data - list: ${savedList?.name}, no categories found`);
        }

        console.log(`ProblemListManager: Successfully imported ${problems.length} problems from URL: ${url}`);

        return list;
    }

    /**
     * Generate a unique ID for a problem list
     */
    private generateId(): string {
        return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // (removed unused helper methods)
}

// Export singleton instance
export const problemListManager = ProblemListManager.getInstance();
