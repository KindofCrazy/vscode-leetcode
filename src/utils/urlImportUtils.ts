// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import { getUrl } from "../shared";
import { LcAxios } from "./httpUtils";
import { Problem } from "../shared";

/**
 * URL pattern matchers for different LeetCode URL types
 */
const URL_PATTERNS = {
    studyPlan: /\/studyplan\/([^\/]+)\/?/,
    problemList: /\/problem-list\/([^\/]+)\/?/,
    tag: /\/tag\/([^\/]+)\/?/,
    company: /\/company\/([^\/]+)\/?/
};

/**
 * GraphQL queries for different content types
 */
const GRAPHQL_QUERIES = {
    studyPlan: `
        query studyPlanDetail($slug: String!) {
            studyPlan(slug: $slug) {
                name
                slug
                description
                planSubGroups {
                    questions {
                        translatedTitle
                        titleSlug
                        difficulty
                        questionId
                        questionFrontendId
                        title
                    }
                }
            }
        }
    `,

    problemList: `
        query problemList($slug: String!) {
            favoriteDetail(favoriteSlug: $slug) {
                name
                description
                questions {
                    translatedTitle
                    titleSlug
                    difficulty
                    questionId
                    questionFrontendId
                    title
                }
            }
        }
    `,

    tag: `
        query problemsByTag($tag: String!, $first: Int!) {
            problemsetQuestionList(
                categorySlug: ""
                filters: { tags: [$tag] }
                first: $first
            ) {
                questions {
                    translatedTitle
                    titleSlug
                    difficulty
                    questionId
                    questionFrontendId
                    title
                }
            }
        }
    `
};

/**
 * Parse URL and extract type and identifier
 */
export function parseUrl(url: string): { type: string; slug: string; name: string } | null {
    try {
        const urlObj = new URL(url);

        for (const [type, pattern] of Object.entries(URL_PATTERNS)) {
            const match = urlObj.pathname.match(pattern);
            if (match) {
                const slug = match[1];
                const name = slug.replace(/-/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return { type, slug, name };
            }
        }

        return null;
    } catch (error) {
        console.error("Failed to parse URL:", error);
        return null;
    }
}

/**
 * Fetch problems from LeetCode GraphQL API based on URL type
 */
export async function fetchProblemsFromUrl(url: string): Promise<{ name: string; problems: Problem[] }> {
    const urlInfo = parseUrl(url);
    if (!urlInfo) {
        throw new Error("Unsupported URL format");
    }

    const { type, slug, name } = urlInfo;

    let query: string;
    let variables: any;

    switch (type) {
        case 'studyPlan':
            query = GRAPHQL_QUERIES.studyPlan;
            variables = { slug };
            break;

        case 'problemList':
            query = GRAPHQL_QUERIES.problemList;
            variables = { slug };
            break;

        case 'tag':
            query = GRAPHQL_QUERIES.tag;
            variables = { tag: slug, first: 100 }; // Limit to 100 problems
            break;

        default:
            throw new Error(`URL type "${type}" is not yet supported`);
    }

    try {
        const response = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: {
                query,
                variables
            }
        });

        const problems = extractProblemsFromResponse(response.data.data, type);

        return {
            name: name,
            problems: problems
        };

    } catch (error) {
        console.error("Failed to fetch problems from URL:", error);
        throw new Error(`Failed to fetch problems: ${error.message || error}`);
    }
}

/**
 * Extract problems from GraphQL response based on response type
 */
function extractProblemsFromResponse(data: any, type: string): Problem[] {
    let questionsData: any[] = [];

    switch (type) {
        case 'studyPlan':
            if (data.studyPlan && data.studyPlan.planSubGroups) {
                questionsData = data.studyPlan.planSubGroups.flatMap((group: any) => group.questions || []);
            }
            break;

        case 'problemList':
            if (data.favoriteDetail && data.favoriteDetail.questions) {
                questionsData = data.favoriteDetail.questions;
            }
            break;

        case 'tag':
            if (data.problemsetQuestionList && data.problemsetQuestionList.questions) {
                questionsData = data.problemsetQuestionList.questions;
            }
            break;
    }

    return questionsData.map((q: any) => ({
        id: q.questionFrontendId || q.questionId,
        title: q.translatedTitle || q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty,
        frontendId: q.questionFrontendId,
        questionId: q.questionId
    }));
}

/**
 * Validate if URL is a supported LeetCode URL
 */
export function isValidLeetCodeUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        const isLeetCodeDomain = urlObj.hostname === 'leetcode.com' ||
                                urlObj.hostname === 'www.leetcode.com' ||
                                urlObj.hostname === 'leetcode.cn' ||
                                urlObj.hostname === 'www.leetcode.cn';

        if (!isLeetCodeDomain) {
            return false;
        }

        return Object.values(URL_PATTERNS).some(pattern => pattern.test(urlObj.pathname));
    } catch {
        return false;
    }
}
