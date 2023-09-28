import { render } from "preact"
import Button from "@mui/material/Button"

function App() {
  return (
    <div>
      <Button variant="contained" onClick={() => google.script.run.format()}>
        Format
      </Button>
    </div>
  )
}

render(<App />, document.getElementById("app"))
