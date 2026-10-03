const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

const productsStr = content.match(/export const mockProducts: Product\[\] = (\[[\s\S]*\]);/)[1];
let products = eval(productsStr);

products = products.map(p => {
  if (p.price < 200000 && !p.is_service) {
    p.category = 'Accessories';
  } else if (!p.category) {
    p.category = 'Hardware';
  }
  return p;
});

const newContent = content.replace(/export const mockProducts: Product\[\] = \[[\s\S]*\];/, 'export const mockProducts: Product[] = ' + JSON.stringify(products, null, 2) + ';');

fs.writeFileSync('lib/data.ts', newContent);
