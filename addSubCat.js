const fs = require('fs');
let content = fs.readFileSync('d:/ECOMMERWEBSITE_Cream/assets/assets.js', 'utf8');

// Add subCategory right after category field
content = content.replace(/(category:\s*"SkinCare",)/g, '$1\n        subCategory: "SkinCare_Item",');

// Replace placeholder with actual logic based on name
// This is a bit tricky with regex alone, let's use a regex that matches the whole object block
// Actually, it's easier to just match name and replace the placeholder
// Let's re-read and parse instead

const ast_like_replacement = () => {
    let result = content;
    const matches = Array.from(result.matchAll(/name:\s*"([^"]+)"[\s\S]*?category:\s*"SkinCare"/g));

    // reset content
    let finalContent = fs.readFileSync('d:/ECOMMERWEBSITE_Cream/assets/assets.js', 'utf8');

    // We will do a generic replacement:
    finalContent = finalContent.replace(/(name:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)",)/g, (match, fullMatch, name, category) => {
        if (category === "SkinCare") {
            const sub = name.toLowerCase().includes("serum") ? "Serums" : "Creams";
            return fullMatch + `\n        subCategory: "${sub}",`;
        }
        return fullMatch;
    });

    fs.writeFileSync('d:/ECOMMERWEBSITE_Cream/assets/assets.js', finalContent);
}

ast_like_replacement();
console.log("Subcategories injected into assets.js");
