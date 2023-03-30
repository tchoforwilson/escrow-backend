# Escrow Application
This is the backend of my simple escrow application of users and their transactions
The main actors in this application is the user and his/her transactions

# User
 1. User has a name, email, role (admin/user),photo, password
 2. User validation is done with validator for email
 3. Password is encrypted with bcrypt
 3. User Login is generated using Bearer Jsonwebtoken

# Transaction
 1. Transaction has item (name, price,category, description), title, currency, user role (buyer/seller), date and inspection days
 2. A transaction is made by the user