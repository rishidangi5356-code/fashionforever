const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFtyLpdKtmYG9hx6Hdq8bmbxNYv2WI6OVcoCIwXoOHLEf5zli8DiMQn_89fO0oW5q0fC0Fp2qvG4BB/pub?output=csv&cache=" + new Date().getTime();
window.allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
        download: true, header: true, skipEmptyLines: true,
        complete: function (results) {
            const MY_APP = "Products-568582963"; 
            const MY_TABLE = "Products"; 

            window.allProducts = results.data.map(p => {
                const fix = (val) => {
                    const s = String(val || "").trim();
                    if (s.includes("/") && (s.toLowerCase().includes(".jpg") || s.toLowerCase().includes(".png") || s.toLowerCase().includes(".jpeg"))) {
                        return `https://www.appsheet.com/template/gettablefileurl?appName=${MY_APP}&tableName=${MY_TABLE}&fileName=${encodeURIComponent(s)}`;
                    }
                    return null;
                };

                // Image columns scan
                let imgs = [fix(p['front image']), fix(p['image1']), fix(p['image2']), fix(p['image3']), fix(p['link1']), fix(p['link2']), fix(p['link3'])]
                           .filter(url => url !== null);

                return {
                    id: String(p['id'] || "").trim(),
                    name: String(p['name'] || "No Name").trim(),
                    type: String(p['type'] || "").trim(), 
                    category: String(p['category'] || "").trim(), 
                    // NEW: Size mapping added here (small letters & trimmed)
                    size: String(p['size'] || "").trim().toLowerCase(), 
                    price: Number(p['price']) || 0,
                    oldPrice: Number(p['original price']) || 0, 
                    stock: Number(p['stock']) || 0,
                    isSale: String(p['isSale'] || "").toUpperCase() === "TRUE",
                    description: String(p['description'] || ""),
                    image: imgs[0] || "", 
                    gallery: [...new Set(imgs)] 
                };
            });
            console.log("✅ Data Sync Complete. Products with Category, Type & Sizes Found:", window.allProducts.length);
            window.dispatchEvent(new Event('dataReady'));
        }
    });
});