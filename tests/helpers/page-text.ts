/*
 * Text as a page carries it. React escapes HTML text and attributes; Next
 * writes the page's data for the browser as JSON strings and escapes `&`, `<`,
 * `>` in them (`htmlEscapeJsonString`). A check that text is *not* on a page
 * must look for every form, or it passes when the text is there.
 */

function escapeHtml(text: string, apostrophe: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", apostrophe);
}

function escapeData(text: string): string {
  return JSON.stringify(text)
    .slice(1, -1)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll(" ", "\\u2028")
    .replaceAll(" ", "\\u2029");
}

/** Every form `text` can take in a page: as is, HTML text, an attribute, page data. */
function pageForms(text: string): string[] {
  return [
    text,
    escapeHtml(text, "&#x27;"),
    escapeHtml(text, "&#39;"),
    escapeData(text),
  ];
}

/** Whether the page carries this text in any of its forms. */
export function mentions(body: string, text: string): boolean {
  return pageForms(text).some((form) => body.includes(form));
}
