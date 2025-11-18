# Car Rental Backend (Node.js + TypeScript + MongoDB)

A production-ready backend for managing a complete vehicle rental system including bookings, payments, availability tracking, and GPS monitoring.

## This project includes:

* Node.js + Express + TypeScript

* MongoDB + Mongoose

* Razorpay Payment Gateway

* JWT Authentication & Authorization

* Request Validation

* Vehicle Availability Tracking

* Booking Lifecycle Automation (Cron Jobs)

* GPS Tracking Module

* Proper folder structure & best practices

# Features
*  Authentication & Authorization

* User/Admin login

* Role-based access control

* Secure JWT authentication

*  Vehicle Management

* Add, update, list vehicles

* Track availability

* Auto-update availability after bookings & cancellations

* Booking System

* Create booking with date conflict prevention

* Auto price calculation (vehicle price × days)

* User booking history

* Admin history per vehicle

* Payment Processing (Razorpay)


* Create Razorpay order

* Verify payment

* Refund on cancellation

* Store payment transaction logs

* Availability Module

* Automatic availability tracking

* Update on booking start, end & cancellation

# GPS Tracking

* Update live GPS location

* Fetch last known coordinates

# Cron Jobs

* Auto-mark completed bookings

* Auto-release vehicle availability

# System Utilities

* Custom middleware

* Unified response helper

* Centralized error handling





## Install Dependencies
npm install

## Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

## Start Server
npm run dev



## Scripts
npm run dev        # Start development server
npm run build      # Compile TypeScript
npm start          # Start production server
