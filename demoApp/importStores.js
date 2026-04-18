const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { connectDB, Store } = require('./database');

const importStores = async () => {
  try {
    await connectDB();
    
    const geojsonPath = path.join(__dirname, 'public', 'Healthy_Corner_Stores.geojson');
    const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    
    const stores = geojsonData.features.map(feature => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      return {
        name: props.STORE,
        address: props.ADDRESS,
        zipcode: props.ZIPCODE,
        ward: props.WARD,
        anc: props.ANC,
        snapMatch: props.SNAP_MATCH && props.SNAP_MATCH.trim() === 'x',
        wicVendor: props.WIC_VENDOR && props.WIC_VENDOR.trim() === 'x',
        longitude: coords[0],
        latitude: coords[1],
        userAdded: false
      };
    });
    
    // Clear existing stores
    await Store.deleteMany({});
    
    // Insert new stores
    const result = await Store.insertMany(stores);
    console.log(`✓ Imported ${result.length} stores into database`);
    
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
};

importStores();
