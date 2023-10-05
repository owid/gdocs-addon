import { render } from "preact"
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material"
import { FormatCard } from "./Format"

function App() {
  return (
    <div>
      <FormatCard />
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Annotate
          </Typography>
        </CardContent>
        <CardActions>
          <Box display="flex" alignItems="flex-start">
            <Button
              variant="contained"
              onClick={() => google.script.run.annotateRefs()}
              sx={{ mr: 1, flexShrink: 0 }}
            >
              {`{ref}`}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {`Insert or wrap existing text in {ref} tags.`}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </div>
  )
}

render(<App />, document.getElementById("app"))
