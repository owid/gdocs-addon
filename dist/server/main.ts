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
