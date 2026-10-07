---
name: visual-ui-testing
description: [ENFORCED] Automatically spawns a browser to verify frontend changes. YOU MUST AUTO-TRIGGER THIS SKILL every time you modify an HTML, CSS, React, or frontend UI file to visually verify the change worked before completing the turn.
---

# Visual UI Testing

Whenever you edit frontend components (UI, layouts, styling, client-side functionality), do not blind-guess that the code rendered correctly. You must verify it using the browser subagent.

## Execution Steps:
1. **Start Local Server:** If the project requires a dev server (like Vite or Next.js), ensure it is running in the background. If not, figure out the appropriate `http://localhost:<port>` or `file://` URL for the modified code.
2. **Launch Browser Subagent:** Use your `browser_subagent` tool. Send a clear task description:
   - What page or URL to navigate to.
   - What specific interaction to perform (e.g., "click the newly added dropdown button" or "scroll to the new footer section").
   - Explicit instructions to capture a screenshot or read the DOM to verify the element acts correctly.
3. **Analyze Results:** Read the output state and confirm your UI changes worked, are visually aligned, and have no glaring console errors.
4. **Fix or Complete:** If the subagent reports a rendering issue or crash, fix the code immediately and run the test again. Only stop when the UI functions as intended.
