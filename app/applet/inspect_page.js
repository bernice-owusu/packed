const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');

// Header
const header = html.match(/<header[\s\S]*?<\/header>/i);
if (header) {
  fs.writeFileSync('header.html', header[0]);
}

// Nav items
const navMatches = [...html.matchAll(/<nav[\s\S]*?<\/nav>/gi)];
console.log('Nav count:', navMatches.length);

// All image urls
const imgRegex = /https:\/\/xmedcar\.presslayouts\.com\/wp-content\/uploads\/[a-zA-Z0-9_\-\.\/]+/g;
const images = [...new Set(html.match(imgRegex) || [])];
console.log('Unique uploads images:', images.length);
fs.writeFileSync('images.json', JSON.stringify(images, null, 2));

// Look for elements with data-widget_type or section classes
const elementorWidgets = [...html.matchAll(/data-widget_type="([^"]+)"/g)].map(m => m[1]);
console.log('Elementor widgets count:', elementorWidgets.length);
console.log('Widgets sample:', [...new Set(elementorWidgets)]);

// Top banner / topbar text
const topbar = html.match(/<div class="[^"]*topbar[^"]*"[\s\S]*?<\/div>\s*<\/div>/i);
if (topbar) {
  console.log('Topbar snippet:', topbar[0].slice(0, 300));
}
