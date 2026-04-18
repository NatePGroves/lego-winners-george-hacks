const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const { User, Store } = require("../database");

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

module.exports = router;
