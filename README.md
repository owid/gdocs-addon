Google Docs add-on to help authoring ArchieML documents.

## Usage

1. Install add-on through the https://workspace.google.com/u/0/marketplace/mydomainapps
2. Open a Google Doc with ArchieML content
3. Extensions > Our World in Data > Format ArchieML

## Development

### Installation

This repo uses [clasp](https://github.com/google/clasp) to sync code with scripts.google.com.

1. Clone this repository
2. Install clasp: `npm install -g @google/clasp`
3. Enable the Google Apps Script API: https://script.google.com/home/usersettings
4. Login to clasp: `clasp login`

### Local development (sidebar)

- `npm run dev`: start the local Vite dev server. This is helpful for quickly iterating on the visual components of the sidebar.

### Testing on staging

- `clasp open`: open the script in the browser
- `npm run buildAndDeployHead`: upload local changes to scripts.google.com (head deployment, doesn't impact end users)
- `clasp pull`: download updates from scripts.google.com

To test against a sample document:

- Open [script](https://script.google.com/home/projects/1WTxohPC8-ppgQ2Alrvum4W8P_zIXN988kD9DVBbfE86G4DgxKtjoxxd-/edit)
- Click Deploy > Test Deployments
- Select Version: "Latest code", Enabled: "true"
- Click "Execute" to open the sample document with the extension in its HEAD version

### Deployment

- `clasp deploy` (make a note of the version number)
- Enter the new version number in "Docs Add-on script version" on the [App Configuration page of the Google Workspace Marketplace SDK](https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=owid-gdocs-addon).
- Hit "Save"

### Project links

- Apps Script: [edit in browser](https://script.google.com/home/projects/1WTxohPC8-ppgQ2Alrvum4W8P_zIXN988kD9DVBbfE86G4DgxKtjoxxd-/edit)
- Google Cloud Platform: [owid-gdocs-addon project](https://console.cloud.google.com/home/dashboard?project=owid-gdocs-addon)
