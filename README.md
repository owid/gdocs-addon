Google Docs add-on to help authoring ArchieML documents.

## Usage

1. Install add-on: https://workspace.google.com/u/0/marketplace/app/owid_gdocs_addon/1057307484625
2. Open a Google Doc with ArchieML content
3. Extensions > Our World in Data > Format ArchieML

## Development

### Installation

This repo uses [clasp](https://github.com/google/clasp) to sync code with scripts.google.com.

1. Clone this repository
2. `npm i`
3. Enable the Google Apps Script API: https://script.google.com/home/usersettings
4. Login to clasp: `npx clasp login`

### Local development (sidebar)

- `npm run sidebarDev` to start the local Vite dev server. This is helpful for quickly iterating on the visual components of the sidebar. Remote calls to Google Apps Script functions (e.g. `format()`) will not work.

### Testing on a document

- `npx clasp open` to open the script in the browser
- Click Deploy > Test Deployments
- Select Version: "Latest code", Enabled: "true"
- Click "Execute" to open the sample document with the extension in its HEAD version
- `npm run dev` to start the sidebar Vite build watcher and upload local changes to scripts.google.com (HEAD deployment, doesn't impact end users).

## Public deployment

- `npx clasp deploy` (make a note of the version number)
- Enter the new version number in "Docs Add-on script version" on the [App Configuration page of the Google Workspace Marketplace SDK](https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=owid-gdocs-addon).
- Hit "Save"

### Project links

- Apps Script: [edit in browser](https://script.google.com/home/projects/1WTxohPC8-ppgQ2Alrvum4W8P_zIXN988kD9DVBbfE86G4DgxKtjoxxd-/edit)
- Google Cloud Platform: [owid-gdocs-addon project](https://console.cloud.google.com/home/dashboard?project=owid-gdocs-addon)
