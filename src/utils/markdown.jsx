import React from 'react'

export function renderRichText(text) {
  if (!text) return '';
  
  let html = text;
  
  // Escape HTML entities to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Code Blocks: ```code```
  html = html.replace(/```([\s\S]+?)```/g, (match, p1) => {
    return `<pre class="rich-code-block"><code>${p1.trim()}</code></pre>`;
  });
  
  // Inline Code: `code`
  html = html.replace(/`([^`\n]+?)`/g, '<code class="rich-inline-code">$1</code>');
  
  // Bold: **text**
  html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
  
  // Links: [text](url)
  html = html.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="rich-link">$1</a>');
  
  // Bullets: - item or * item
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/g, '<ul class="rich-list">$1</ul>');
  // Fix double <ul> wrapping
  html = html.replace(/<\/ul>\s*<ul class="rich-list">/g, '');
  
  // Linebreaks
  html = html.replace(/\n/g, '<br />');
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
