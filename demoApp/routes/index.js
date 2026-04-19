const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const { User, Store, Product, StoreOwner, Supplier, StoreRecommendation } = require("../database");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/base.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signup.html"));
});

router.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/signin.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/profile.html"));
});

router.get("/preferences/:userId", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/preferences.html"));
});

router.get("/add-store", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/add-store.html"));
});

router.get("/recommend-store", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/recommend-store.html"));
});

router.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/add-product.html"));
});

router.get("/store-detail", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store-detail.html"));
});

router.get("/store-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store-dashboard.html"));
});

router.get("/store-signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store-signin.html"));
});

router.get("/store-signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store-signup.html"));
});

router.get("/map", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/map.html"));
});

// Learn Pages - For Customers
router.get("/how-it-works", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/how-it-works.html"));
});

router.get("/dietary-filtering", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dietary-filtering.html"));
});

// Learn Pages - For Corner Stores
router.get("/why-list-your-store", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/why-list-your-store.html"));
});

router.get("/managing-products", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/managing-products.html"));
});

// Learn Pages - For Suppliers
router.get("/partnership-overview", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/partnership-overview.html"));
});

router.get("/distribution-network", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/distribution-network.html"));
});

// Supplier Auth Pages
router.get("/supplier-signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/supplier-signin.html"));
});

router.get("/supplier-signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/supplier-signup.html"));
});

router.get("/supplier-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/supplier-dashboard.html"));
});

router.post("/api/supplier-signup", (req, res) => {
  const { companyName, contactName, email, password, phone, companyDescription } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const supplier = new Supplier({ companyName, contactName, email, password: hashedPassword, phone, companyDescription });
      return supplier.save();
    })
    .then((saved) => {
      res.json({ supplierId: saved._id, message: "Supplier account created!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/supplier-signin", (req, res) => {
  const { email, password } = req.body;

  Supplier.findOne({ email })
    .then((supplier) => {
      if (!supplier) return res.status(404).json({ message: "Supplier not found" });
      return bcrypt.compare(password, supplier.password).then((isMatch) => {
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });
        res.json({ supplierId: supplier._id, companyName: supplier.companyName, message: "Sign in successful!" });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/supplier-tags/:supplierId", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/supplier-tags.html"));
});

router.post("/api/supplier-tags/:supplierId", (req, res) => {
  const { dietaryTags } = req.body;
  Supplier.findByIdAndUpdate(req.params.supplierId, { dietaryTags }, { new: true })
    .then(() => res.json({ message: "Tags saved!" }))
    .catch((err) => res.status(500).json({ message: err.message }));
});

router.get("/api/supplier/:supplierId", (req, res) => {
  Supplier.findById(req.params.supplierId)
    .then((supplier) => {
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });
      res.json(supplier);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/api/stores", (req, res) => {
  Store.find({})
    .then((stores) => {
      const geojson = {
        type: "FeatureCollection",
        features: stores.map(store => ({
          type: "Feature",
          properties: {
            storeId: store._id,
            name: store.name,
            address: store.address,
            zipcode: store.zipcode,
            ward: store.ward,
            anc: store.anc,
            snapMatch: store.snapMatch,
            wicVendor: store.wicVendor,
            userAdded: store.userAdded
          },
          geometry: {
            type: "Point",
            coordinates: [store.longitude, store.latitude]
          }
        }))
      };
      res.json(geojson);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/signup", (req, res) => {
  const { name, email, password, address, latitude, longitude } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({ name, email, password: hashedPassword, allergies: [], address, latitude, longitude });
      return user.save();
    })
    .then((savedUser) => {
      res.json({ userId: savedUser._id, message: "Signup successful!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  const { allergies } = req.body;
  
  User.findByIdAndUpdate(userId, { allergies }, { new: true })
    .then((user) => {
      res.json({ message: "Preferences saved!", user });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
          }
          res.json({ userId: user._id, message: "Sign in successful!" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/submit-user", (req, res) => {
  const { name, email, age } = req.body;
  const user = new User({ name, email, age });
  
  user.save()
    .then(() => {
      res.json({ message: `Welcome ${name}! Your data has been saved.` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/stores/add", (req, res) => {
  const { name, address, zipcode, latitude, longitude } = req.body;
  const store = new Store({ name, address, zipcode, latitude, longitude, userAdded: true });
  
  store.save()
    .then((savedStore) => {
      res.json({ storeId: savedStore._id, message: "Store added!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/api/stores/:storeId", (req, res) => {
  Store.findById(req.params.storeId)
    .then((store) => {
      if (!store) return res.status(404).json({ error: "Store not found" });
      res.json(store);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/api/products/add", (req, res) => {
  const { storeId, name, price, allergens } = req.body;
  const product = new Product({ name, storeId, price, allergens });
  
  product.save()
    .then((savedProduct) => {
      res.json({ productId: savedProduct._id, message: "Product added!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/api/products", (req, res) => {
  const { storeId } = req.query;
  Product.find({ storeId })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.delete("/api/products/:productId", (req, res) => {
  Product.findByIdAndDelete(req.params.productId)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/store-signup", (req, res) => {
  const { storeName, email, password, phone, latitude, longitude, hours, claimStoreId } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      let storePromise;

      if (claimStoreId) {
        // Claim existing store
        storePromise = Store.findByIdAndUpdate(
          claimStoreId,
          { claimed: true, hours },
          { new: true }
        );
      } else {
        // Create new store
        const newStore = new Store({
          name: storeName,
          address: "Address TBD",
          latitude,
          longitude,
          userAdded: true,
          claimed: true,
          hours
        });
        storePromise = newStore.save();
      }

      return storePromise.then(store => {
        const storeOwner = new StoreOwner({
          email,
          password: hashedPassword,
          storeName,
          phone,
          storeId: store._id
        });
        return storeOwner.save();
      });
    })
    .then((savedOwner) => {
      res.json({ storeOwnerId: savedOwner._id, message: "Store account created!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.post("/api/store-signin", (req, res) => {
  const { email, password } = req.body;
  
  StoreOwner.findOne({ email })
    .then((storeOwner) => {
      if (!storeOwner) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      return bcrypt.compare(password, storeOwner.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
          }
          res.json({ storeOwnerId: storeOwner._id, message: "Sign in successful!" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/api/store-owner/:storeOwnerId", (req, res) => {
  StoreOwner.findById(req.params.storeOwnerId)
    .then((storeOwner) => {
      if (!storeOwner) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.json({
        storeName: storeOwner.storeName,
        email: storeOwner.email,
        phone: storeOwner.phone,
        store: storeOwner
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/api/store-owner/:storeOwnerId/products", (req, res) => {
  StoreOwner.findById(req.params.storeOwnerId)
    .then((storeOwner) => {
      if (!storeOwner) {
        return res.status(404).json({ error: "Store not found" });
      }
      
      return Product.find({ storeId: storeOwner.storeId });
    })
    .then((products) => {
      res.json(products || []);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/api/community-insights/:storeOwnerId", (req, res) => {
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  StoreOwner.findById(req.params.storeOwnerId)
    .then(owner => {
      if (!owner) return res.status(404).json({ error: "Store owner not found" });
      return Store.findById(owner.storeId).then(store => {
        if (!store || store.latitude == null) return res.status(404).json({ error: "Store location not set" });
        return User.find({ latitude: { $ne: null }, longitude: { $ne: null } }).then(users => {
          const nearby = users.filter(u =>
            haversineDistance(store.latitude, store.longitude, u.latitude, u.longitude) <= 1
          );

          const counts = {};
          nearby.forEach(u => {
            (u.allergies || []).forEach(a => {
              counts[a] = (counts[a] || 0) + 1;
            });
          });

          const breakdown = Object.entries(counts)
            .map(([restriction, count]) => ({ restriction, count }))
            .sort((a, b) => b.count - a.count);

          res.json({ totalNearby: nearby.length, breakdown });
        });
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get("/api/recommended-suppliers/:storeOwnerId", (req, res) => {
  // Maps customer restriction labels to supplier dietary tag labels
  const restrictionToTags = {
    "Gluten":             ["Gluten-Free"],
    "Wheat":              ["Gluten-Free"],
    "Dairy":              ["Dairy-Free", "Lactose-Free"],
    "Lactose Intolerance":["Dairy-Free", "Lactose-Free"],
    "Dairy-Free":         ["Dairy-Free"],
    "Peanuts":            ["Peanut-Free", "Nut-Free"],
    "Tree Nuts":          ["Nut-Free"],
    "Soy":                ["Soy-Free"],
    "Eggs":               ["Egg-Free"],
    "Shellfish":          ["Shellfish-Free"],
    "Fish":               ["Fish-Free"],
    "Vegan":              ["Vegan"],
    "Vegetarian":         ["Vegetarian"],
    "Halal":              ["Halal"],
    "Kosher":             ["Kosher"],
    "Keto":               ["Keto"],
    "Heart Risk":         ["Heart-Healthy"],
  };

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  StoreOwner.findById(req.params.storeOwnerId)
    .then(owner => {
      if (!owner) return res.status(404).json({ error: "Store owner not found" });
      return Store.findById(owner.storeId).then(store => {
        if (!store || store.latitude == null) return res.status(404).json({ error: "Store location not set" });

        return Promise.all([
          User.find({ latitude: { $ne: null }, longitude: { $ne: null } }),
          Supplier.find({ dietaryTags: { $exists: true, $not: { $size: 0 } } })
        ]).then(([users, suppliers]) => {
          const nearby = users.filter(u =>
            haversineDistance(store.latitude, store.longitude, u.latitude, u.longitude) <= 1
          );

          // Count local restrictions
          const counts = {};
          nearby.forEach(u => {
            (u.allergies || []).forEach(a => { counts[a] = (counts[a] || 0) + 1; });
          });

          // Build a set of needed supplier tags weighted by count
          const tagWeights = {};
          Object.entries(counts).forEach(([restriction, count]) => {
            const tags = restrictionToTags[restriction] || [];
            tags.forEach(tag => { tagWeights[tag] = (tagWeights[tag] || 0) + count; });
          });

          // Score each supplier by how well their tags match local needs
          const scored = suppliers.map(s => {
            const score = (s.dietaryTags || []).reduce((sum, tag) => sum + (tagWeights[tag] || 0), 0);
            const matchedNeeds = (s.dietaryTags || []).filter(tag => tagWeights[tag] > 0);
            return {
              supplierId: s._id,
              companyName: s.companyName,
              contactName: s.contactName,
              email: s.email,
              phone: s.phone,
              dietaryTags: s.dietaryTags,
              matchedNeeds,
              score,
            };
          });

          const recommended = scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score);

          res.json({ recommended, totalNearby: nearby.length });
        });
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post("/api/recommend-store", (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: "Name and address are required" });
  }

  const recommendation = new StoreRecommendation({ name, address });
  recommendation.save()
    .then(() => {
      res.json({ message: "Store recommendation submitted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
