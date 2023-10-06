function annotateRefs() {
  const document = getActiveDocument()
  const selection = document.getSelection()

  // We'll wrap the selected text with {ref} and {/ref} tags. When the selection
  // is not capturing the whole element (aka. partial selection), we need to get
  // the respective start and end offsets of the selection to apply the tags
  // within the element's text, at the edges of the selection. Note that a
  // selection can span multiple elements.
  if (selection) {
    const selectedElements = selection.getRangeElements()

    const firstSelectedElement = selectedElements[0]
    const lastSelectedElement = selectedElements[selectedElements.length - 1]

    const startOffset = firstSelectedElement.isPartial()
      ? firstSelectedElement.getStartOffset()
      : 0

    const endOffset = lastSelectedElement.isPartial()
      ? lastSelectedElement.getEndOffsetInclusive() + 1
      : lastSelectedElement.getElement().asText().getText().length

    lastSelectedElement.getElement().asText().insertText(endOffset, "{/ref}")
    firstSelectedElement.getElement().asText().insertText(startOffset, "{ref}")
  } else {
    // When there is no selection, we'll insert the tags at the cursor position.
    const cursor = document.getCursor()
    const element = cursor.getElement()
    const offset = cursor.getSurroundingTextOffset()

    element.asText().insertText(offset, "{ref}{/ref}")

    // Move the cursor to the middle of the inserted tags
    const position = document.newPosition(element.asText(), offset + 5)
    document.setCursor(position)
  }
}
