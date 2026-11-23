YOUR PERSONAL STUDIO WEBSITE — STARTER PROJECT
================================================

This is an original, editable portfolio starter inspired by the broad idea of an expandable, multi-section portfolio. It does not include PMC Studios' logo, artwork, wording, photographs or fonts.

WHAT IS INCLUDED
----------------
index.html                 The website structure and section layout.
site-content.json          Main content, project cards, links and colours.
editor.html                Built-in editor for your website content.
assets/style.css           All visual design, responsive layout and animations.
assets/site.js             Website interactions and content loading.
assets/editor.css          Styling for the built-in editor.
assets/editor.js           Editor behaviour, import and export.
assets/favicon.svg         Original starter icon.
start.bat                  Starts a local web server on Windows.

RUN IT ON WINDOWS
-----------------
1. Extract the ZIP into a folder, for example Documents\My Website.
2. Double-click start.bat.
3. A browser should open at http://localhost:8000.
4. The first time, Windows may ask which app to use for the .bat file. Choose Command Prompt / Terminal.
5. Keep the black terminal window open while testing the site. Close it to stop the server.

If the start.bat file cannot find Python, install Python 3 from https://www.python.org/downloads/ and tick "Add Python to PATH" during setup. Alternatively, open a terminal in this folder and run:

    py -m http.server 8000

OPEN THE BUILT-IN EDITOR
------------------------
While the local server is running, visit:

    http://localhost:8000/editor.html

Use the Quick editor for the most common changes: brand name, email, headings, paragraphs, interests, project cards, social links and section colours.

Use Full configuration to edit every value in site-content.json. The JSON contains:
- brand details
- all section headings and text
- about paragraphs and tags
- project cards and their links
- social links
- all panel colours

SAVE AND PUBLISH CHANGES
------------------------
1. In editor.html, make your changes.
2. Click SAVE PREVIEW ON THIS COMPUTER to preview them in this browser. This uses local browser storage; it does not alter the original JSON file.
3. Click DOWNLOAD CONFIG to download an updated site-content.json.
4. Copy that downloaded file into your website folder, replacing the existing site-content.json.
5. Refresh the site. The new content is now part of the project and can be uploaded to your web host.

EDIT THE DESIGN AND BEHAVIOUR
-----------------------------
- Change layout, typography, spacing, panel sizes, mobile behaviour and colours in assets/style.css.
- Change interactions, keyboard navigation, project rendering and content loading in assets/site.js.
- Change the structure of the pages and sections in index.html.
- Change every text value, project, external link and theme colour in site-content.json or through editor.html.

OPEN IN VISUAL STUDIO CODE
--------------------------
1. Install Visual Studio Code: https://code.visualstudio.com/
2. In VS Code choose File > Open Folder.
3. Select the extracted website folder.
4. The files listed above will appear on the left. Edit and save them as needed.

IMPORTANT NOTES
---------------
- The built-in editor is a content/configuration editor, not a drag-and-drop page builder. For complete design changes, edit the HTML and CSS in VS Code.
- The project is static and has no database, login system, paid API or subscription requirement.
- The website uses built-in system fonts and does not rely on external font services or third-party scripts.
- The contact link opens the visitor's email app. To receive messages, change brand.email to your real address.
- Replace all starter text, placeholder links and project descriptions before publishing.
- Do not upload private information into the website files.

HOSTING
-------
The project can be deployed as a static site to GitHub Pages, Cloudflare Pages or another static web host. If you use GitHub Pages, upload the project files (not the ZIP itself) to a repository and enable Pages in the repository settings. For Cloudflare Pages, create a Pages project and upload the extracted files or connect a Git repository.
