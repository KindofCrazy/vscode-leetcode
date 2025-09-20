// Test script to verify lazy import works
const path = require('path');

async function testLazyImport() {
    try {
        console.log('Testing lazy import...');
        
        // Test lazy import
        const { problemListManager } = await import('./out/src/problemList/problemListManager.js');
        console.log('Lazy import successful');
        
        // Test getting problem lists
        const problemLists = problemListManager.getAllProblemLists();
        console.log('Got problem lists:', problemLists.length);
        
        if (problemLists.length > 0) {
            console.log('First list:', problemLists[0].name);
            console.log('Problems in first list:', problemLists[0].problems.length);
        }
        
    } catch (error) {
        console.error('Lazy import failed:', error);
    }
}

testLazyImport();
