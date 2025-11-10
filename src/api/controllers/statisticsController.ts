import type { Request, Response } from "express";
import User from "../../models/userModel.ts";
import Property from "../../models/propertyModel.ts";
import Report from "../../models/reportModel.ts";
import Transaction from "../../models/transactionModel.ts";

class StatisticsController {

    async getBasicStats(req: Request, res: Response): Promise<void> {
        try {
            const totalUsers = await User.countDocuments();
            const particuliers = await User.countDocuments({ role: "Particulier" });
            const entreprises = await User.countDocuments({ role: "Entreprise" });

            const totalProperties = await Property.countDocuments();
            const activeProperties = await Property.countDocuments({ status: "active" });
            const soldProperties = await Property.countDocuments({ status: "sold" });

            res.json({
                success: true,
                users: {
                    total: totalUsers,
                    particuliers: particuliers,
                    entreprises: entreprises
                },
                properties: {
                    total: totalProperties,
                    active: activeProperties,
                    sold: soldProperties
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }

    async getAdvancedStats(req: Request, res: Response): Promise<void> {
        try {
            const totalUsers = await User.countDocuments();
            const totalProperties = await Property.countDocuments();
            const totalReports = await Report.countDocuments();
            const pendingReports = await Report.countDocuments({ status: "pending" });
            
            const completedTransactions = await Transaction.find({ status: "completed" });
            let totalRevenue = 0;
            for (const transaction of completedTransactions) {
                totalRevenue += transaction.amount;
            }

            res.json({
                success: true,
                users: totalUsers,
                properties: totalProperties,
                reports: {
                    total: totalReports,
                    pending: pendingReports
                },
                revenue: totalRevenue
            });
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }
}

export default StatisticsController;