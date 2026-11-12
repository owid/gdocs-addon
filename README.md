Google Docs add-on to help authoring ArchieML documents.

## Usage

1. Install add-on: https://workspace.google.com/u/0/marketplace/app/owid_gdocs_addon/1057307484625
2. Open a Google Doc with ArchieML content
3. Extensions > OWID Gdocs Add-On > Format ArchieML, to format with the default settings
4. Or Extensions > OWID Gdocs Add-On > Open, to pick the settings in the sidebar and click Format

### Signed in to several Google accounts?

The sidebar's Format button may do nothing if the doc is open in an account that isn't the browser's default one (the first account you signed in to). This is a long-standing Google bug: [issue 69270374](https://issuetracker.google.com/issues/69270374).

To get around it, either:

- use the Format ArchieML menu item, which isn't affected
- or open the doc in a browser profile or incognito window where only your OWID account is signed in

## Development

### Installation

This repo uses [clasp](https://github.com/google/clasp) to sync code with scripts.google.com.

1. Clone this repository
2. `npm i`
3. Enable the Google Apps Script API: https://script.google.com/home/usersettings
4. Login to clasp: `npx clasp login`

### Code layout

- `appsscript.json`: the Apps Script manifest (scopes, runtime)
- `server/`: the Apps Script code, in TypeScript
- `sidebar/`: the sidebar, in Preact
- `dist/`: what clasp pushes, build output only (not in git). `npm run build` copies the manifest, compiles `server/` to `dist/server/*.js` and bundles the sidebar into `dist/sidebar/index.html`.

clasp 3 no longer compiles TypeScript itself, so always push with `npm run push` (or `npm run dev`), which builds first. A bare `npx clasp push` would upload whatever is in `dist/`, stale or missing.

### Local development (sidebar)

- `npm run sidebarDev` to start the local Vite dev server. This is helpful for quickly iterating on the visual components of the sidebar. Remote calls to Google Apps Script functions (e.g. `format()`) will not work.

### Testing on a document

- `npx clasp open-script` to open the script in the browser
- Click Deploy > Test Deployments
- Select Version: "Latest code", Enabled: "true"
- Click "Execute" to open the sample document with the extension in its HEAD version
- `npm run dev` to rebuild the sidebar and server code on every change and upload it to scripts.google.com (HEAD deployment, doesn't impact end users). Refresh the test document to load the new code.

## Public deployment

1. From a clean, up-to-date `main`, run `npm run release`. It builds, pushes and creates a new version of the script, then prints the version number. ([scripts/release.mjs](scripts/release.mjs))
2. Enter that number in "Docs Add-on script version" on the [App Configuration page of the Google Workspace Marketplace SDK](https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=owid-gdocs-addon), then click "Save". Google has no API for this step.

Users get the new version without reinstalling. If you added OAuth scopes in `appsscript.json`, also add them in the Marketplace SDK and the OAuth consent screen ([Google's guide](https://developers.google.com/workspace/add-ons/how-tos/update-published-add-on)).

`npm run release` updates the same deployment each time, as Google recommends, instead of creating a new one like `npx clasp deploy` does.

### Project links

- Apps Script: [edit in browser](https://script.google.com/home/projects/1WTxohPC8-ppgQ2Alrvum4W8P_zIXN988kD9DVBbfE86G4DgxKtjoxxd-/edit)
- Google Cloud Platform: [owid-gdocs-addon project](https://console.cloud.google.com/home/dashboard?project=owid-gdocs-addon)
