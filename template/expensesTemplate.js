const companyHeader = require("../helpers/pdfHeader");
const companyFooter = require("../helpers/pdfFooter");

const generateExpenseHTML = (expenses) => {

    if (!expenses || expenses.length === 0) {
        return `
        <html>
        <body style="font-family: Arial; padding: 30px;">
            <h2>No expenses found for this document</h2>
        </body>
        </html>`;
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN"
        }).format(amount || 0);
    };

    const sorted = [...expenses].sort(
  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
);

    const firstDate = sorted[0]?.createdAt;
    const lastDate = sorted[sorted.length - 1]?.createdAt;

    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial;
                padding: 30px;
            }

            .company-header {
                text-align: center;
                margin-bottom: 20px;
            }

            footer {
                text-align: center;
                margin-top: 30px;
                color: #888;
                font-size: 12px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th, td {
                border: 1px solid #ddd;
                padding: 10px;
            }

            th {
                background: #f4f4f4;
            }

            .total-row {
                font-weight: bold;
                background: #f9f9f9;
            }
        </style>
    </head>

    <body>

        ${companyHeader("Expenses Report")}

        <h3>Expenses</h3>

        <p>
            <strong>Period:</strong>
            ${firstDate ? new Date(firstDate).toLocaleDateString() : "N/A"}
            -
            ${lastDate ? new Date(lastDate).toLocaleDateString() : "N/A"}
        </p>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                </tr>
            </thead>

            <tbody>
                ${expenses.map(expense => `
                    <tr>
                        <td>${expense.description || ""}</td>
                        <td>${formatCurrency(expense.amount)}</td>
                        <td>${expense.category || ""}</td>
                    </tr>
                `).join("")}
            </tbody>

            <tr class="total-row">
                <td>Total Expenses</td>
                <td>${formatCurrency(expenses.reduce((sum, e) => sum + (e.amount || 0), 0))}</td>
                <td></td>
            </tr>
        </table>

        <p>Generated on ${new Date().toLocaleString()}</p>

        ${companyFooter()}

    </body>
    </html>`;
};

module.exports = generateExpenseHTML;