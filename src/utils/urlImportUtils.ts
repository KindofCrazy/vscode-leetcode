// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import { Problem, getUrl } from "../shared";
import { LcAxios } from "./httpUtils";

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
 * Fetch problems using LeetCode CLI based on URL type
 */
export async function fetchProblemsFromUrl(url: string): Promise<{ name: string; problems: Problem[]; categories?: any[] }> {
    const urlInfo = parseUrl(url);
    if (!urlInfo) {
        throw new Error("Unsupported URL format");
    }

    const { type, slug, name } = urlInfo;

    console.log(`fetchProblemsFromUrl: Starting CLI-based import for URL: ${url}`);
    console.log(`fetchProblemsFromUrl: Detected type: ${type}, slug: ${slug}, name: ${name}`);

    try {
        // Use LeetCode CLI to get real problems based on URL type
        let problems: Problem[] = [];
        let categories: any[] = [];

        switch (type) {
            case 'studyPlan':
                const studyPlanResult = await fetchStudyPlanProblems(slug);
                problems = studyPlanResult.problems;
                categories = studyPlanResult.categories || [];
                break;

            case 'problemList':
                problems = await fetchProblemListProblems(slug);
                break;

            case 'tag':
                problems = await fetchProblemsByTag(slug);
                break;

            case 'company':
                problems = await fetchProblemsByCompany(slug);
                break;

            default:
                throw new Error(`URL type "${type}" is not yet supported`);
        }

        console.log(`fetchProblemsFromUrl: Successfully fetched ${problems.length} real problems using CLI`);
        if (categories.length > 0) {
            console.log(`fetchProblemsFromUrl: Also fetched ${categories.length} categories`);
        }

        return {
            name: name,
            problems: problems,
            categories: categories
        };

    } catch (error) {
        console.error("Failed to fetch problems using CLI:", error);
        throw new Error(`CLI fetch failed: ${error.message || error}. Will use fallback data.`);
    }
}

/**
 * Fetch problems for study plans using GraphQL API
 */
async function fetchStudyPlanProblems(slug: string): Promise<{ problems: Problem[]; categories?: any[] }> {
    try {
        console.log(`fetchStudyPlanProblems: Getting real problems for study plan: ${slug}`);

        // Try a simple GraphQL query to check if API is accessible
        const testQuery = {
            query: `
                query {
                    userStatus {
                        isSignedIn
                        username
                    }
                }
            `,
            variables: {}
        };

        console.log(`fetchStudyPlanProblems: Testing GraphQL connectivity`);

        const testResponse = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: testQuery
        });

        console.log(`fetchStudyPlanProblems: GraphQL test response:`, testResponse.data);

        if (testResponse.data.errors) {
            throw new Error(`GraphQL not accessible: ${testResponse.data.errors[0]?.message}`);
        }

        // If basic query works, try study plan query
        const studyPlanQuery = {
            query: `
                query studyPlanV2Detail($slug: String!) {
                    studyPlanV2Detail(planSlug: $slug) {
                        name
                        slug
                        description
                        planSubGroups {
                            slug
                            name
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
            variables: { slug }
        };

        console.log(`fetchStudyPlanProblems: Querying study plan with slug: ${slug}`);

        const response = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: studyPlanQuery
        });

        console.log(`fetchStudyPlanProblems: Study plan response:`, JSON.stringify(response.data, null, 2));

        if (response.data.errors) {
            throw new Error(`Study plan query failed: ${response.data.errors[0]?.message}`);
        }

        const studyPlanData = response.data.data?.studyPlanV2Detail;
        if (!studyPlanData) {
            throw new Error("No study plan data in response");
        }

        let allQuestions: any[] = [];
        if (studyPlanData.planSubGroups) {
            allQuestions = studyPlanData.planSubGroups.flatMap((group: any) => group.questions || []);
        }

        if (allQuestions.length === 0) {
            throw new Error("No questions found in study plan");
        }

        const problems: Problem[] = allQuestions.map((q: any) => ({
            id: q.questionFrontendId || q.questionId,
            title: q.translatedTitle || q.title,
            titleSlug: q.titleSlug,
            difficulty: q.difficulty,
            frontendId: q.questionFrontendId,
            questionId: q.questionId
        }));

        // Create categories from planSubGroups
        const categories = studyPlanData.planSubGroups.map((group: any) => ({
            id: `category_${group.slug}`,
            name: group.name,
            slug: group.slug,
            problems: group.questions ? group.questions.map((q: any) => ({
                id: q.questionFrontendId || q.questionId,
                title: q.translatedTitle || q.title,
                titleSlug: q.titleSlug,
                difficulty: q.difficulty,
                frontendId: q.questionFrontendId,
                questionId: q.questionId
            })) : []
        }));

        console.log(`fetchStudyPlanProblems: Successfully extracted ${problems.length} real problems from GraphQL`);
        return { problems, categories };

    } catch (error) {
        console.error("Failed to fetch study plan problems via GraphQL:", error);

        // Try web scraping as the only fallback
        console.log("Trying web scraping approach...");
        try {
            const scrapingResult = await fetchStudyPlanProblemsViaWebScraping(slug);
            return scrapingResult;
        } catch (scrapingError) {
            console.error("Web scraping also failed:", scrapingError);
            throw new Error(`Failed to import from URL. GraphQL failed: ${error.message}. Web scraping failed: ${scrapingError.message}`);
        }
    }
}


/**
 * Fetch study plan problems via web scraping using fetch
 */
async function fetchStudyPlanProblemsViaWebScraping(slug: string): Promise<{ problems: Problem[]; categories?: any[] }> {
    try {
        console.log(`fetchStudyPlanProblemsViaWebScraping: Attempting to scrape study plan: ${slug}`);

        // Try to fetch the page content and look for embedded data
        const url = `https://leetcode.cn/studyplan/${slug}/`;
        console.log(`fetchStudyPlanProblemsViaWebScraping: Fetching URL: ${url}`);

        // Use a simple HTTP request to get the page
        const response = await LcAxios(url, {
            method: "GET",
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        console.log(`fetchStudyPlanProblemsViaWebScraping: Got HTML content, length: ${html.length}`);

        // Look for __NEXT_DATA__ script tag which contains the study plan data
        // Capture the full inner JSON text between the script tags (do not try to match braces)
        const nextDataMatches = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

        if (nextDataMatches) {
            try {
                const raw = nextDataMatches[1].trim();
                const nextData = JSON.parse(raw);
                console.log(`fetchStudyPlanProblemsViaWebScraping: Found __NEXT_DATA__`);

                // Extract study plan data from the Next.js data
                const result = extractProblemsFromNextData(nextData, slug);
                if (result.problems.length > 0) {
                    console.log(`fetchStudyPlanProblemsViaWebScraping: Extracted ${result.problems.length} problems from __NEXT_DATA__`);
                    return result;
                }
            } catch (parseError) {
                console.log(`fetchStudyPlanProblemsViaWebScraping: Failed to parse __NEXT_DATA__:`, parseError);
            }
        }

        // Also try __INITIAL_STATE__ as fallback
        const initialStateMatches = html.match(/<script[^>]*>[\s\S]*?window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});[\s\S]*?<\/script>/);

        if (initialStateMatches) {
            try {
                const jsonData = JSON.parse(initialStateMatches[1]);
                console.log(`fetchStudyPlanProblemsViaWebScraping: Found __INITIAL_STATE__ data`);

                // Try to extract problems from the initial state
                const result = extractProblemsFromInitialState(jsonData, slug);
                if (result.problems.length > 0) {
                    console.log(`fetchStudyPlanProblemsViaWebScraping: Extracted ${result.problems.length} problems from __INITIAL_STATE__`);
                    return result;
                }
            } catch (parseError) {
                console.log(`fetchStudyPlanProblemsViaWebScraping: Failed to parse __INITIAL_STATE__:`, parseError);
            }
        }

        // If no embedded data found, try to extract from HTML structure
        const htmlResult = extractProblemsFromHTML(html);
        if (htmlResult.problems.length > 0) {
            return htmlResult;
        }

        throw new Error("No problems found in page content");

    } catch (error) {
        console.error("Web scraping failed:", error);
        throw error;
    }
}

/**
 * Extract problems from __NEXT_DATA__ JSON
 */
function extractProblemsFromNextData(nextData: any, slug: string): { problems: Problem[]; categories?: any[] } {
    try {
        console.log(`extractProblemsFromNextData: Processing Next.js data for ${slug}`);

        // Navigate to the study plan data based on your provided structure
        const queries = nextData?.props?.pageProps?.dehydratedState?.queries;
        if (!queries || !Array.isArray(queries)) {
            console.log("No queries found in Next.js data");
            return { problems: [] };
        }

        // Find the query that contains studyPlanV2Detail
        for (const query of queries) {
            const studyPlanData = query?.state?.data?.studyPlanV2Detail;
            if (studyPlanData && studyPlanData.planSubGroups) {
                console.log(`extractProblemsFromNextData: Found studyPlanV2Detail with ${studyPlanData.planSubGroups.length} groups`);

                // Extract all questions from all planSubGroups
                const allQuestions: any[] = [];
                for (const group of studyPlanData.planSubGroups) {
                    if (group.questions && Array.isArray(group.questions)) {
                        console.log(`extractProblemsFromNextData: Group "${group.name}" has ${group.questions.length} questions`);
                        allQuestions.push(...group.questions);
                    }
                }

                if (allQuestions.length > 0) {
                    const problems: Problem[] = allQuestions.map((q: any) => ({
                        id: q.questionFrontendId || q.id,
                        title: q.translatedTitle || q.title,
                        titleSlug: q.titleSlug,
                        difficulty: q.difficulty?.toLowerCase() || "medium", // Convert EASY -> easy
                        frontendId: q.questionFrontendId || q.id,
                        questionId: q.id || q.questionFrontendId
                    }));

                    // Create categories from planSubGroups
                    const categories = studyPlanData.planSubGroups.map((group: any) => ({
                        id: `category_${group.slug}`,
                        name: group.name,
                        slug: group.slug,
                        problems: group.questions ? group.questions.map((q: any) => ({
                            id: q.questionFrontendId || q.id,
                            title: q.translatedTitle || q.title,
                            titleSlug: q.titleSlug,
                            difficulty: q.difficulty?.toLowerCase() || "medium",
                            frontendId: q.questionFrontendId || q.id,
                            questionId: q.id || q.questionFrontendId
                        })) : []
                    }));

                    console.log(`extractProblemsFromNextData: Successfully extracted ${problems.length} problems from ${studyPlanData.planSubGroups.length} groups`);
                    return { problems, categories };
                }
            }
        }

        console.log("No studyPlanV2Detail found in Next.js queries");
        return { problems: [] };

    } catch (error) {
        console.error("Failed to extract from Next.js data:", error);
        return { problems: [] };
    }
}

/**
 * Extract problems from page's initial state JSON
 */
function extractProblemsFromInitialState(data: any, _slug: string): { problems: Problem[]; categories?: any[] } {
    try {
        // Look for study plan data in various possible locations
        const possiblePaths = [
            data?.studyplan,
            data?.studyPlan,
            data?.plan,
            data?.questions,
            data?.problemList
        ];

        for (const path of possiblePaths) {
            if (path && Array.isArray(path)) {
                return { problems: convertInitialStateToProblems(path) };
            } else if (path && path.questions && Array.isArray(path.questions)) {
                return { problems: convertInitialStateToProblems(path.questions) };
            } else if (path && path.planSubGroups) {
                const allQuestions = path.planSubGroups.flatMap((group: any) => group.questions || []);
                const categories = path.planSubGroups.map((group: any) => ({
                    id: `category_${group.slug || group.name}`,
                    name: group.name,
                    slug: group.slug || group.name,
                    problems: group.questions ? convertInitialStateToProblems(group.questions) : []
                }));
                return {
                    problems: convertInitialStateToProblems(allQuestions),
                    categories
                };
            }
        }

        return { problems: [] };
    } catch (error) {
        console.error("Failed to extract from initial state:", error);
        return { problems: [] };
    }
}

/**
 * Extract problems from HTML content
 */
function extractProblemsFromHTML(html: string): { problems: Problem[]; categories?: any[] } {
    try {
        // Look for problem links in HTML
        const problemLinkRegex = /href="\/problems\/([^"]+)"/g;

        const problems: Problem[] = [];
        const foundSlugs = new Set<string>();

        let match;
        while ((match = problemLinkRegex.exec(html)) !== null) {
            const slug = match[1];
            if (!foundSlugs.has(slug)) {
                foundSlugs.add(slug);

                // Try to find the title near this link
                const title = slug.replace(/-/g, ' ').split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                problems.push({
                    id: problems.length + 1 + "",
                    title: title,
                    titleSlug: slug,
                    difficulty: "Medium", // Default difficulty
                    frontendId: problems.length + 1 + "",
                    questionId: problems.length + 1 + ""
                });
            }
        }

        console.log(`extractProblemsFromHTML: Extracted ${problems.length} problems from HTML`);
        return { problems: problems.slice(0, 100) }; // Limit to 100

    } catch (error) {
        console.error("Failed to extract from HTML:", error);
        return { problems: [] };
    }
}

/**
 * Convert initial state data to Problem format
 */
function convertInitialStateToProblems(questions: any[]): Problem[] {
    return questions.map((q: any, index: number) => ({
        id: q.questionFrontendId || q.questionId || (index + 1).toString(),
        title: q.translatedTitle || q.title || q.name || `Problem ${index + 1}`,
        titleSlug: q.titleSlug || q.slug || `problem-${index + 1}`,
        difficulty: q.difficulty || "Medium",
        frontendId: q.questionFrontendId || q.questionId || (index + 1).toString(),
        questionId: q.questionId || q.questionFrontendId || (index + 1).toString()
    }));
}

/**
 * Fetch problems for problem lists using GraphQL
 */
async function fetchProblemListProblems(slug: string): Promise<Problem[]> {
    try {
        console.log(`fetchProblemListProblems: Getting problems for problem list: ${slug}`);

        // Try GraphQL query for problem lists - use favoriteQuestionList instead of favoriteDetail
        const query = {
            query: `
                query favoriteQuestionList($favoriteSlug: String!) {
                    favoriteQuestionList(favoriteSlug: $favoriteSlug) {
                        questions {
                            difficulty
                            id
                            paidOnly
                            questionFrontendId
                            status
                            title
                            titleSlug
                            translatedTitle
                            topicTags {
                                id
                                name
                                slug
                                nameTranslated
                            }
                            isInMyFavorites
                            frequency
                            acRate
                            contestPoint
                        }
                    }
                }
            `,
            variables: { favoriteSlug: slug }
        };

        const response = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: query
        });

        if (response.data.errors) {
            throw new Error(`GraphQL error: ${response.data.errors[0]?.message}`);
        }

        const favoriteData = response.data.data?.favoriteQuestionList;
        if (!favoriteData || !favoriteData.questions) {
            throw new Error("No problem list data found");
        }

        const problems: Problem[] = favoriteData.questions.map((q: any) => ({
            id: q.questionFrontendId || q.id,
            title: q.translatedTitle || q.title,
            titleSlug: q.titleSlug,
            difficulty: q.difficulty,
            frontendId: q.questionFrontendId,
            questionId: q.id
        }));

        console.log(`fetchProblemListProblems: Successfully extracted ${problems.length} problems from GraphQL`);
        return problems;

    } catch (error) {
        console.error("Failed to fetch problem list problems:", error);

        // Try web scraping as fallback
        console.log("Trying web scraping approach for problem list...");
        try {
            const scrapingResult = await fetchProblemListProblemsViaWebScraping(slug);
            return scrapingResult.problems;
        } catch (scrapingError) {
            console.error("Web scraping also failed:", scrapingError);
            throw new Error(`Failed to import from URL. GraphQL failed: ${error.message}. Web scraping failed: ${scrapingError.message}`);
        }
    }
}

/**
 * Fetch problems by tag using GraphQL
 */
async function fetchProblemsByTag(tag: string): Promise<Problem[]> {
    try {
        console.log(`fetchProblemsByTag: Getting problems with tag: ${tag}`);

        // Try GraphQL query for tag-based problems
        const query = {
            query: `
                query problemsetQuestionList($categorySlug: String!, $filters: QuestionListFilterInput!) {
                    problemsetQuestionList(categorySlug: $categorySlug, filters: $filters) {
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
            variables: {
                categorySlug: "",
                filters: { tags: [tag] }
            }
        };

        const response = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: query
        });

        if (response.data.errors) {
            throw new Error(`GraphQL error: ${response.data.errors[0]?.message}`);
        }

        const questionData = response.data.data?.problemsetQuestionList;
        if (!questionData || !questionData.questions) {
            throw new Error("No tag problems data found");
        }

        const problems: Problem[] = questionData.questions.map((q: any) => ({
            id: q.questionFrontendId || q.questionId,
            title: q.translatedTitle || q.title,
            titleSlug: q.titleSlug,
            difficulty: q.difficulty,
            frontendId: q.questionFrontendId,
            questionId: q.questionId
        }));

        console.log(`fetchProblemsByTag: Successfully extracted ${problems.length} problems with tag: ${tag}`);
        return problems;

    } catch (error) {
        console.error("Failed to fetch problems by tag:", error);
        throw new Error(`Failed to fetch tag problems: ${error.message}`);
    }
}

/**
 * Fetch problems by company using GraphQL
 */
async function fetchProblemsByCompany(company: string): Promise<Problem[]> {
    try {
        console.log(`fetchProblemsByCompany: Getting problems for company: ${company}`);

        // Try GraphQL query for company-based problems
        const query = {
            query: `
                query problemsetQuestionList($categorySlug: String!, $filters: QuestionListFilterInput!) {
                    problemsetQuestionList(categorySlug: $categorySlug, filters: $filters) {
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
            variables: {
                categorySlug: "",
                filters: { companyTags: [company] }
            }
        };

        const response = await LcAxios(getUrl("graphql"), {
            method: "POST",
            data: query
        });

        if (response.data.errors) {
            throw new Error(`GraphQL error: ${response.data.errors[0]?.message}`);
        }

        const questionData = response.data.data?.problemsetQuestionList;
        if (!questionData || !questionData.questions) {
            throw new Error("No company problems data found");
        }

        const problems: Problem[] = questionData.questions.map((q: any) => ({
            id: q.questionFrontendId || q.questionId,
            title: q.translatedTitle || q.title,
            titleSlug: q.titleSlug,
            difficulty: q.difficulty,
            frontendId: q.questionFrontendId,
            questionId: q.questionId
        }));

        console.log(`fetchProblemsByCompany: Successfully extracted ${problems.length} problems for company: ${company}`);
        return problems;

    } catch (error) {
        console.error("Failed to fetch problems by company:", error);
        throw new Error(`Failed to fetch company problems: ${error.message}`);
    }
}

/**
 * Fetch problem list problems via web scraping as fallback
 */
async function fetchProblemListProblemsViaWebScraping(slug: string): Promise<{ problems: Problem[]; categories?: any[] }> {
    try {
        console.log(`fetchProblemListProblemsViaWebScraping: Attempting to scrape problem list: ${slug}`);

        // Try to fetch the page content and look for embedded data
        const url = `https://leetcode.cn/problem-list/${slug}/`;
        console.log(`fetchProblemListProblemsViaWebScraping: Fetching URL: ${url}`);

        const response = await LcAxios(url, {
            method: "GET",
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        console.log(`fetchProblemListProblemsViaWebScraping: Got HTML content, length: ${html.length}`);

        // Look for __NEXT_DATA__ script tag which contains the problem list data
        const nextDataMatches = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

        if (nextDataMatches) {
            try {
                const raw = nextDataMatches[1].trim();
                const nextData = JSON.parse(raw);
                console.log(`fetchProblemListProblemsViaWebScraping: Found __NEXT_DATA__`);

                // Extract problem list data from the Next.js data
                const result = extractProblemListFromNextData(nextData, slug);
                if (result.problems.length > 0) {
                    console.log(`fetchProblemListProblemsViaWebScraping: Extracted ${result.problems.length} problems from __NEXT_DATA__`);
                    return result;
                }
            } catch (parseError) {
                console.log(`fetchProblemListProblemsViaWebScraping: Failed to parse __NEXT_DATA__:`, parseError);
            }
        }

        // Also try __INITIAL_STATE__ as fallback
        const initialStateMatches = html.match(/<script[^>]*>[\s\S]*?window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});[\s\S]*?<\/script>/);

        if (initialStateMatches) {
            try {
                const jsonData = JSON.parse(initialStateMatches[1]);
                console.log(`fetchProblemListProblemsViaWebScraping: Found __INITIAL_STATE__ data`);

                // Try to extract problems from the initial state
                const result = extractProblemListFromInitialState(jsonData, slug);
                if (result.problems.length > 0) {
                    console.log(`fetchProblemListProblemsViaWebScraping: Extracted ${result.problems.length} problems from __INITIAL_STATE__`);
                    return result;
                }
            } catch (parseError) {
                console.log(`fetchProblemListProblemsViaWebScraping: Failed to parse __INITIAL_STATE__:`, parseError);
            }
        }

        throw new Error("No problems found in page content");

    } catch (error) {
        console.error("Problem list web scraping failed:", error);
        throw error;
    }
}

/**
 * Extract problems from __NEXT_DATA__ JSON for problem list
 */
function extractProblemListFromNextData(nextData: any, slug: string): { problems: Problem[]; categories?: any[] } {
    try {
        console.log(`extractProblemListFromNextData: Processing Next.js data for problem list ${slug}`);

        // Navigate to the problem list data based on the structure
        const queries = nextData?.props?.pageProps?.dehydratedState?.queries;
        if (!queries || !Array.isArray(queries)) {
            console.log("No queries found in Next.js data");
            return { problems: [] };
        }

        // Find the query that contains favoriteQuestionList
        for (const query of queries) {
            const favoriteData = query?.state?.data?.favoriteQuestionList;
            if (favoriteData && favoriteData.questions) {
                console.log(`extractProblemListFromNextData: Found favoriteQuestionList with ${favoriteData.questions.length} questions`);

                const problems: Problem[] = favoriteData.questions.map((q: any) => ({
                    id: q.questionFrontendId || q.id,
                    title: q.translatedTitle || q.title,
                    titleSlug: q.titleSlug,
                    difficulty: q.difficulty?.toLowerCase() || "medium",
                    frontendId: q.questionFrontendId,
                    questionId: q.id
                }));

                console.log(`extractProblemListFromNextData: Successfully extracted ${problems.length} problems`);
                return { problems };
            }
        }

        console.log("No favoriteQuestionList found in Next.js queries");
        return { problems: [] };

    } catch (error) {
        console.error("Failed to extract problem list from Next.js data:", error);
        return { problems: [] };
    }
}

/**
 * Extract problems from page's initial state JSON for problem list
 */
function extractProblemListFromInitialState(data: any, _slug: string): { problems: Problem[]; categories?: any[] } {
    try {
        // Look for problem list data in various possible locations
        const possiblePaths = [
            data?.favoriteQuestionList,
            data?.favoriteList,
            data?.questions,
            data?.problemList
        ];

        for (const path of possiblePaths) {
            if (path && path.questions && Array.isArray(path.questions)) {
                const problems: Problem[] = path.questions.map((q: any, index: number) => ({
                    id: q.questionFrontendId || q.questionId || q.id || (index + 1).toString(),
                    title: q.translatedTitle || q.title || q.name || `Problem ${index + 1}`,
                    titleSlug: q.titleSlug || q.slug || `problem-${index + 1}`,
                    difficulty: q.difficulty || "Medium",
                    frontendId: q.questionFrontendId || q.questionId || q.id || (index + 1).toString(),
                    questionId: q.questionId || q.questionFrontendId || q.id || (index + 1).toString()
                }));

                console.log(`extractProblemListFromInitialState: Successfully extracted ${problems.length} problems`);
                return { problems };
            }
        }

        return { problems: [] };
    } catch (error) {
        console.error("Failed to extract problem list from initial state:", error);
        return { problems: [] };
    }
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

