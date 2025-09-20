// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import { IProblemList } from "../shared";

export interface URLBasedProblemList {
    id: string;
    name: string;
    description: string;
    url: string;
    problems: string[]; // Array of problem IDs
}

class URLBasedProblemListService {
    constructor() {
        // All problem lists are created from user-provided URLs
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
            // No fallback data available
            return this.getFallbackProblems(url);
        }
    }

    private getFallbackProblems(_url: string): string[] {
        // No fallback data - return empty array
        return [];
    }

    private extractNameFromURL(url: string): string {
        // Extract a meaningful name from the URL
        if (url.includes('top-100-liked')) {
            return '🔥 LeetCode Hot 100';
        } else if (url.includes('2ckc81c')) {
            return '📋 Top Interview 150';
        } else if (url.includes('leetcode-75')) {
            return '🎯 LeetCode 75';
        } else if (url.includes('studyplan')) {
            return '📚 LeetCode Study Plan';
        } else if (url.includes('problem-list')) {
            return '📋 LeetCode Problem List';
        } else {
            return 'Custom Problem List';
        }
    }

}

export const urlBasedProblemListService = new URLBasedProblemListService();
