const PMSPL = require("../models/profitOrLossModel");
const Inventory = require("../models/inventoryModel");
const Audit = require("../models/dailySalesModel");

const PMS_THRESHOLD = 5000;
const AGO_THRESHOLD = 2000;
const PRODUCT_THRESHOLD = 10;

exports.getDashboardOverview = async (req, res) => {

  try {

    const pmsStock = await Inventory.findOne({ type: "PMS" });
const agoStock = await Inventory.findOne({ type: "AGO" });
const lowProducts = await Inventory.find({
  type: "product",
  quantity: { $lt: PRODUCT_THRESHOLD }
});

const alerts = [];

if (pmsStock?.quantity < PMS_THRESHOLD) {
  alerts.push({
    type: "PMS",
    message: "PMS stock is critically low"
  });
}

if (agoStock?.quantity < AGO_THRESHOLD) {
  alerts.push({
    type: "AGO",
    message: "AGO stock is critically low"
  });
}

if (lowProducts.length > 0) {
  alerts.push({
    type: "PRODUCT",
    message: `${lowProducts.length} products are low in stock`
  });
}

res.json({
  ...
  alerts
});


    const totalPMSProfit = await PMSPL.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$pmsNetSales" } } }
    ]);

    const totalNetProfit = await PMSPL.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$profitOrLoss" } } }
    ]);

    const inventorySummary = await Inventory.find();

    const recentActivities = await Audit.find()
      .sort({ createdAt: -1 })
      .limit(5);
      

    res.json({
      totalPMSProfit: totalPMSProfit[0]?.total || 0,
      totalNetProfit: totalNetProfit[0]?.total || 0,
      inventorySummary,
      recentActivities
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
