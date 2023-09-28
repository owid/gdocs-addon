import { render } from "preact"
import { Button } from "antd"

function App() {
  return (
    <div>
      <Button onClick={() => google.script.run.format()}>Format</Button>
    </div>
  )
}

render(<App />, document.getElementById("app"))
