import {
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  CardActions,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Alert,
} from "@mui/material"
import { useState } from "preact/hooks"

enum Highlighting {
  visible = "visible",
  muted = "muted",
}

enum Indentation {
  indented = "indent",
  left = "left",
}

enum RefsSize {
  default = "default",
  large = "large",
}

export const FormatCard = () => {
  const [highlighting, setHighlighting] = useState(Highlighting.visible)
  const [indentation, setIndentation] = useState(Indentation.indented)
  const [refsSize, setRefsSize] = useState(RefsSize.default)

  return (
    <Card sx={{ maxWidth: 345, mb: 1 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Format
        </Typography>
        <FormControl>
          <FormLabel id="format-highlighting__label">
            Tags highlighting
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="format-highlighting__label"
            value={highlighting}
            onChange={(e) => setHighlighting(e.target.value as Highlighting)}
          >
            <FormControlLabel
              value={Highlighting.visible}
              control={<Radio />}
              label="Visible"
            />
            <FormControlLabel
              value={Highlighting.muted}
              control={<Radio />}
              label="Muted"
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="format-indentation__label">Indentation</FormLabel>
          <RadioGroup
            row
            aria-labelledby="format-indentation__label"
            value={indentation}
            onChange={(e) => setIndentation(e.target.value as Indentation)}
          >
            <FormControlLabel
              value={Indentation.indented}
              control={<Radio />}
              label="Indented"
            />
            <FormControlLabel
              value={Indentation.left}
              control={<Radio />}
              label="Left aligned"
            />
          </RadioGroup>
        </FormControl>
        {(highlighting !== Highlighting.visible ||
          indentation !== Indentation.indented) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Highlighting and indentation help revealing missing or erroneous
            closing tags.
          </Alert>
        )}

        <FormControl>
          <FormLabel id="refs-size__label">Refs size</FormLabel>
          <RadioGroup
            row
            aria-labelledby="refs-size__label"
            value={refsSize}
            onChange={(e) => setRefsSize(e.target.value as RefsSize)}
          >
            <FormControlLabel
              value={RefsSize.default}
              control={<Radio />}
              label="Default"
            />
            <FormControlLabel
              value={RefsSize.large}
              control={<Radio />}
              label="Large"
            />
          </RadioGroup>
        </FormControl>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          onClick={() =>
            google.script.run.format({
              shouldIndent: indentation === Indentation.indented,
              shouldHighlight: highlighting === Highlighting.visible,
              shouldHideRefs: refsSize === RefsSize.default,
            })
          }
        >
          Format
        </Button>
      </CardActions>
    </Card>
  )
}
