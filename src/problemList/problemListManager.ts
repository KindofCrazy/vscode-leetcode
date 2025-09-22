// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { ProblemList, Problem } from "../shared";

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
            return;
        }

        const stored = this.context.globalState.get<any[]>(this.STORAGE_KEY, []);
        this.problemLists.clear();

        stored.forEach(list => {
            this.problemLists.set(list.id, list);
        });
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
        const id = this.generateId();
        const now = new Date().toISOString();

        const newList: ProblemList = {
            id,
            name,
            description,
            url,
            problems: [],
            createdAt: now,
            updatedAt: now
        };

        this.problemLists.set(id, newList);
        await this.saveProblemLists();

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
        if (!this.problemLists.has(id)) {
            throw new Error(`Problem list with id ${id} not found`);
        }

        this.problemLists.delete(id);
        await this.saveProblemLists();
    }

    /**
     * Add a problem to a list
     */
    public async addProblemToList(listId: string, problem: Problem): Promise<void> {
        const list = this.problemLists.get(listId);
        if (!list) {
            throw new Error(`Problem list with id ${listId} not found`);
        }

        // Check if problem already exists
        if (list.problems.some(p => p.id === problem.id)) {
            throw new Error(`Problem ${problem.title} already exists in the list`);
        }

        list.problems.push(problem);
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

        list.problems.splice(index, 1);
        list.updatedAt = new Date().toISOString();

        await this.saveProblemLists();
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
     * Import problems from URL (placeholder for now)
     */
    public async importFromUrl(url: string): Promise<ProblemList> {
        // TODO: Implement actual URL parsing and problem fetching
        // For now, create a mock list
        const name = this.extractNameFromUrl(url);
        const list = await this.createProblemList(name, `Imported from ${url}`, url);

        // Mock: Add some sample problems
        const mockProblems: Problem[] = [
            {
                id: "1",
                title: "Two Sum",
                titleSlug: "two-sum",
                difficulty: "Easy",
                frontendId: "1",
                questionId: "1"
            }
        ];

        list.problems = mockProblems;
        await this.saveProblemLists();

        return list;
    }

    /**
     * Generate a unique ID for a problem list
     */
    private generateId(): string {
        return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Extract a meaningful name from URL
     */
    private extractNameFromUrl(url: string): string {
        // Try to extract name from URL patterns
        const patterns = [
            /studyplan\/([^\/]+)/,
            /problem-list\/([^\/]+)/,
            /tag\/([^\/]+)/,
            /company\/([^\/]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1].replace(/-/g, ' ').replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
        }

        return "Imported Problem List";
    }
}

// Export singleton instance
export const problemListManager = ProblemListManager.getInstance();
