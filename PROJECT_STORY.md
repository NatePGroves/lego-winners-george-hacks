# CornerLink - Project Story

## Inspiration

Communities across urban areas, particularly underserved neighborhoods, face a significant challenge: lack of access to healthy, affordable food options. While corner stores are ubiquitous in these areas, they typically stock highly processed foods with limited nutritional value. We were inspired by the need to bridge the gap between customers seeking healthy food choices and corner stores willing to stock healthier products—but lacking a direct connection to suppliers.

The challenge is threefold:
- **Customers** struggle to find healthy food options in their neighborhoods
- **Corner store owners** want to improve their product offerings but lack efficient ways to source healthy alternatives
- **Suppliers** of healthy products can't easily reach the distributed network of corner stores

CornerLink emerged from the vision to create an equitable food system where nutritious products are accessible to everyone, regardless of neighborhood.

---

## What it does

CornerLink is a three-sided marketplace platform that connects customers, corner stores, and suppliers in an ecosystem designed to improve food access and equity.

### For Customers:
- Discover nearby corner stores with healthy product options
- Filter products by dietary restrictions and preferences (allergies, vegan, gluten-free, etc.)
- Browse stores on an interactive map with GeoJSON integration
- Save dietary preferences for personalized recommendations
- View detailed store and product information

### For Store Owners:
- Register and list their corner store on the platform
- Add and manage product inventory
- Access a dashboard with store insights and performance
- Receive recommendations on healthy products that match customer demand
- Connect directly with suppliers seeking distribution partners

### For Suppliers:
- Access a network of 500+ corner stores across DC
- Manage product distribution and partnerships
- View partnership opportunities based on store needs
- Manage product tags and categorization
- Expand distribution reach efficiently

---

## How we built it

### Technology Stack
- **Backend**: Node.js with Express.js for server and routing
- **Database**: MongoDB with Mongoose ODM for flexible data modeling
- **Frontend**: HTML, CSS, and vanilla JavaScript for responsive UI
- **Authentication**: bcrypt for secure password hashing
- **Data Formats**: GeoJSON for geographic data, CSV for data imports
- **Development**: Nodemon for auto-reload during development

### Architecture & Features

**Multi-Role Authentication System**:
- Separate sign-up and login flows for customers, store owners, and suppliers
- Role-based access control ensuring each user type sees relevant features
- Secure password hashing with bcrypt

**Geographic Integration**:
- GeoJSON-based store location data for 500+ corner stores across DC
- Interactive map interface allowing customers to browse nearby stores
- Data extraction utilities to process business license datasets

**Data Management**:
- Mongoose schemas for Users, Stores, Products, StoreOwners, Suppliers, and Recommendations
- Import scripts to populate initial store and product data
- Support for barcode lookup integration (Open Food Facts API)

**User Dashboards**:
- Store Owner Dashboard: Manage inventory, view metrics, and receive recommendations
- Supplier Dashboard: Manage partnerships, view distribution opportunities, and organize products
- Customer Profile: Save preferences and track favorite stores

**Educational Content**:
- How It Works guide for customers
- Dietary filtering information page
- Store recruitment content
- Product management guides
- Partnership overview for suppliers
- Distribution network documentation

---

## Challenges we ran into

### 1. **Data Accuracy & Sourcing**
- Obtaining accurate, up-to-date data on corner stores across DC
- Cleaning and processing CSV datasets from various sources
- Mapping business license data to geographic coordinates

### 2. **Multi-Role Complexity**
- Designing authentication flows that accommodate three distinct user types
- Ensuring role-based access control doesn't create security vulnerabilities
- Managing different user expectations and feature sets

### 3. **Geographic Data Integration**
- Converting store data into GeoJSON format for accurate mapping
- Ensuring map performance with 500+ store locations
- Handling real-time location services and distance calculations

### 4. **Database Schema Design**
- Creating relationships between Users, Stores, Products, and Suppliers
- Managing product recommendations and store matchmaking logic
- Ensuring data consistency across multiple user types

### 5. **UI/UX Consistency**
- Maintaining brand consistency across 25+ HTML templates
- Creating intuitive flows for diverse user types
- Balancing feature richness with simplicity

### 6. **Real-Time Product Updates**
- Integrating barcode lookup to auto-populate product information
- Managing product availability and inventory status
- Handling supplier product distribution across multiple stores

---

## Accomplishments that we're proud of

✅ **Functional Three-Sided Marketplace**: Built a working platform that successfully connects all three user types with distinct, purpose-built features for each.

✅ **Geographic Intelligence**: Implemented an interactive map interface with 500+ corner store locations, enabling customers to make location-aware decisions about where to shop.

✅ **Comprehensive User Flows**: Designed and implemented complete user journeys from sign-up through purchase decision-making, tailored to each user role.

✅ **Secure Authentication**: Implemented industry-standard password hashing and role-based access control, ensuring user data and privacy.

✅ **Clean, Scalable Architecture**: Built a modular codebase with clear separation of concerns (routes, views, database), making it easy to add features and maintain code.

✅ **Beautiful, Consistent UI**: Created 25+ pages with a cohesive brand identity using a thoughtful color scheme (#297045 primary green) that communicates trust and health.

✅ **Data Integration**: Successfully processed and integrated real-world business license datasets and converted them to geographic formats for mapping.

✅ **Rapid Development**: Built a fully functional MVP in a hackathon timeframe with real features, not just mockups.

---

## What we learned

### Technical Learnings:
- **Real-World Data Challenges**: Working with messy, real datasets taught us the importance of data validation and cleaning pipelines
- **Multi-User System Complexity**: Managing different user types with different needs requires careful planning of authentication and authorization
- **GeoJSON and Mapping**: Geographic data is more nuanced than we initially expected; scaling map interactions requires careful performance optimization

### Product & Design:
- **Three-Sided Marketplaces Are Hard**: Balancing the needs of three distinct user groups is complex but incredibly valuable for network effects
- **Dietary Preferences Matter**: Understanding user dietary restrictions is key to building trust with health-conscious customers
- **Trust & Brand Matter**: The visual design and consistent UX significantly impact user confidence in the platform

### Team & Project Management:
- **Communication is Critical**: With multiple user flows and features, clear communication and documentation prevented misalignment
- **Iterative Development Works**: Building features incrementally and testing them early caught issues before they became major problems
- **Focus on MVP**: Prioritizing core features (map, signup, dashboards) over nice-to-haves let us ship a working product

---

## What's next for CornerLink

### Phase 2 - Enhanced Features:
- **Real-Time Inventory**: Live product availability updates from stores
- **Demand Analytics**: Show suppliers which products are most requested by customers
- **Review & Rating System**: Build trust through customer reviews of stores and products
- **In-App Messaging**: Enable direct communication between suppliers and store owners

### Phase 3 - Expansion & Scaling:
- **Mobile App**: Native iOS/Android applications for on-the-go shopping
- **Payment Integration**: Enable in-app purchasing or store credit systems
- **Expanded Geography**: Scale beyond DC to other underserved urban areas
- **Sustainability Metrics**: Track environmental impact of reduced food miles

### Phase 4 - Community Impact:
- **Loyalty Programs**: Reward customers for buying healthy options
- **Educational Content**: Cooking tips, nutrition information, and recipe suggestions
- **Community Challenges**: Gamify healthy eating with store-based challenges
- **Impact Dashboard**: Show real-time data on food equity improvements in neighborhoods

### Near-Term Priorities:
1. **User Testing**: Get real feedback from customers, store owners, and suppliers
2. **Performance Optimization**: Optimize map rendering and database queries for scale
3. **Mobile Responsiveness**: Ensure platform works flawlessly on phones
4. **Data Partnerships**: Establish relationships with health departments and nonprofits for data
5. **Pilot Program**: Launch a small pilot in one DC neighborhood to validate the concept

---

## The Vision

CornerLink represents a belief that technology can be a force for equity and community health. By creating direct connections between corner stores and suppliers of healthy products, we're building infrastructure for a future where access to nutritious food is not determined by zip code or income level. 

Every customer deserves healthy options in their neighborhood. Every store owner deserves support in meeting that need. Every supplier deserves access to a market eager for their products.

Together, we're building CornerLink to make that vision a reality.
