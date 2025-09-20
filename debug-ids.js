// Debug script to check problem IDs
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function debugIds() {
    try {
        // Read problem lists
        const problemListsPath = path.join(os.homedir(), ".vscode", "leetcode-enhanced", "problemLists.json");
        const problemListsData = await fs.readFile(problemListsPath, 'utf8');
        const problemLists = JSON.parse(problemListsData);
        
        console.log('Problem Lists:');
        for (const list of problemLists.slice(0, 2)) { // Only show first 2 lists
            console.log(`\n${list.name}:`);
            console.log('First 10 problem IDs:', list.problems.slice(0, 10));
            console.log('Problem ID types:', list.problems.slice(0, 5).map(id => typeof id));
        }
        
        // Check if we can find some sample problems
        console.log('\nSample problem IDs from Hot 100:');
        const hot100 = problemLists.find(list => list.id === 'official_hot100');
        if (hot100) {
            console.log('Hot 100 problem IDs:', hot100.problems.slice(0, 10));
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

debugIds();
