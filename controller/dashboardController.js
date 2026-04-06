const { QueryTypes } = require('sequelize');
const db = require('../models');

exports.getDashboardSummary = async (req, res) => {
    try {
        const totalsQuery = `
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses,
                (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
                 SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS netBalance
            FROM transactions 
            WHERE is_delete = false;
        `;
        
        const categoryQuery = `
            SELECT c.category, SUM(t.amount) as total
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE t.is_delete = false
            GROUP BY c.category_id;
        `;

        const recentQuery = `
            SELECT t.*, c.category 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.category_id
            WHERE t.is_delete = false
            ORDER BY t.date DESC
            LIMIT 5;
        `;

        const trendsQuery = `
            SELECT 
                DATE_FORMAT(date, '%b %Y') AS month,
                type,
                SUM(amount) AS total
            FROM transactions
            WHERE is_delete = false 
              AND date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY YEAR(date), MONTH(date), type
            ORDER BY YEAR(date) ASC, MONTH(date) ASC;
        `;

        const [totals, categoryData, recentActivity, trends] = await Promise.all([
            db.sequelize.query(totalsQuery, { type: QueryTypes.SELECT, plain: true }),
            db.sequelize.query(categoryQuery, { type: QueryTypes.SELECT }),
            db.sequelize.query(recentQuery, { type: QueryTypes.SELECT }),
            db.sequelize.query(trendsQuery, { type: QueryTypes.SELECT })
        ]);
        console.log(totals);

        res.status(200).json({
            success: true,
            summary: {
                totalIncome: totals.totalIncome || 0,
                totalExpenses: totals.totalExpenses || 0,
                netBalance: totals.netBalance || 0
            },
            categoryBreakdown: categoryData,
            recentActivity: recentActivity,
            monthlyTrends: trends
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};