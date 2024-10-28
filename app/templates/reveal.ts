interface RevealTemplate {
  title: string;
  slides: string[];
  theme?: string;
  transition?: string;
}

export function generateRevealHTML({ title, slides, theme = 'white', transition = 'slide' }: RevealTemplate): string {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reset.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/${theme}.css">
    <style>
      .reveal pre {
        box-shadow: none;
      }
      .reveal h1, .reveal h2, .reveal h3, .reveal h4, .reveal h5, .reveal h6 {
        text-transform: none;
      }
      .reveal .slides {
        text-align: left;
      }
      .reveal .slides section {
        height: 100%;
      }
      .editor-container {
        position: fixed;
        top: 0;
        right: -50%;
        width: 50%;
        height: 100%;
        background: white;
        transition: right 0.3s ease;
        z-index: 1000;
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      }
      .editor-container.open {
        right: 0;
      }
      .editor-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        padding: 8px 16px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .editor-toggle:hover {
        background: #1976d2;
      }
      .preview {
        border: 1px solid #ddd;
        padding: 20px;
        margin: 10px 0;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        ${slides.map(slide => `
          <section>
            ${slide}
          </section>
        `).join('')}
      </div>
    </div>
    <button class="editor-toggle" onclick="toggleEditor()">Edit Slides</button>
    <div class="editor-container">
      <div id="editor" style="width: 100%; height: 100%;"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/highlight/highlight.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>
    <script>
      let editor;
      let currentSlideIndex = 0;

      Reveal.initialize({
        hash: true,
        slideNumber: true,
        transition: '${transition}',
        plugins: [RevealHighlight]
      });

      Reveal.on('slidechanged', event => {
        currentSlideIndex = event.indexh;
        if (editor) {
          const slideContent = event.currentSlide.innerHTML;
          editor.setValue(slideContent);
        }
      });

      function toggleEditor() {
        const container = document.querySelector('.editor-container');
        container.classList.toggle('open');
        
        if (!editor && container.classList.contains('open')) {
          require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
          require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(document.getElementById('editor'), {
              value: Reveal.getCurrentSlide().innerHTML,
              language: 'html',
              theme: 'vs-light',
              minimap: { enabled: false },
              lineNumbers: 'on',
              wordWrap: 'on',
              wrappingIndent: 'same',
              automaticLayout: true
            });

            editor.onDidChangeModelContent(() => {
              const newContent = editor.getValue();
              const currentSlide = Reveal.getCurrentSlide();
              currentSlide.innerHTML = newContent;
            });
          });
        }
      }
    </script>
  </body>
</html>
`}
