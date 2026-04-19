# Lego Winners Project - GeorgeHacks 2026

A platform connecting customers, corner stores, and suppliers to increase access to healthy food options in underserved communities.

## Project Overview

This application provides a marketplace for healthy food products across local convenience stores. It enables:

- **Customers** to discover nearby stores with healthy options and filter by dietary preferences
- **Store Owners** to list their stores, manage inventory, and connect with suppliers
- **Suppliers** to distribute products to multiple stores

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Python 3.7+ (for data extraction scripts)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lego-winners-george-hacks
   ```

2. **Install backend dependencies**

   ```bash
   cd demoApp
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `demoApp` directory:

   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Prepare data (optional)**
   ```bash
   cd ..
   python extract_convenience_stores.py --input datasets/Basic_Business_Licenses.csv
   ```

### Running the Application

**Development mode** (with auto-reload):

```bash
cd demoApp
npm run dev
```

**Production mode**:

```bash
cd demoApp
npm start
```

The server will start on `http://localhost:3000`

---

## Features

### User Roles & Capabilities

| Role            | Capabilities                                                                             |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Customer**    | Browse stores on map, filter by dietary preferences, view store details, set preferences |
| **Store Owner** | Sign up store, add/manage products, view dashboard, receive recommendations              |
| **Supplier**    | Manage product distribution network, view partnership overview, manage tags              |

### Core Features

- **Interactive Map** - Browse stores by location with GeoJSON integration
- **Dietary Filtering** - Filter products by dietary restrictions and preferences
- **Product Management** - Stores and suppliers can manage inventory
- **Multi-role Authentication** - Separate login flows for customers, stores, and suppliers
- **Store Network** - Distribution and partnership management
- **Dashboard** - Role-specific dashboards for data insights
- **Secure Authentication** - Password hashing with bcrypt

---

## Project Structure

```
lego-winners-george-hacks/
├── demoApp/                    # Main Node.js/Express application
│   ├── server.js              # Express server configuration
│   ├── database.js            # MongoDB/Mongoose setup
│   ├── importStores.js        # Import store data into database
│   ├── package.json           # Node dependencies
│   ├── routes/
│   │   └── index.js          # All route definitions
│   ├── views/                # HTML templates
│   │   ├── base.html         # Landing page
│   │   ├── add-product.html  # Product submission
│   │   ├── map.html          # Store map interface
│   │   ├── store-dashboard.html
│   │   ├── supplier-dashboard.html

│   │   └── ...
│   └── public/               # Static assets
│       ├── Healthy_Corner_Stores.geojson
│       ├── styles.css
│       └── user-nav.js
├── datasets/                  # CSV data files
│   ├── Convenience_Stores_From_Licenses.csv
│   ├── Grocery_Store_Locations.csv
│   └── Healthy_Corner_Stores.csv
├── datasets_json/            # GeoJSON geographic data
│   ├── Convenience_Stores_Simplified.geojson
│   ├── Grocery_Store_Locations.geojson
│   └── Healthy_Corner_Stores.geojson
├── extract_convenience_stores.py  # Data extraction utility
└── README.md                  # This file
```

---

#### Customer Routes

- `GET /` - Landing page
- `GET /signup` - Customer signup
- `GET /signin` - Customer signin
- `GET /profile` - User profile page
- `GET /preferences/:userId` - Dietary preferences
- `GET /map` - Interactive store map

#### Store Owner Routes

- `GET /store-signup` - Store registration
- `GET /store-signin` - Store login
- `GET /store-dashboard` - Store management dashboard
- `GET /add-product` - Add product to store
- `GET /store-detail` - View store details
- `GET /recommend-store` - Get store recommendations

#### Supplier Routes

- `GET /supplier-signup` - Supplier registration
- `GET /supplier-signin` - Supplier login
- `GET /supplier-dashboard` - Supplier dashboard
- `GET /supplier-tags` - Manage product tags

#### Educational Pages

- `GET /how-it-works` - Customer guide
- `GET /dietary-filtering` - Dietary info
- `GET /why-list-your-store` - Store recruitment page
- `GET /managing-products` - Product management guide
- `GET /partnership-overview` - Supplier partnership info
- `GET /distribution-network` - Distribution details

---

## Database Models

The application uses MongoDB with Mongoose and includes the following models:

- **User** - Customer accounts
- **Store** - Store information
- **Product** - Product listings
- **StoreOwner** - Store owner accounts
- **Supplier** - Supplier accounts
- **StoreRecommendation** - Store recommendations for users

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Security**: bcrypt for password hashing
- **Frontend**: HTML, CSS, JavaScript
- **Data Formats**: CSV, GeoJSON
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-reload

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- ---

 ## Team Information

See the project team document: [Team Members](https://docs.google.com/document/d/1SQ82GBFSVv88tm664elGZqNh_WBoHCss_Rz776pxXyE/edit?usp=sharing) -->

---

## Recent Updates

- **UI Polish**: Improved forms and dashboards for customer signup, store registration, and product management
- **Store Dashboard**: Enhanced functionality with better inventory and recommendation management
- **Supplier Dashboard**: Improved partner management and product distribution features
- **Map UX**: Optimized store browsing experience on the interactive map
- **Removed Admin Functions**: Simplified user roles to focus on Customer, Store Owner, and Supplier roles

---

## Color Scheme

Primary brand colors:

| Color          | Hex     | Purpose                                     |
| -------------- | ------- | ------------------------------------------- |
| **Primary**    | #297045 | Main brand green - buttons, headings        |
| **Secondary**  | #465775 | Blue - accents, secondary elements          |
| **Background** | #eef6ef | Soft green - page backgrounds               |
| **Surface**    | #ffffff | White - card and container backgrounds      |
| **Accent**     | #d2f898 | Light green - highlights, focus states      |
| **CTA**        | #cc5f00 | Orange - calls-to-action, important buttons |
