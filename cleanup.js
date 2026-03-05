const fs = require('fs');
let content = fs.readFileSync('d:/ECOMMERWEBSITE_Cream/assets/assets.js', 'utf8');
content = content.replace(/\s*storeId:\s*".*?",/g, '');
content = content.replace(/\s*store:\s*dummyStoreData,/g, '');
fs.writeFileSync('d:/ECOMMERWEBSITE_Cream/assets/assets.js', content);
console.log('Done cleaning assets.js');
