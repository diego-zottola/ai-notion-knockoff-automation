// Regenerates the synthetic clipboard fixtures in this folder: `node data/clipboard/build-fixtures.mjs`.
// The output is committed so tests never depend on this script at run time. Everything here is invented content:
// no private documents, names or credentials.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = (name, content) => {
  mkdirSync(dirname(join(here, name)), { recursive: true });
  writeFileSync(join(here, name), content);
};

// ---- tiny solid-colour PNGs (valid files, generated with zlib) -------------------------------------------------
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = buf => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type), data]);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
};
function png(width, height, [r, g, b]) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: width }, () => [r, g, b]).flat())]);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const IMAGES = { red: png(24, 16, [200, 40, 40]), green: png(24, 16, [40, 160, 70]), blue: png(24, 16, [40, 80, 200]) };
for (const [name, data] of Object.entries(IMAGES)) writeFileSync(join(here, `images-${name}.png`), data);
const uri = name => `data:image/png;base64,${IMAGES[name].toString('base64')}`;

// ---- representative page: headings, inline styles, colours, links, quote, lists --------------------------------
const rich = {
  html: `<h1>Title one QA</h1>
<p>Paragraph with <strong>bold</strong>, <em>italic</em>, <s>strike</s> and <a href="https://example.com/doc">a safe link</a>.</p>
<h2>Title two QA</h2>
<p>Text with <span style="color: #cc0000">red colour</span> and <span style="color: #0000cc">blue colour</span>.</p>
<h3>Title three QA</h3>
<blockquote>Test quote QA</blockquote>
<ol><li>First numbered</li><li>Second numbered</li></ol>
<ul><li>Bullet one<ul><li>Bullet child<ul><li>Bullet grandchild</li></ul></li></ul></li><li>Bullet two</li></ul>
<p>Document closing QA</p>`,
  md: `# Title one QA

Paragraph with **bold**, *italic*, ~~strike~~ and [a safe link](https://example.com/doc).

## Title two QA

Text with red colour and blue colour.

### Title three QA

> Test quote QA

1. First numbered
2. Second numbered

- Bullet one
  - Bullet child
    - Bullet grandchild
- Bullet two

Document closing QA
`,
};
rich.txt = `Title one QA
Paragraph with bold, italic, strike and a safe link.
Title two QA
Text with red colour and blue colour.
Title three QA
Test quote QA
First numbered
Second numbered
Bullet one
Bullet child
Bullet grandchild
Bullet two
Document closing QA
`;
out('rich-page.html', rich.html + '\n'); out('rich-page.md', rich.md); out('rich-page.txt', rich.txt);

// ---- tables ---------------------------------------------------------------------------------------------------
const tables = {
  html: `<table><thead><tr><th>Key</th><th>Value</th><th>Note</th></tr></thead><tbody>
<tr><td>One</td><td><strong>Two</strong><br>Three</td><td></td></tr>
<tr><td></td><td><em>Italic cell</em></td><td><a href="https://example.com/celda">Link cell</a></td></tr>
<tr><td>End</td><td></td><td>Last</td></tr></tbody></table>
<p>Text after the table QA</p>`,
  md: `| Key | Value | Note |
| --- | --- | --- |
| One | **Two** | |
| | *Italic cell* | [Link cell](https://example.com/celda) |
| End | | Last |

Text after the table QA
`,
  txt: 'Key\tValue\tNote\nOne\tTwo\n\t\nEnd\t\tLast\n\nText after the table QA\n',
};
out('tables.html', tables.html + '\n'); out('tables.md', tables.md); out('tables.txt', tables.txt);

// ---- code and Mermaid -----------------------------------------------------------------------------------------
const MERMAID = 'flowchart LR\n  A[Start] --> B[Process]\n  B --> C[End]';
const code = {
  html: `<p>Before the code QA</p>
<pre><code class="language-javascript">const total = [1, 2, 3].reduce((a, b) => a + b, 0);
console.log(total);</code></pre>
<pre><code class="language-mermaid">${MERMAID}</code></pre>
<p>After the diagram QA</p>`,
  md: `Before the code QA

\`\`\`javascript
const total = [1, 2, 3].reduce((a, b) => a + b, 0);
console.log(total);
\`\`\`

\`\`\`mermaid
${MERMAID}
\`\`\`

After the diagram QA
`,
  txt: `Before the code QA\nconst total = [1, 2, 3].reduce((a, b) => a + b, 0);\nconsole.log(total);\n${MERMAID}\nAfter the diagram QA\n`,
};
out('code-mermaid.html', code.html + '\n'); out('code-mermaid.md', code.md); out('code-mermaid.txt', code.txt);
out('mermaid-valid.mmd', MERMAID + '\n');
out('mermaid-invalid.html', '<pre><code class="language-mermaid">flowchart LR\n  A[Start --> ((B\n  this is not a valid diagram</code></pre>\n');

// ---- text before / between / after images -----------------------------------------------------------------
const images = {
  html: `<p>Text before the image QA</p>
<p><img src="${uri('red')}" alt="red.png"></p>
<p>Text between images QA</p>
<p><img src="${uri('green')}" alt="green.png"></p>
<p>Text after the images QA</p>`,
  md: `Text before the image QA

![red.png](images-red.png)

Text between images QA

![green.png](images-green.png)

Text after the images QA
`,
  txt: 'Text before the image QA\nText between images QA\nText after the images QA\n',
};
out('images.html', images.html + '\n'); out('images.md', images.md); out('images.txt', images.txt);
out('images-inline.html', `<p>Before <img src="${uri('blue')}" alt="blue.png"> after in the same paragraph QA</p>\n`);

// ---- large page: 90 identified, ordered blocks -----------------------------------------------------------------
const pad = n => String(n).padStart(3, '0');
const LARGE = 90;
const large = Array.from({ length: LARGE }, (_, i) => {
  const id = pad(i + 1);
  if (i % 15 === 0) return { html: `<h2>Section ${id} QA</h2>`, md: `## Section ${id} QA`, txt: `Section ${id} QA`, text: `Section ${id} QA` };
  if (i % 7 === 3) return { html: `<ul><li>Item ${id} QA</li></ul>`, md: `- Item ${id} QA`, txt: `Item ${id} QA`, text: `Item ${id} QA` };
  return { html: `<p>Block ${id} QA with <strong>bold</strong></p>`, md: `Block ${id} QA with **bold**`, txt: `Block ${id} QA with bold`, text: `Block ${id} QA with bold` };
});
out('large-page.html', large.map(b => b.html).join('\n') + '\n');
out('large-page.md', large.map(b => b.md).join('\n\n') + '\n');
out('large-page.txt', large.map(b => b.txt).join('\n') + '\n');
out('large-page.expected.json', JSON.stringify(large.map(b => b.text), null, 2) + '\n');

// ---- edge cases -----------------------------------------------------------------------------------------------
out('edge/malformed.html', '<p>Open paragraph QA <strong>unclosed bold<p>Second paragraph QA</em></div><ul><li>Unclosed item QA<li>Another item QA</ul><h2>Broken title QA\n');
out('edge/unsafe-links.html', `<p><a href="javascript:alert(1)">Javascript link QA</a></p>
<p><a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Data link QA</a></p>
<p><a href="vbscript:msgbox(1)">Vbscript link QA</a></p>
<p><a href="file:///etc/passwd">File link QA</a></p>
<p><a href="https://example.com/seguro">Safe link QA</a></p>
<p><a href="mailto:qa@example.test">Safe mail QA</a></p>
<p onclick="alert(1)">Paragraph with event QA<script>window.__xss = true</script></p>
`);
out('edge/external-image.html', `<p>Before the external image QA</p>
<p><img src="https://images.example.test/external-photo.png" alt="External photo QA"></p>
<p>After the external image QA</p>
`);
out('edge/page-icon-and-unsupported.html', '<p>Text with <u>underline</u> and <mark>mark</mark> QA</p><details><summary>Summary QA</summary>Detail QA</details>\n');

// ---- attachments ----------------------------------------------------------------------------------------------
out('attachments/reporte-qa.txt', 'Synthetic report QA\nline two\n');
out('attachments/datos-qa.csv', 'id,name\n1,One\n2,Two\n');
out('attachments/script-qa.exe', 'MZ-not-a-real-executable\n');
out('attachments/pagina-qa.html', '<html><body>Not allowed</body></html>\n');

// ---- manual copy page --------------------------------------------------------------------------------------------
const section = (id, title, body) => `<section id="${id}"><h2 class="meta">${title}</h2><div class="sample" data-sample="${id}">${body}</div></section>`;
const manual = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Manual copy reference page (QA)</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 52rem; margin: 2rem auto; padding: 0 1rem; }
  .meta { color: #555; } .sample { border: 1px solid #bbb; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; }
  table { border-collapse: collapse; } td, th { border: 1px solid #999; padding: .25rem .5rem; }
  img { vertical-align: middle; } pre { background: #f4f4f4; padding: .5rem; overflow-x: auto; }
  .steps { background: #eef6ff; border-radius: 6px; padding: 1rem; }
</style></head>
<body>
<h1>Manual copy reference page</h1>
<div class="steps">
  <p><strong>How to use it.</strong> 1) Select the content of <em>#copy-source</em> (or use the "Select all" button).
  2) Copy with Cmd/Ctrl+C. 3) Paste with Cmd/Ctrl+V into a test page of the editor. 4) Compare against the list below.</p>
  <button type="button" id="select-all">Select all</button>
  <p>Expected after pasting: H1-H3 headings, bold, italic, strike, colours, safe link, quote, numbered list, indented bullets,
  table with header and empty cells, code, rendered Mermaid diagram, and Text &rarr; image &rarr; Text in that order.
  All content is synthetic; it contains no real data.</p>
</div>
<div id="copy-source">
${section('rich', 'Formatted text', rich.html)}
${section('tables', 'Tables', tables.html)}
${section('code', 'Code and Mermaid', code.html)}
${section('images', 'Text and images', images.html)}
</div>
<script>document.getElementById('select-all').addEventListener('click', () => {
  const range = document.createRange(); range.selectNodeContents(document.getElementById('copy-source'));
  const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
});</script>
</body></html>
`;
out('manual-copy.html', manual);
console.log('fixtures written to', here);
