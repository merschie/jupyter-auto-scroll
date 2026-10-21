import * as vscode from 'vscode';

const CONFIG_SECTION = 'jupyterAutoScroll';
const CONFIG_KEY = 'enabled';
const CONTEXT_KEY = 'jupyterAutoScroll.enabled';

function isEnabled(): boolean {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(CONFIG_KEY, true);
}

async function setEnabled(value: boolean): Promise<void> {
  await vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .update(CONFIG_KEY, value, vscode.ConfigurationTarget.Global);
  await vscode.commands.executeCommand('setContext', CONTEXT_KEY, value);
}

function revealCell(cell: vscode.NotebookCell): void {
  const editor = vscode.window.visibleNotebookEditors.find((e) => e.notebook === cell.notebook);
  if (!editor) {
    return;
  }
  const range = new vscode.NotebookRange(cell.index, cell.index + 1);
  editor.revealRange(range, vscode.NotebookEditorRevealType.InCenterIfOutsideViewport);
}

export function activate(context: vscode.ExtensionContext): void {
  vscode.commands.executeCommand('setContext', CONTEXT_KEY, isEnabled());

  context.subscriptions.push(
    vscode.commands.registerCommand(`${CONFIG_SECTION}.enable`, () => setEnabled(true)),
    vscode.commands.registerCommand(`${CONFIG_SECTION}.disable`, () => setEnabled(false)),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_KEY}`)) {
        vscode.commands.executeCommand('setContext', CONTEXT_KEY, isEnabled());
      }
    }),

    vscode.workspace.onDidChangeNotebookDocument((event) => {
      if (!isEnabled()) {
        return;
      }

      for (const change of event.cellChanges) {
        const summary = change.executionSummary;
        // `success` ist noch nicht gesetzt, solange die Zelle läuft; das markiert den Start.
        if (summary && summary.success === undefined) {
          revealCell(change.cell);
        }
      }
    })
  );
}

export function deactivate(): void {}
