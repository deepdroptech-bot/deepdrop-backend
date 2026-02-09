const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

const allowedOrigins = [
  "http://localhost:5173",
  "https://yourdomain.com"
];

dotenv.config();

const app = express();


// Database connection
connectDB();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;