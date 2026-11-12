// Builds, pushes and creates a new Apps Script version of the add-on.
// Users only get it once that version number is entered in the Marketplace SDK (see README).
import { execSync } from "node:child_process"

// Every release moves this same deployment to the new version, as Google recommends,
// instead of creating a new deployment each time.
const DEPLOYMENT_ID =
  "AKfycbx5AUH01QY7MXmjoaE-Q6opgSpLVFMvtY-n4a3l08pmcXSHE2iUFSqwm3oVJToGSMD7"
const DEPLOYMENT_NAME = "Marketplace"

const MARKETPLACE_SDK_URL =
  "https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=owid-gdocs-addon"

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim()
}

// Runs a clasp command with JSON output and returns the parsed result
function clasp(args) {
  const output = run(`npx clasp --json ${args}`)
  return JSON.parse(output.slice(output.indexOf("{")))
}

// The release is built from local files, so they must match a commit
if (run("git status --porcelain") !== "") {
  console.error("Commit or stash your changes before releasing.")
  process.exit(1)
}

const commit = run("git rev-parse --short HEAD")
const subject = run("git log -1 --format=%s")

execSync("npm run push", { stdio: "inherit" })

// 1. Create the version, labeled with the commit it was built from
const { versionNumber } = clasp(
  `version ${JSON.stringify(`${commit} ${subject}`)}`
)

// 2. Move the deployment to it, keeping the deployment's name
clasp(
  `deploy -i ${DEPLOYMENT_ID} -V ${versionNumber} -d ${JSON.stringify(DEPLOYMENT_NAME)}`
)

console.log(`
Created version ${versionNumber} from ${commit}, and moved the "${DEPLOYMENT_NAME}" deployment to it.
Last step, by hand: enter ${versionNumber} as "Docs Add-on script version" on
${MARKETPLACE_SDK_URL}
and click Save.`)
