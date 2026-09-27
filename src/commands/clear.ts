// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { leetCodeChannel } from "../leetCodeChannel";
import { leetCodeExecutor } from "../leetCodeExecutor";
import { languages } from "../shared";
import { shouldUseEndpointTranslation } from "../utils/settingUtils";
import { DialogType, promptForOpenOutputChannel } from "../utils/uiUtils";

interface ICodeRegion {
    start: number;
    end: number;
    content: string;
}

interface IProblemMetadata {
    id: string;
    language: string;
}

export async function clearSolution(uri?: vscode.Uri): Promise<void> {
    const document: vscode.TextDocument | undefined = await getDocument(uri);
    if (!document) {
        vscode.window.showErrorMessage("Open a LeetCode solution file before clearing the answer.");
        return;
    }

    const originalVersion: number = document.version;
    const source: string = document.getText();
    const metadata: IProblemMetadata | undefined = getProblemMetadata(source);
    const currentRegion: ICodeRegion | undefined = getCodeRegion(source);
    if (!metadata || !currentRegion) {
        vscode.window.showErrorMessage("The active file does not contain a valid LeetCode code template.");
        return;
    }

    try {
        const template: string = await leetCodeExecutor.getProblemTemplate(
            metadata.id,
            metadata.language,
            false,
            shouldUseEndpointTranslation(),
        );
        const templateRegion: ICodeRegion | undefined = getCodeRegion(template);
        if (!templateRegion) {
            vscode.window.showErrorMessage("LeetCode returned a template without a code region.");
            return;
        }

        if (document.version !== originalVersion) {
            vscode.window.showWarningMessage("The solution changed while its template was loading. Run Clear again to avoid overwriting those changes.");
            return;
        }

        const replacement: string = normalizeEndOfLine(templateRegion.content, document.eol);
        if (currentRegion.content === replacement) {
            vscode.window.showInformationMessage("The solution is already clear.");
            return;
        }

        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(document.positionAt(currentRegion.start), document.positionAt(currentRegion.end)),
            replacement,
        );
        if (!await vscode.workspace.applyEdit(edit)) {
            vscode.window.showErrorMessage("Failed to clear the solution.");
            return;
        }

        vscode.window.showInformationMessage("Solution cleared. Use Undo to restore your answer.");
    } catch (error) {
        leetCodeChannel.appendLine(error.toString());
        await promptForOpenOutputChannel("Failed to clear the solution. Please open the output channel for details.", DialogType.error);
    }
}

function getDocument(uri?: vscode.Uri): Thenable<vscode.TextDocument | undefined> {
    if (uri) {
        return vscode.workspace.openTextDocument(uri);
    }
    return Promise.resolve(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document);
}

function getProblemMetadata(source: string): IProblemMetadata | undefined {
    const match: RegExpMatchArray | null = source.match(/@lc\s+app=\S+\s+id=(.+?)\s+lang=(\S+)/);
    if (!match) {
        return undefined;
    }
    const id: string = match[1].trim();
    const language: string = match[2];
    if (!id || languages.indexOf(language) < 0 || /[\r\n;&|<>`$(){}\[\]\\'"!]/.test(id)) {
        return undefined;
    }
    return { id, language };
}

function getCodeRegion(source: string): ICodeRegion | undefined {
    const startMarker: RegExpMatchArray | null = source.match(/@lc code=(?:start|begin)/);
    if (!startMarker || startMarker.index === undefined) {
        return undefined;
    }

    const startLineEnd: number = source.indexOf("\n", startMarker.index);
    if (startLineEnd < 0) {
        return undefined;
    }

    const endMarkerIndex: number = source.lastIndexOf("@lc code=end");
    if (endMarkerIndex < startLineEnd + 1) {
        return undefined;
    }

    const endLineStart: number = source.lastIndexOf("\n", endMarkerIndex) + 1;
    const contentStart: number = startLineEnd + 1;
    if (endLineStart < contentStart) {
        return undefined;
    }

    return {
        start: contentStart,
        end: endLineStart,
        content: source.slice(contentStart, endLineStart),
    };
}

function normalizeEndOfLine(content: string, endOfLine: vscode.EndOfLine): string {
    const lineEnding: string = endOfLine === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
    return content.replace(/\r?\n/g, lineEnding);
}
