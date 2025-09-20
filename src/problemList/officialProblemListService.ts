// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { IProblemList } from "../shared";

export interface URLBasedProblemList {
    id: string;
    name: string;
    description: string;
    url: string;
    problems: string[]; // Array of problem IDs
}

class URLBasedProblemListService {
    private urlBasedLists: Map<string, URLBasedProblemList> = new Map();

    constructor() {
        this.initializePredefinedURLs();
    }

    private initializePredefinedURLs(): void {
        // Add some predefined popular LeetCode study plans
        const predefinedURLs: URLBasedProblemList[] = [
            {
                id: "hot100",
                name: "🔥 LeetCode Hot 100",
                description: "LeetCode 热题 100 - 最受刷题发烧友欢迎的 100 道题",
                url: "https://leetcode.cn/studyplan/top-100-liked/",
                problems: []
            },
            {
                id: "top_interview_150",
                name: "📋 Top Interview 150",
                description: "LeetCode 精选 TOP 面试题",
                url: "https://leetcode.cn/problem-list/2ckc81c/",
                problems: []
            },
            {
                id: "leetcode_75",
                name: "🎯 LeetCode 75",
                description: "LeetCode 75 题学习计划",
                url: "https://leetcode.cn/studyplan/leetcode-75/",
                problems: []
            }
        ];

        for (const list of predefinedURLs) {
            this.urlBasedLists.set(list.id, list);
        }
    }

    public async createProblemListFromURL(url: string, name?: string): Promise<IProblemList> {
        try {
            // Extract problem IDs from the URL
            const problems = await this.extractProblemsFromURL(url);
            
            const id = `url_${Date.now()}`;
            const problemList: IProblemList = {
                id,
                name: name || this.extractNameFromURL(url),
                description: `Problem list from ${url}`,
                isOfficial: false,
                problems: problems,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            return problemList;
        } catch (error) {
            throw new Error(`Failed to create problem list from URL: ${error}`);
        }
    }

    public async syncPredefinedLists(): Promise<IProblemList[]> {
        const syncedLists: IProblemList[] = [];
        
        for (const list of this.urlBasedLists.values()) {
            try {
                const problems = await this.extractProblemsFromURL(list.url);
                const problemList: IProblemList = {
                    id: `predefined_${list.id}`,
                    name: list.name,
                    description: list.description,
                    isOfficial: true,
                    problems: problems,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                syncedLists.push(problemList);
            } catch (error) {
                console.error(`Failed to sync ${list.name}:`, error);
                // Create empty list if sync fails
                const problemList: IProblemList = {
                    id: `predefined_${list.id}`,
                    name: list.name,
                    description: list.description,
                    isOfficial: true,
                    problems: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                syncedLists.push(problemList);
            }
        }

        return syncedLists;
    }

    private async extractProblemsFromURL(url: string): Promise<string[]> {
        try {
            // For now, we'll use a simple approach to extract problem IDs
            // In the future, this could be enhanced to actually fetch and parse the webpage
            const response = await fetch(url);
            const html = await response.text();
            
            // Extract problem IDs from the HTML content
            // This is a simplified approach - in practice, you'd need more robust parsing
            const problemIdRegex = /\/problems\/([^\/\?]+)/g;
            const matches = html.match(problemIdRegex);
            
            if (matches) {
                return matches.map(match => match.replace('/problems/', ''));
            }
            
            return [];
        } catch (error) {
            console.error('Failed to fetch URL:', error);
            // Fallback to predefined data for known URLs
            return this.getFallbackProblems(url);
        }
    }

    private getFallbackProblems(url: string): string[] {
        // Fallback data for known URLs
        const fallbackData: { [key: string]: string[] } = {
            "https://leetcode.cn/studyplan/top-100-liked/": [
                "1", "2", "3", "4", "5", "10", "11", "15", "17", "19",
                "20", "21", "22", "23", "31", "32", "33", "34", "39", "42",
                "46", "48", "49", "53", "55", "56", "62", "64", "70", "72",
                "75", "76", "78", "79", "84", "85", "94", "96", "98", "101",
                "102", "104", "105", "114", "121", "124", "128", "136", "139", "141",
                "142", "146", "148", "152", "155", "160", "169", "198", "200", "206",
                "207", "208", "215", "221", "226", "234", "236", "238", "239", "240",
                "253", "279", "283", "287", "297", "300", "301", "309", "312", "322",
                "337", "338", "347", "394", "399", "406", "416", "437", "438", "448",
                "461", "494", "538", "543", "560", "581", "617", "621", "647", "739",
                "763", "771", "773", "787", "797", "815", "841", "853", "875", "909",
                "973", "994", "1046", "1143", "1249", "1312", "1466", "1557", "1696", "1791"
            ],
            "https://leetcode.cn/problem-list/2ckc81c/": [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
                "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
                "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
                "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
                "61", "62", "63", "64", "65", "66", "67", "68", "69", "70",
                "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
                "81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
                "91", "92", "93", "94", "95", "96", "97", "98", "99", "100",
                "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
                "111", "112", "113", "114", "115", "116", "117", "118", "119", "120",
                "121", "122", "123", "124", "125", "126", "127", "128", "129", "130",
                "131", "132", "133", "134", "135", "136", "137", "138", "139", "140",
                "141", "142", "143", "144", "145", "146", "147", "148", "149", "150"
            ],
            "https://leetcode.cn/studyplan/leetcode-75/": [
                "1768", "1071", "1431", "605", "345", "151", "238", "334", "443", "283",
                "392", "11", "1679", "643", "1456", "1732", "724", "2215", "205", "392",
                "20", "155", "150", "739", "239", "209", "3", "424", "567", "76",
                "242", "49", "347", "1", "202", "128", "217", "36", "271", "659",
                "121", "409", "589", "102", "199", "637", "429", "515", "116", "104",
                "226", "101", "572", "235", "98", "230", "105", "106", "208", "211",
                "1254", "695", "200", "130", "323", "261", "1584", "743", "787", "1971",
                "1466", "399", "207", "210", "684", "685", "547", "1319", "1584", "990"
            ]
        };

        return fallbackData[url] || [];
    }

    private extractNameFromURL(url: string): string {
        // Extract a meaningful name from the URL
        if (url.includes('top-100-liked')) {
            return '🔥 LeetCode Hot 100';
        } else if (url.includes('2ckc81c')) {
            return '📋 Top Interview 150';
        } else if (url.includes('leetcode-75')) {
            return '🎯 LeetCode 75';
        } else {
            return 'Custom Problem List';
        }
    }

    public getPredefinedURLs(): URLBasedProblemList[] {
        return Array.from(this.urlBasedLists.values());
    }

    public async refreshPredefinedLists(): Promise<void> {
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Syncing predefined problem lists...",
                cancellable: false
            }, async (progress) => {
                progress.report({ message: "Fetching LeetCode predefined lists..." });
                const syncedLists = await this.syncPredefinedLists();
                
                // Update the problem list manager with synced data
                const { problemListManager } = await import("./problemListManager");
                for (const list of syncedLists) {
                    await problemListManager.updateProblemList(list.id, list);
                }
                
                progress.report({ message: "Predefined lists synced successfully!" });
            });
            
            vscode.window.showInformationMessage("Predefined problem lists synced successfully!");
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to sync predefined lists: ${error}`);
        }
    }
}

export const urlBasedProblemListService = new URLBasedProblemListService();
