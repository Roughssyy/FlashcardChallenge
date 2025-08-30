# RemNote Flashcard Rate Tracker

This project contains a sample RemNote plugin that gamifies global queue reviews
by tracking your flashcard speed.

## Features
- Displays a sidebar widget with:
  - Session duration
  - Cards answered correctly and incorrectly
  - Current cards-per-minute rate
  - Best rate across all sessions
- Stores the high score in plugin storage.
- Plays a celebratory sound and toast when you beat your previous best rate.

## Development
1. Install dependencies
   ```bash
   npm install
   ```
2. Build the plugin
   ```bash
   npm run build
   ```
3. Load the `dist` folder as a plugin in RemNote.

## Usage
- Run the command **Start Flashcard Session** before you begin reviewing.
- Review cards as usual. Statistics will update in the sidebar.
- Run **End Flashcard Session** when you're done to record your top speed.
