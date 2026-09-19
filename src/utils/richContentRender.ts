// src/utils/richContentRender.ts
//
// Question/explanation text is stored as HTML (from RichTextEditor or the
// Word parser). This turns the `<span class="katex-eq" data-latex="...">`
// placeholders into real rendered math, and strips anything that could
// execute script before the HTML is dropped into dangerouslySetInnerHTML.

import katex from 'katex';

export function renderRichContent(html: string): string {
  if (!html) return '';

  const withMath = html.replace(
    /<span class="katex-eq" data-latex="([^"]+)">[^<]*<\/span>/g,
    (_match, encoded: string) => {
      const latex = decodeURIComponent(encoded);
      try {
        return katex.renderToString(latex, { throwOnError: false, output: 'html' });
      } catch {
        return `$${latex}$`;
      }
    }
  );

  // Minimal sanitation: strip script tags and inline event handlers.
  return withMath
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '');
}
