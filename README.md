# Wedding Invitation Studio

A static gallery, three wedding invitation demos, and a browser-based editor with live preview.

## Run locally

Open public/index.html in your browser. For an HTTP preview, run python -m http.server 8000 --directory public from the project root, then open http://localhost:8000.

## Publish with GitHub and Netlify

1. Create a GitHub repository. Upload the contents of this project directory so netlify.toml and public/ are at the repository root.
2. In Netlify, select Add new project, then Import an existing project. Connect GitHub and select the repository.
3. Leave the base directory and build command empty. The publish directory is public, as set in netlify.toml.
4. Deploy and open the generated Netlify URL. Check all three samples and open the editor. Create a guest link and test it in a separate browser.
5. Push future edits to the connected branch to update the site.

## Current behavior

Drafts are stored in the browser. Guest URLs contain the invitation details, so share them only with intended recipients. Editing the draft creates a new customized link. The sample RSVP is simulated. Set a WhatsApp number in the editor to receive messages directly. Accounts, payments, and a shared RSVP dashboard require a backend.
