const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');

// The main page content is usually inside <div data-elementor-type="wp-page" class="elementor elementor-18"...>
const mainMatch = html.match(/<div data-elementor-type="wp-page"[\s\S]*?<\/main>/i) ||
                 html.match(/<main[\s\S]*?<\/main>/i) ||
                 html.match(/<div class="site-content"[\s\S]*?<\/footer>/i);

const content = mainMatch ? mainMatch[0] : html;

// Find all elements with class containing pls-element or elementor-widget
const widgetMatches = [...content.matchAll(/<div class="[^"]*elementor-widget-([^"\s]+)[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi)];
console.log('Widgets in main content:', widgetMatches.length);

// Let us find each top-level container or section in elementor-18
const containers = [...content.matchAll(/class="elementor-element elementor-element-([a-z0-9]+) e-flex e-con-boxed e-con e-parent"([\s\S]*?)(?=(class="elementor-element elementor-element-[a-z0-9]+ e-flex e-con-boxed e-con e-parent"|<\/main>|<footer))/gi)];
console.log('Parent containers count:', containers.length);

containers.forEach((c, idx) => {
  const text = c[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
  console.log(`\nContainer ${idx + 1} (id ${c[1]}):`, text);
});
