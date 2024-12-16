# Simplified Restaurant Management System

## **Overview**

The Simplified Restaurant Management System is a backend API designed for efficient restaurant operations. It includes functionalities for managing menus, handling orders, user authentication, and generating analytical reports. The system is built using Node.js, Express.js, and Sequelize ORM with PostgreSQL as the database.

---

## **Features**

### **1. Menu Management**

- Admins can perform CRUD operations on menu items, including:

  - Name

  - Description

  - Price

  - Category

- Users can filter menu items by category and sort by price (ascending/descending).

### **2. Order Management**

- **Restaurant Staff:**

  - Take orders.

  - Add/remove items from a pending order.

  - Mark orders as complete.

- **Admins:**

  - View and manage all orders, including order details and status.

  - Automatically update pending orders to "expired" if they are older than 4 hours.

### **3. User Authentication**

- Role-based authentication for:

  - **Admins**

  - **Restaurant Staff**

- Only authenticated users can access order management functionalities.

### **4. Bonus Features**

- Display analytical reports of order data for a specific period.

- Export order data in CSV or XLSX formats.

- Password reset and account recovery functionality.


---

## **Technical Details**

### **Technologies Used**

- **Programming Language:** Node.js

- **Framework:** Express.js

- **Database:** PostgreSQL with Sequelize ORM

- **API Architecture:** RESTful API

### **Non-Functional Requirements**

- **Performance:** Optimized for read-heavy operations, efficient searching, and listing.

- **Security:** Input validation to prevent SQL injection and other vulnerabilities.

- **Error Handling:** Comprehensive error handling with meaningful feedback.


### **Database Design**

- Relational schema with:

  - **Menu** table for menu items.

  - **Orders** table for order details.

  - **Users** table for admin and staff information.

- Indexing for performance optimization.

---

## **Getting Started**

### **1. Prerequisites**

- Node.js (v20+ recommended)

- PostgreSQL

- npm (Node Package Manager)

### **2. Installation**

1\. Clone the repository:


    git clone https://github.com/ahmedhesein1/Simplified-Restaurant-Management-System.git


2\. Navigate to the project directory:


    cd Simplified-Restaurant-Management-System


3\. Install dependencies:


    npm install


### **3. Environment Variables**

Create a `.env` file in the root directory and add the following:

```

DB_NAME=your_database_name

DB_USER=your_database_user

DB_PASSWORD=your_database_password

DB_HOST=localhost

JWT_SECRET=your_jwt_secret

PORT=5000

CLIENT_URL=http://localhost:3000

```

## Database Setup

This project uses **PostgreSQL** for the database and **Sequelize** as the ORM.

### Database Schema
The schema consists of the following tables:
1. **Staffs**: Manages user roles and authentication.
2. **Menus**: Stores restaurant menu items.
3. **Orders**: Tracks orders and their statuses.
4. **MenuOrders**: Links orders to menu items for a many-to-many relationship.

### Setup Instructions

1. Ensure PostgreSQL is installed and running on your system.
2. Run the provided SQL script (`setup.sql`) to initialize the database:
   psql -U your_username -d restaurant_db -f setup.sql


### **5. Start the Application**

Run the server:


npm start


The API will be accessible at `http://localhost:5000`.


## **API Documentation**

### **Base URL**

- Use the Postman environment variable for the base URL.

- Example: `{{base_url}}`

### **Endpoints**

#### **Authentication**

- **POST** `/api/auth/signup`: Register a new user.

- **POST** `/api/auth/login`: Log in.

- **POST** `/api/auth/forgot-password`: Request password reset.

- **POST** `/api/auth/reset-password/:token`: Reset password.

#### **Menu Management**

- **GET** `/api/menu`: Retrieve all menu items.

- **POST** `/api/menu`: Create a new menu item.

- **PUT** `/api/menu/:id`: Update a menu item.

- **DELETE** `/api/menu/:id`: Delete a menu item.

#### **Order Management**

- **GET** `/api/orders`: Get all orders (admin-only).

- **POST** `/api/orders`: Create a new order.

- **POST** `/api/orders/:id`: Update an order status.

- **DELETE** `/api/orders/:id`: Delete an order.

# Get Order Analytics Endpoint

## Overview

This endpoint provides analytics for orders within a specified date range. The analytics include total orders, total revenue, and the average order value. It also supports exporting the order data in CSV or XLSX format.

---

## Endpoint

**GET** `/api/orders/analytics`

---

## Query Parameters

| Parameter       | Type   | Required | Description                                                                      |

|-----------------|--------|----------|----------------------------------------------------------------------------------|

| `startDate`     | String | Yes      | The start date for filtering orders (format: `YYYY-MM-DD`).                      |

| `endDate`       | String | Yes      | The end date for filtering orders (format: `YYYY-MM-DD`).                        |

| `exportFormat`  | String | No       | The format for exporting data. Options: `csv`, `xlsx`. Defaults to no export.    |

---

## Responses

### Success (200 OK)

- **When no export is requested:**

```json

{

  "success": true,

  "analytics": {

    "totalOrders": 10,

    "totalRevenue": 1200.5,

    "averageOrderValue": 120.05,

    "startDate": "2024-12-01",

    "endDate": "2024-12-15"

  },

  "orders": [

    {

      "id": 1,

      "createdAt": "2024-12-02T10:00:00Z",

      "status": "completed",

      "Menus": [

        {

          "id": 1,

          "name": "Pizza",

          "price": 10.0,

          "MenuOrder": {

            "quantity": 2

          }

        }

      ]

    },

    // More orders...

  ]

}

```

- **When exporting data as CSV or XLSX:**

The response includes the exported file as an attachment with the following headers:

| Header                  | Value                                  |

|-------------------------|----------------------------------------|

| `Content-Type`          | `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |

| `Content-Disposition`   | `attachment; filename="orders_<startDate>_<endDate>.<csv|xlsx>"`                |

### Error (400 Bad Request)

```json

{

  "success": false,

  "message": "Both startDate and endDate are required"

}

```


---

## Notes

1\. Ensure `startDate` and `endDate` are valid ISO date strings.

2\. Use libraries like `sequelize` for database queries and `json2csv` or `xlsx` for file exports.

3\. Include proper error handling for invalid inputs or export failures.

4\. Ensure appropriate middleware is in place to handle authentication and authorization if required.

---

## Example Request

**GET** `/api/orders/analytics?startDate=2024-12-01&endDate=2024-12-15&exportFormat=csv`

### Example Response (CSV File Download)

The client receives a file named `orders_2024-12-01_2024-12-15.csv`.


## **Contact**

For any inquiries or issues, contact:

- Email: ahmed.hussin.dev@gmail.com
