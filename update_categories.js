const fs = require('fs');

let content = fs.readFileSync('lib/data.ts', 'utf8');

// A simple regex approach to add category: 'Accessories' to small items
// Let's first parse it or just use regex on the price line to determine if we should add category
// Actually, it's easier to just do it via regex replace
content = content.replace(/brand: 'Apple'/g, "brand: 'Apple',\n    category: 'MacBook'");
content = content.replace(/brand: 'Starlink'/g, "brand: 'Starlink',\n    category: 'Networking'");
content = content.replace(/brand: 'Samsung'/g, "brand: 'Samsung',\n    category: 'Smartphone'");
content = content.replace(/brand: 'Dell'/g, "brand: 'Dell',\n    category: 'Laptops'");

// For accessories specifically (Apple Pencil, Magic Mouse, USB-C, AirPods, etc.)
const accessories = ['Apple Pencil', 'Magic Mouse', 'Anker', 'AirPods', 'Adapter', 'Cable', 'Case', 'Charger'];
accessories.forEach(acc => {
  const regex = new RegExp(`(title: '.*${acc}.*',\\n[\\s\\S]*?brand: '.*')`, 'g');
  content = content.replace(regex, "$1,\n    category: 'Accessories'");
});

fs.writeFileSync('lib/data.ts', content);
