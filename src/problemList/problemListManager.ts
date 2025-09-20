// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { IProblemList } from "../shared";
import { officialProblemListService } from "./officialProblemListService";

class ProblemListManager {
    private problemLists: Map<string, IProblemList> = new Map();
    private storagePath: string;

    constructor() {
        // Use global storage path instead of workspace path
        const globalStoragePath = path.join(os.homedir(), ".vscode", "leetcode-enhanced", "problemLists.json");
        this.storagePath = globalStoragePath;
    }

    public async initialize(): Promise<void> {
        try {
            console.log("Initializing problem list manager...");
            await this.loadProblemLists();
            console.log("Loaded problem lists:", this.problemLists.size);
            await this.syncOfficialProblemLists();
            console.log("Synced official problem lists:", this.problemLists.size);
            console.log("Problem list manager initialized successfully");
        } catch (error) {
            console.error("Failed to initialize problem list manager:", error);
            throw error;
        }
    }

    public async createProblemList(name: string, description?: string): Promise<IProblemList> {
        const id = `custom_${Date.now()}`;
        const problemList: IProblemList = {
            id,
            name,
            description,
            isOfficial: false,
            problems: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.problemLists.set(id, problemList);
        await this.saveProblemLists();
        return problemList;
    }

    public async updateProblemList(id: string, updates: Partial<IProblemList>): Promise<void> {
        const problemList = this.problemLists.get(id);
        if (!problemList) {
            throw new Error(`Problem list with id ${id} not found`);
        }

        const updatedList = {
            ...problemList,
            ...updates,
            updatedAt: new Date(),
        };

        this.problemLists.set(id, updatedList);
        await this.saveProblemLists();
    }

    public async deleteProblemList(id: string): Promise<void> {
        if (this.problemLists.get(id)?.isOfficial) {
            throw new Error("Cannot delete official problem lists");
        }
        this.problemLists.delete(id);
        await this.saveProblemLists();
    }

    public async addProblemToList(listId: string, problemId: string): Promise<void> {
        const problemList = this.problemLists.get(listId);
        if (!problemList) {
            throw new Error(`Problem list with id ${listId} not found`);
        }

        if (!problemList.problems.includes(problemId)) {
            problemList.problems.push(problemId);
            problemList.updatedAt = new Date();
            this.problemLists.set(listId, problemList);
            await this.saveProblemLists();
        }
    }

    public async removeProblemFromList(listId: string, problemId: string): Promise<void> {
        const problemList = this.problemLists.get(listId);
        if (!problemList) {
            throw new Error(`Problem list with id ${listId} not found`);
        }

        const index = problemList.problems.indexOf(problemId);
        if (index > -1) {
            problemList.problems.splice(index, 1);
            problemList.updatedAt = new Date();
            this.problemLists.set(listId, problemList);
            await this.saveProblemLists();
        }
    }

    public getProblemList(id: string): IProblemList | undefined {
        return this.problemLists.get(id);
    }

    public getAllProblemLists(): IProblemList[] {
        return Array.from(this.problemLists.values());
    }

    public getCustomProblemLists(): IProblemList[] {
        return Array.from(this.problemLists.values()).filter(list => !list.isOfficial);
    }

    public getOfficialProblemLists(): IProblemList[] {
        return Array.from(this.problemLists.values()).filter(list => list.isOfficial);
    }

    private async loadProblemLists(): Promise<void> {
        try {
            if (await fs.pathExists(this.storagePath)) {
                const data = await fs.readFile(this.storagePath, "utf8");
                const problemLists: IProblemList[] = JSON.parse(data);
                
                for (const list of problemLists) {
                    // Convert date strings back to Date objects
                    list.createdAt = new Date(list.createdAt);
                    list.updatedAt = new Date(list.updatedAt);
                    this.problemLists.set(list.id, list);
                }
            }
        } catch (error) {
            console.error("Failed to load problem lists:", error);
        }
    }

    private async saveProblemLists(): Promise<void> {
        try {
            await fs.ensureDir(path.dirname(this.storagePath));
            const data = JSON.stringify(Array.from(this.problemLists.values()), null, 2);
            await fs.writeFile(this.storagePath, data, "utf8");
        } catch (error) {
            console.error("Failed to save problem lists:", error);
        }
    }

    private async syncOfficialProblemLists(): Promise<void> {
        try {
            console.log("Syncing official problem lists...");
            const officialLists = await officialProblemListService.syncOfficialProblemLists();
            console.log("Got official lists:", officialLists.length);
            
            for (const list of officialLists) {
                // Always update official lists to get latest data
                this.problemLists.set(list.id, list);
                console.log("Added list:", list.name, "with", list.problems.length, "problems");
            }
            
            await this.saveProblemLists();
            console.log("Saved problem lists to:", this.storagePath);
        } catch (error) {
            console.error("Failed to sync official problem lists:", error);
        }
    }

    public async refreshOfficialLists(): Promise<void> {
        await this.syncOfficialProblemLists();
    }
}

export const problemListManager: ProblemListManager = new ProblemListManager();
