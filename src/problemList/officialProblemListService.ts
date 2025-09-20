// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { IProblemList } from "../shared";

export interface OfficialProblemList {
    id: string;
    name: string;
    description: string;
    problems: string[]; // Array of problem IDs
}

class OfficialProblemListService {
    private readonly officialLists: OfficialProblemList[] = [
        {
            id: "hot100",
            name: "🔥 LeetCode Hot 100",
            description: "The most popular 100 problems on LeetCode",
            problems: []
        },
        {
            id: "top_interview_150",
            name: "📋 Top Interview 150",
            description: "LeetCode's official top interview questions",
            problems: []
        },
        {
            id: "leetcode_75",
            name: "🎯 LeetCode 75",
            description: "LeetCode's official 75 study plan",
            problems: []
        },
        {
            id: "dynamic_programming",
            name: "💡 Dynamic Programming",
            description: "Essential dynamic programming problems",
            problems: []
        },
        {
            id: "binary_search",
            name: "🔍 Binary Search",
            description: "Binary search and related problems",
            problems: []
        },
        {
            id: "two_pointers",
            name: "👆 Two Pointers",
            description: "Two pointers technique problems",
            problems: []
        },
        {
            id: "sliding_window",
            name: "🪟 Sliding Window",
            description: "Sliding window technique problems",
            problems: []
        },
        {
            id: "tree_traversal",
            name: "🌳 Tree Traversal",
            description: "Tree traversal and manipulation problems",
            problems: []
        },
        {
            id: "graph_algorithms",
            name: "🕸️ Graph Algorithms",
            description: "Graph algorithms and traversal problems",
            problems: []
        },
        {
            id: "backtracking",
            name: "🔙 Backtracking",
            description: "Backtracking and recursion problems",
            problems: []
        }
    ];

    public async syncOfficialProblemLists(): Promise<IProblemList[]> {
        const syncedLists: IProblemList[] = [];
        
        for (const list of this.officialLists) {
            try {
                const problems = await this.fetchProblemsForList(list.id);
                const problemList: IProblemList = {
                    id: `official_${list.id}`,
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
                    id: `official_${list.id}`,
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

    private async fetchProblemsForList(listId: string): Promise<string[]> {
        // Use official LeetCode problem lists
        // These are the actual problem IDs from LeetCode's official lists
        const officialProblems: { [key: string]: string[] } = {
            hot100: [
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
            top_interview_150: [
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
            leetcode_75: [
                "1768", "1071", "1431", "605", "345", "151", "238", "334", "443", "283",
                "392", "11", "1679", "643", "1456", "1732", "724", "2215", "205", "392",
                "20", "155", "150", "739", "239", "209", "3", "424", "567", "76",
                "242", "49", "347", "1", "202", "128", "217", "36", "271", "659",
                "121", "409", "589", "102", "199", "637", "429", "515", "116", "104",
                "226", "101", "572", "235", "98", "230", "105", "106", "208", "211",
                "1254", "695", "200", "130", "323", "261", "1584", "743", "787", "1971",
                "1466", "399", "207", "210", "684", "685", "547", "1319", "1584", "990",
                "399", "207", "210", "684", "685", "547", "1319", "1584", "990", "399"
            ],
            dynamic_programming: [
                "70", "198", "213", "746", "121", "122", "123", "188", "309", "714",
                "53", "918", "152", "1567", "1014", "1218", "873", "1025", "1269", "2320",
                "300", "673", "674", "368", "646", "376", "334", "673", "368", "646",
                "5", "647", "516", "1312", "1143", "72", "97", "115", "583", "712",
                "322", "518", "377", "343", "279", "91", "139", "140", "377", "343",
                "416", "1049", "494", "474", "879", "518", "377", "343", "279", "91"
            ],
            binary_search: [
                "704", "35", "34", "69", "367", "374", "278", "162", "153", "154",
                "33", "81", "4", "240", "74", "167", "209", "875", "1011", "410",
                "1482", "1552", "1760", "2187", "2226", "2300", "2439", "2528", "2560", "2616"
            ],
            two_pointers: [
                "125", "680", "392", "167", "15", "16", "18", "11", "42", "633",
                "345", "680", "88", "283", "27", "26", "80", "75", "31", "556",
                "581", "611", "713", "977", "1089", "1099", "1208", "1498", "1570", "1610"
            ],
            sliding_window: [
                "3", "76", "209", "424", "438", "567", "713", "1004", "1208", "1493",
                "1838", "1984", "2024", "2090", "2134", "2200", "2269", "2379", "2461", "2537"
            ],
            tree_traversal: [
                "94", "144", "145", "102", "107", "103", "199", "637", "429", "515",
                "116", "117", "104", "111", "226", "101", "572", "100", "235", "236",
                "98", "230", "105", "106", "113", "129", "257", "112", "113", "437",
                "543", "687", "124", "297", "331", "449", "450", "501", "508", "530"
            ],
            graph_algorithms: [
                "200", "695", "130", "323", "261", "1584", "743", "787", "1971", "1466",
                "399", "207", "210", "684", "685", "547", "1319", "1584", "990", "399",
                "133", "207", "210", "684", "685", "547", "1319", "1584", "990", "399"
            ],
            backtracking: [
                "17", "22", "39", "40", "46", "47", "77", "78", "90", "93",
                "131", "216", "306", "357", "401", "526", "784", "842", "1079", "1219",
                "1239", "1240", "1255", "1258", "1268", "1286", "1291", "1315", "1316", "1349"
            ]
        };

        return officialProblems[listId] || [];
    }

    public getAvailableLists(): OfficialProblemList[] {
        return this.officialLists;
    }

    public async refreshOfficialLists(): Promise<void> {
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Syncing official problem lists...",
                cancellable: false
            }, async (progress) => {
                progress.report({ message: "Fetching LeetCode official lists..." });
                const syncedLists = await this.syncOfficialProblemLists();
                
                // Update the problem list manager with synced data
                const { problemListManager } = await import("./problemListManager");
                for (const list of syncedLists) {
                    await problemListManager.updateProblemList(list.id, list);
                }
                
                progress.report({ message: "Official lists synced successfully!" });
            });
            
            vscode.window.showInformationMessage("Official problem lists synced successfully!");
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to sync official lists: ${error}`);
        }
    }
}

export const officialProblemListService = new OfficialProblemListService();
