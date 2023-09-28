function main() {
  format()
}

function onOpen(e: any) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Open", "showSidebar")
    .addItem("Format ArchieML", "format")
    .addToUi()
}

function showSidebar() {
  const html =
    HtmlService.createHtmlOutputFromFile("sidebar/index").setTitle("OWID Gdocs")
  DocumentApp.getUi().showSidebar(html)
}

function getActiveDocument() {
  const doc = DocumentApp.getActiveDocument()
  if (doc) return doc

  // If no active document, return a test document (for debugging)
  return DocumentApp.openByUrl(
    "https://docs.google.com/document/d/1GkNzLQKD5L-KVzNANoOemztyXRM_3mS5fsyu5bawDOU/edit"
  )
}

function format() {
  // Get all paragraphs in the active document
  const paragraphs = getActiveDocument().getBody().getParagraphs()

  let indentationLevel = 0
  const openerStack = []

  // Iterate over each paragraph
  paragraphs.forEach((paragraph) => {
    // Indent paragraph at the current level. This indents all paragraphs
    indentParagraph(paragraph, indentationLevel)

    // Get the raw text
    const text = paragraph.getText()

    // Check if the paragraph is an ArchieML property, e.g. "name: value"
    const property = text.match(/^\s*([a-zA-Z-]+)\s*:\s*/)
    if (property) {
      formatPropertyName(property[1], paragraph)
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

      colorIndentedDelimiter(paragraph, indentationLevel)
      // Indent the next paragraphs after opening of an ArchieML delimiter
      indentationLevel++
    } else {
      // Unindent the current closing ArchieML delimiter
      indentParagraph(paragraph, --indentationLevel) // todo handle going below 0
      colorIndentedDelimiter(paragraph, indentationLevel)

      // Signal if the closing delimiter does not match the opening delimiter
      const previousDelimiter = openerStack.pop()
      if (
        (isObjectClosing && previousDelimiter !== "obj") ||
        (isArrayClosing && previousDelimiter !== "arr")
      ) {
        colorIndentedDelimiter(paragraph, indentationLevel, true)
      }
    }
  })
}

function formatPropertyName(
  name: string | any[],
  paragraph: GoogleAppsScript.Document.Paragraph
) {
  // Remove leading and trailing spaces from the property name
  // e.g. " name : value " would return "name: value"
  paragraph.editAsText().replaceText("^\\s*[a-zA-Z-]+\\s*:\\s*", `${name}: `)

  // Set color of property name
  paragraph.editAsText().setForegroundColor(0, name.length, "#0094FF")
}

function indentParagraph(
  paragraph: GoogleAppsScript.Document.Paragraph,
  level: number
) {
  paragraph.setIndentStart(level * 10)
  paragraph.setIndentFirstLine(level * 10)
}

// Color ArchieML delimiters based on indentation level
const colorIndentedDelimiter = (
  paragraph: GoogleAppsScript.Document.Paragraph,
  indentationLevel: number,
  isError = false
) => {
  const bracketColors = ["#f47835", "#23974a", "#FF00FF"]

  const fgColor = isError
    ? "#FF0000"
    : bracketColors[indentationLevel % bracketColors.length]
  const bgColor = isError ? "#FFFF00" : "#FFFFFF"

  paragraph.editAsText().setForegroundColor(fgColor)
  paragraph.editAsText().setBackgroundColor(bgColor)
}
