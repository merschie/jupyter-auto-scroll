import * as vscode from 'vscode';

const CONFIG_SECTION = 'jupyterAutoScroll';
const CONFIG_KEY = 'enabled';
const CONTEXT_KEY = 'jupyterAutoScroll.enabled';

const output = vscode.window.createOutputChannel('Jupyter Auto Scroll');

function isEnabled(): boolean {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(CONFIG_KEY, true);
}

async function setEnabled(value: boolean): Promise<void> {
  await vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .update(CONFIG_KEY, value, vscode.ConfigurationTarget.Global);
  await vscode.commands.executeCommand('setContext', CONTEXT_KEY, value);
  output.appendLine(`enabled = ${value}`);
}

function revealCell(cell: vscode.NotebookCell): void {
  const editor = vscode.window.visibleNotebookEditors.find((e) => e.notebook === cell.notebook);
  if (!editor) {
    output.appendLine(`kein sichtbarer Editor fuer Zelle ${cell.index} gefunden`);
    return;
  }
  const range = new vscode.NotebookRange(cell.index, cell.index + 1);
  editor.revealRange(range, vscode.NotebookEditorRevealType.InCenterIfOutsideViewport);
  output.appendLine(`revealRange fuer Zelle ${cell.index} aufgerufen`);
}

export function activate(context: vscode.ExtensionContext): void {
  output.appendLine('Extension aktiviert.');
  output.show(true);

  // Checkbox-Icon in der Notebook-Toolbar initial synchronisieren.
  vscode.commands.executeCommand('setContext', CONTEXT_KEY, isEnabled());

  context.subscriptions.push(
    output,
    vscode.commands.registerCommand(`${CONFIG_SECTION}.enable`, () => setEnabled(true)),
    vscode.commands.registerCommand(`${CONFIG_SECTION}.disable`, () => setEnabled(false)),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_KEY}`)) {
        vscode.commands.executeCommand('setContext', CONTEXT_KEY, isEnabled());
      }
    }),

    vscode.workspace.onDidChangeNotebookDocument((event) => {
      for (const change of event.cellChanges) {
        if (change.executionSummary) {
          output.appendLine(
            `Zelle ${change.cell.index}: executionSummary = ${JSON.stringify(change.executionSummary)}`
          );
        }
      }

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
