// Debug script to test problem list manager
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

// Simulate the problem list manager
const storagePath = path.join(os.homedir(), ".vscode", "leetcode-enhanced", "problemLists.json");

console.log('Storage path:', storagePath);

// Check if directory exists
const dir = path.dirname(storagePath);
console.log('Directory exists:', fs.existsSync(dir));

// Create directory if it doesn't exist
if (!fs.existsSync(dir)) {
    fs.ensureDirSync(dir);
    console.log('Created directory:', dir);
}

// Test creating a simple problem list
const testProblemList = {
    id: "official_hot100",
    name: "🔥 LeetCode Hot 100",
    description: "The most popular 100 problems on LeetCode",
    isOfficial: true,
    problems: ["1", "2", "3", "4", "5"],
    createdAt: new Date(),
    updatedAt: new Date()
};

// Save test problem list
fs.writeFileSync(storagePath, JSON.stringify([testProblemList], null, 2));
console.log('Saved test problem list to:', storagePath);

// Read it back
const data = fs.readFileSync(storagePath, 'utf8');
const loaded = JSON.parse(data);
console.log('Loaded problem lists:', loaded.length);
console.log('First list:', loaded[0]);
