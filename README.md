Google Docs add-on to help authoring ArchieML documents.

## Usage

1. Install add-on through the https://workspace.google.com/u/0/marketplace/mydomainapps
2. Open a Google Doc with ArchieML content
3. Extensions > Our World in Data > Format ArchieML

## Development

This repo uses [clasp](https://github.com/google/clasp) to sync code with scripts.google.com.

1. Clone this repository
2. Install clasp: `npm install -g @google/clasp`
3. Enable the Google Apps Script API: https://script.google.com/home/usersettings
4. Login to clasp: `clasp login`

### Commands

- `clasp push`: upload local changes to scripts.google.com
- `clasp pull`: download updates from scripts.google.com
- `clasp open`: open the script in the browser

### Resources

- Apps Script: [edit in browser](https://script.google.com/home/projects/1WTxohPC8-ppgQ2Alrvum4W8P_zIXN988kD9DVBbfE86G4DgxKtjoxxd-/edit)
- Google Cloud Platform: [owid-gdocs-addon project](https://console.cloud.google.com/home/dashboard?project=owid-gdocs-addon)
