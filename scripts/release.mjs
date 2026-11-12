// Builds, pushes and creates a new Apps Script version of the add-on.
// Users only get it once that version number is entered in the Marketplace SDK (see README).
import { execSync } from "node:child_process"

// Every release updates this same deployment to a new version, as Google recommends,
// instead of creating a new deployment each time.
const DEPLOYMENT_ID =
  "AKfycbx5AUH01QY7MXmjoaE-Q6opgSpLVFMvtY-n4a3l08pmcXSHE2iUFSqwm3oVJToGSMD7"

const MARKETPLACE_SDK_URL =
  "https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=owid-gdocs-addon"

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim()
}

// The release is built from local files, so they must match a commit
if (run("git status --porcelain") !== "") {
  console.error("Commit or stash your changes before releasing.")
  process.exit(1)
}

const commit = run("git rev-parse --short HEAD")
const subject = run("git log -1 --format=%s")

execSync("npm run push", { stdio: "inherit" })

const output = run(
  `npx clasp --json deploy -i ${DEPLOYMENT_ID} -d ${JSON.stringify(`${commit} ${subject}`)}`
)
console.log(output)

const versionNumber = output.match(/"versionNumber":\s*(\d+)/)?.[1]
console.log(`
Created version ${versionNumber ?? "(see output above)"} from ${commit}.
Last step, by hand: enter ${versionNumber ?? "it"} as "Docs Add-on script version" on
${MARKETPLACE_SDK_URL}
and click Save.`)
