# MindWrite - Your Digital Freewriting Space

MindWrite is a simple, distraction-free desktop application designed for freewriting, built with Go, Wails, and React.

## What is Freewriting?

Freewriting is a writing technique aimed at overcoming writer's block, generating ideas, and simply getting thoughts down on paper (or screen!) without the pressure of perfection. The core idea is to write continuously for a set period without stopping, editing, or censoring yourself.

**How it works:**

1.  **Set a timer (optional but helpful):** Start with 5-10 minutes.
2.  **Start writing:** Write whatever comes to mind. Don't worry about grammar, spelling, punctuation, or even making sense.
3.  **Keep writing:** Do not stop writing for the entire duration. If you get stuck, write "I don't know what to write" or describe something in the room until a new thought emerges.
4.  **Don't edit:** Resist the urge to correct mistakes or change words. The goal is flow, not polish.
5.  **Review (optional):** After the time is up, you can read back what you wrote. You might find surprising ideas, insights, or just a clearer head.

MindWrite aims to provide a minimal interface to facilitate this practice, automatically saving your progress so you can focus purely on the writing itself.

## Features

*   Clean, focused editor interface.
*   Automatic saving of your writing sessions (entries are named by date, e.g., `YYYY-MM-DD.md`).
*   Entries are stored locally in a `mindwrite` directory in your user's home folder.
*   Basic file management (loading entries).

## Live Development

To run in live development mode:

1.  Navigate to the project directory in your terminal.
2.  Run `wails dev`.

This starts a Vite development server for the frontend with hot reloading. Changes to your Go code will require restarting the `wails dev` command. You can also access the application in your browser at `http://localhost:34115` to use browser devtools.

## Building

To build a redistributable, production-ready package:

1.  Navigate to the project directory in your terminal.
2.  Run `wails build`.

This will create the application binary in the `build/bin` directory.

## Technology Stack

*   **Backend:** Go
*   **Frontend:** React (with Vite)
*   **Desktop App Framework:** Wails v2
*   **Styling:** Tailwind CSS