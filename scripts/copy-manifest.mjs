// Copies the Apps Script manifest into dist, which clasp pushes.
// With --watch, copies it again whenever appsscript.json changes (used by `npm run dev`).
import { cpSync, mkdirSync, watch } from "node:fs"

function copyManifest() {
  mkdirSync("dist", { recursive: true })
  cpSync("appsscript.json", "dist/appsscript.json")
  console.log("Copied appsscript.json to dist/")
}

copyManifest()

if (process.argv.includes("--watch")) {
  // Watch the folder, not the file: editors often save by replacing the file,
  // and a watcher on the file itself stops seeing changes after that.
  watch(".", (_event, filename) => {
    if (filename === "appsscript.json") copyManifest()
  })
  console.log("Watching appsscript.json for changes…")
}
