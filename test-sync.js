// Test script to manually sync problem lists
const { problemListManager } = require('./out/src/problemList/problemListManager');

async function testSync() {
    try {
        console.log('Starting test sync...');
        await problemListManager.initialize();
        console.log('Test sync completed');
    } catch (error) {
        console.error('Test sync failed:', error);
    }
}

testSync();
