// Test script to verify problem list manager initialization
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

console.log('Testing problem list manager initialization...');

// Simulate the problem list manager
class ProblemListManager {
    constructor() {
        this.storagePath = path.join(os.homedir(), ".vscode", "leetcode-enhanced", "problemLists.json");
        this.problemLists = new Map();
        console.log('Storage path:', this.storagePath);
    }

    async loadProblemLists() {
        try {
            console.log('Loading from:', this.storagePath);
            if (await fs.pathExists(this.storagePath)) {
                const data = await fs.readFile(this.storagePath, "utf8");
                const problemLists = JSON.parse(data);
                console.log('Loaded data:', problemLists.length, 'lists');
                
                for (const list of problemLists) {
                    list.createdAt = new Date(list.createdAt);
                    list.updatedAt = new Date(list.updatedAt);
                    this.problemLists.set(list.id, list);
                    console.log('Added list:', list.name, 'with', list.problems.length, 'problems');
                }
            } else {
                console.log('File does not exist, will create new lists');
            }
        } catch (error) {
            console.error("Failed to load problem lists:", error);
        }
    }

    async syncOfficialProblemLists() {
        console.log('Syncing official problem lists...');
        
        // Create some test official lists
        const officialLists = [
            {
                id: "official_hot100",
                name: "🔥 LeetCode Hot 100",
                description: "The most popular 100 problems on LeetCode",
                isOfficial: true,
                problems: ["1", "2", "3", "4", "5"],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "official_top_interview_150",
                name: "📝 Top Interview 150",
                description: "LeetCode's official top interview questions",
                isOfficial: true,
                problems: ["10", "11", "12", "13", "14"],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const list of officialLists) {
            this.problemLists.set(list.id, list);
            console.log('Added official list:', list.name, 'with', list.problems.length, 'problems');
        }

        await this.saveProblemLists();
    }

    async saveProblemLists() {
        try {
            await fs.ensureDir(path.dirname(this.storagePath));
            const data = JSON.stringify(Array.from(this.problemLists.values()), null, 2);
            await fs.writeFile(this.storagePath, data, "utf8");
            console.log('Saved problem lists to:', this.storagePath);
        } catch (error) {
            console.error("Failed to save problem lists:", error);
        }
    }

    getAllProblemLists() {
        return Array.from(this.problemLists.values());
    }

    getProblemList(id) {
        return this.problemLists.get(id);
    }

    async initialize() {
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
}

async function test() {
    const manager = new ProblemListManager();
    await manager.initialize();
    
    console.log('Total lists:', manager.problemLists.size);
    const allLists = manager.getAllProblemLists();
    console.log('All lists:', allLists.map(l => l.name));
    
    if (allLists.length > 0) {
        const firstList = allLists[0];
        console.log('First list details:', firstList);
        console.log('Problems in first list:', firstList.problems);
    }
}

test().catch(console.error);
