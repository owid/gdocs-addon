import { render } from "preact"
import { FormatCard } from "./Format"

function App() {
  return (
    <div>
      <FormatCard />
    </div>
  )
}

render(<App />, document.getElementById("app"))
