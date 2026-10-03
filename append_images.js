const fs = require('fs');

let content = fs.readFileSync('lib/data.ts', 'utf8');

const placeholders = [
  '"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"', // Laptop angled
  '"https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"', // Hardware
  '"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"', // Detail
];

// We will do a simple regex replace to inject the placeholders into the images array.
// Find: "images": [\n      "..."\n    ],
// We can just find `"images": [\n      ".*?"\n    ]` and append to it.

content = content.replace(/"images": \[\s*"(.*?)"\s*\]/g, (match, p1) => {
  return `"images": [\n      "${p1}",\n      ${placeholders[0]},\n      ${placeholders[1]}\n    ]`;
});

fs.writeFileSync('lib/data.ts', content);
console.log('Images added!');
