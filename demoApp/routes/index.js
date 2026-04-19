const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const { User, Store, Product, StoreOwner } = require("../database");

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
  const { name, email, password, age } = req.body;
  
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({ name, email, password: hashedPassword, age, allergies: [] });
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
  const { storeName, email, password, phone, latitude, longitude, claimStoreId } = req.body;
  
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      let storePromise;
      
      if (claimStoreId) {
        // Claim existing store
        storePromise = Store.findByIdAndUpdate(
          claimStoreId,
          { claimed: true },
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
          claimed: true
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

module.exports = router;
