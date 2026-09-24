# Jupyter Auto Scroll

Automatically scrolls the notebook view to the cell that is currently executing — handy when you run a long notebook (`Run All`) and don't want to manually chase the running cell down the page.

## Features

- Follows execution: when a new cell starts running, the editor scrolls so it's visible.
- One-click toggle button in the notebook toolbar to turn the behavior on/off, mirrored by a checkbox icon (`$(check)` / `$(circle-large-outline)`).
- The setting also persists via `jupyterAutoScroll.enabled` in your user settings.

## Usage

1. Open any `.ipynb` notebook.
2. Run a cell, or use "Run All".
3. The view follows the currently executing cell automatically.
4. Toggle the behavior via the checkbox-style button in the notebook toolbar (top of the editor), or via the **Automatically enable/disable scrolling** commands from the Command Palette.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `jupyterAutoScroll.enabled` | `true` | Automatically scroll to the cell that starts executing. |

## Requirements

Works with any notebook of type `jupyter-notebook` (the built-in `.ipynb` support, or the [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)).

## Release Notes

### 0.0.1

Initial release.
