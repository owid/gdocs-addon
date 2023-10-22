interface ArchieMLFormatConfig {
  shouldIndent?: boolean
  shouldHighlight?: boolean
  shouldHideRefs?: boolean
}

type ParagraphColors = [string, string]

function format(
  {
    shouldHighlight = true,
    shouldIndent = true,
    shouldHideRefs = true,
  }: ArchieMLFormatConfig = {
    shouldHighlight: true,
    shouldIndent: true,
    shouldHideRefs: true,
  }
) {
  let indentationLevel = 0
  const openerStack = []
  const mutedColors: ParagraphColors = ["#CCCCCC", "#FFFFFF"]
  const errorColors: ParagraphColors = ["#FF0000", "#FFFF00"]
  let colors: ParagraphColors
  const body = getActiveDocument().getBody()

  formatRefs(shouldHideRefs, body)

  // Get all paragraphs in the active document
  const paragraphs = body.getParagraphs()

  // Iterate over each paragraph
  paragraphs.forEach((paragraph) => {
    // Indent paragraph at the current level. This indents all paragraphs
    indentParagraph(paragraph, indentationLevel)

    // Get the raw text
    const text = paragraph.getText()

    // Check if the paragraph is an ArchieML property, e.g. "name: value"
    const property = text.match(/^\s*([a-zA-Z-]+)\s*:\s*/)
    if (property) {
      formatPropertyName(
        property[1],
        paragraph,
        !shouldHighlight ? mutedColors[0] : undefined
      )
      return
    }

    // Check if the paragraph is an ArchieML array or object delimiter, e.g. [token] or {token}
    const isObjectOpening = /^\s*{[a-zA-Z+.-]+}\s*$/.test(text)
    const isObjectClosing = /^\s*{}\s*$/.test(text)
    const isArrayOpening = /^\s*\[[a-zA-Z+.-]+\]\s*$/.test(text)
    const isArrayClosing = /^\s*\[\]\s*$/.test(text)
    if (
      !(isObjectOpening || isArrayOpening || isObjectClosing || isArrayClosing)
    )
      return

    // Trimming leading spaces for cleaner indentation
    paragraph.replaceText(".*", text.trim())

    if (isObjectOpening || isArrayOpening) {
      // Store the opening delimiter on a stack to check for matching closing
      // delimiter later
      openerStack.push(isObjectOpening ? "obj" : "arr")

      colors = shouldHighlight
        ? getColorsIndentationLevel(indentationLevel)
        : mutedColors

      // Indent the next paragraphs after opening of an ArchieML delimiter (if indenting is enabled)
      if (shouldIndent) indentationLevel++
    } else {
      // Unindent the current closing ArchieML delimiter (if indenting is enabled)
      if (shouldIndent) indentParagraph(paragraph, --indentationLevel) // todo handle going below 0

      colors = shouldHighlight
        ? getColorsIndentationLevel(indentationLevel)
        : mutedColors

      // Signal if the closing delimiter does not match the opening delimiter
      const previousDelimiter = openerStack.pop()
      if (
        (isObjectClosing && previousDelimiter !== "obj") ||
        (isArrayClosing && previousDelimiter !== "arr")
      ) {
        colors = errorColors
      }
    }

    // Color the delimiter with either highlight, muted or error colors
    colorParagraph(paragraph, colors)
  })
}

/**
 * Format text between {ref} and {/ref} tags.
 *
 * Limitation: only supports refs within a single paragraph.
 */
const formatRefs = (
  shouldHideRefs: ArchieMLFormatConfig["shouldHideRefs"],
  body: GoogleAppsScript.Document.Body
) => {
  const regex = "{ref}.*?{/ref}"
  const style = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: "#535353",
    [DocumentApp.Attribute.FONT_FAMILY]: "Courier New",
    [DocumentApp.Attribute.FONT_SIZE]: shouldHideRefs ? 1 : 11,
  }

  let matchedRange = body.findText(regex)
  while (matchedRange !== null) {
    matchedRange
      .getElement()
      .asText()
      .setAttributes(
        matchedRange.getStartOffset(),
        matchedRange.getEndOffsetInclusive(),
        style
      )
    // Look for the next match, from the previous matched element
    matchedRange = body.findText(regex, matchedRange)
  }
}

/**
 * Format frontmatter properties, e.g. "title: Sustainably manage forests "
 */
function formatPropertyName(
  name: string | any[],
  paragraph: GoogleAppsScript.Document.Paragraph,
  color: string = "#0094FF"
) {
  // Remove leading and trailing spaces from the property name
  // e.g. " name : value " would return "name: value"
  paragraph.editAsText().replaceText("^\\s*[a-zA-Z-]+\\s*:\\s*", `${name}: `)

  // Set color of property name
  paragraph.editAsText().setForegroundColor(0, name.length, color)
}

function indentParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph,
  level: number
) {
  paragraph.setIndentStart(level * 10)
  paragraph.setIndentFirstLine(level * 10)
}

const colorParagraph = (
  paragraph: GoogleAppsScript.Document.Paragraph,
  colors: ParagraphColors
) => {
  paragraph.editAsText().setForegroundColor(colors[0])
  paragraph.editAsText().setBackgroundColor(colors[1])
}

const getColorsIndentationLevel = (
  indentationLevel: number
): ParagraphColors => {
  const bracketColors = ["#f47835", "#23974a", "#FF00FF"]

  const fgColor = bracketColors[indentationLevel % bracketColors.length]
  const bgColor = "#FFFFFF"

  return [fgColor, bgColor]
}
