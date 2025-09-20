// Test script to test problem list manager directly
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

// Simulate the problem list manager
class ProblemListManager {
    constructor() {
        this.storagePath = path.join(os.homedir(), ".vscode", "leetcode-enhanced", "problemLists.json");
        this.problemLists = new Map();
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
                console.log('File does not exist');
            }
        } catch (error) {
            console.error("Failed to load problem lists:", error);
        }
    }

    getAllProblemLists() {
        return Array.from(this.problemLists.values());
    }

    getProblemList(id) {
        return this.problemLists.get(id);
    }
}

async function test() {
    const manager = new ProblemListManager();
    await manager.loadProblemLists();
    
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
