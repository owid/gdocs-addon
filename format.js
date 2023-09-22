function main() {
  format();
}

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu().addItem("Format ArchieML", "format").addToUi();
}

function getActiveDocument() {
  const doc = DocumentApp.getActiveDocument();
  if (doc) return doc;

  // If no active document, return a test document (for debugging)
  return DocumentApp.openByUrl(
    "https://docs.google.com/document/d/1GkNzLQKD5L-KVzNANoOemztyXRM_3mS5fsyu5bawDOU/edit"
  );
}

function format() {
  // Get all paragraphs in the active document
  const paragraphs = getActiveDocument().getBody().getParagraphs();

  let indentationLevel = 0;
  const openerStack = [];

  // Iterate over each paragraph
  paragraphs.forEach((paragraph) => {
    // Indent paragraph at the current level. This indents all paragraphs
    indentParagraph(paragraph, indentationLevel);

    // Get the raw text
    const text = paragraph.getText();

    // Check if the paragraph is an ArchieML property, e.g. "name: value"
    const property = text.match(/^\s*([a-zA-Z-]+)\s*:\s*/);
    if (property) {
      formatPropertyName(property[1], paragraph);
      return;
    }

    // Check if the paragraph is an ArchieML array or object delimiter, e.g. [token] or {token}
    const isObjectOpening = /^\s*{[a-zA-Z+.-]+}\s*$/.test(text);
    const isObjectClosing = /^\s*{}\s*$/.test(text);
    const isArrayOpening = /^\s*\[[a-zA-Z+.-]+\]\s*$/.test(text);
    const isArrayClosing = /^\s*\[\]\s*$/.test(text);
    if (
      !(isObjectOpening || isArrayOpening || isObjectClosing || isArrayClosing)
    )
      return;

    // Trimming leading spaces for cleaner indentation
    paragraph.replaceText(".*", text.trim());

    if (isObjectOpening || isArrayOpening) {
      // Store the opening delimiter on a stack to check for matching closing
      // delimiter later
      openerStack.push(isObjectOpening ? "obj" : "arr");

      colorIndentedParagraph(paragraph, indentationLevel);
      // Indent the next paragraphs after opening of an ArchieML delimiter
      indentationLevel++;
    } else {
      // Unindent the current closing ArchieML delimiter
      indentParagraph(paragraph, --indentationLevel); // todo handle going below 0
      colorIndentedParagraph(paragraph, indentationLevel);

      // Signal if the closing delimiter does not match the opening delimiter
      const previousDelimiter = openerStack.pop();
      if (
        (isObjectClosing && previousDelimiter !== "obj") ||
        (isArrayClosing && previousDelimiter !== "arr")
      ) {
        paragraph.setForegroundColor("#FF0000");
      }
    }
  });
}

function formatPropertyName(name, paragraph) {
  // Remove leading and trailing spaces from the property name
  // e.g. " name : value " would return "name: value"
  paragraph.editAsText().replaceText("^\\s*[a-zA-Z-]+\\s*:\\s*", `${name}: `);

  // Set color of property name
  paragraph.editAsText().setForegroundColor(0, name.length, "#0094FF");
}

function indentParagraph(paragraph, level) {
  paragraph.setIndentStart(level * 10);
  paragraph.setIndentFirstLine(level * 10);
}

// Color ArchieML delimiters based on indentation level
const colorIndentedParagraph = (paragraph, indentationLevel) => {
  const bracketColors = ["#f47835", "#23974a", "#FF00FF"];

  paragraph.setForegroundColor(
    bracketColors[indentationLevel % bracketColors.length]
  );
};
