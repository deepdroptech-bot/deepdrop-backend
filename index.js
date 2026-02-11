const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://whimsical-kleicha-e462dc.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed"), false);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options("*", cors());

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const dailySalesRoutes = require("./routes/dailySalesRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const bankRoutes = require("./routes/bankRoutes");
const profitAuditRoutes = require("./routes/profit&AuditRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const retainedEarningsRoutes = require("./routes/retainedEarningsRoutes");
const profitOrLossRoutes = require("./routes/profitOrLossRoutes");


dotenv.config();

const app = express();


// Database connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/daily-sales", dailySalesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/profit-audit", profitAuditRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/retained-earnings", retainedEarningsRoutes);
app.use("/api/profit-loss", profitOrLossRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

//Port listner
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;