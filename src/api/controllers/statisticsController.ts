import type { Request, Response } from "express";
import User from "../../models/userModel.ts";
import Property from "../../models/propertyModel.ts";

class StatisticsController {

    async getBasicStats(req: Request, res: Response): Promise<void> {
        try {
            // Total users count
            const totalUsers = await User.countDocuments();

            // Users by role
            const particuliers = await User.countDocuments({ role: "Particulier" });
            const entreprises = await User.countDocuments({ role: "Entreprise" });
            const admins = await User.countDocuments({ role: "Admin" });

            // Verified entreprises
            const verifiedEntreprises = await User.countDocuments({ 
                role: "Entreprise", 
                verified: true 
            });
            const unverifiedEntreprises = await User.countDocuments({ 
                role: "Entreprise", 
                verified: false 
            });

            // Total properties count
            const totalProperties = await Property.countDocuments();

            // Properties by status
            const activeProperties = await Property.countDocuments({ status: "active" });
            const inactiveProperties = await Property.countDocuments({ status: "inactive" });
            const soldProperties = await Property.countDocuments({ status: "sold" });

            // Properties by type
            const villas = await Property.countDocuments({ "characteristics.type": "Villa" });
            const appartements = await Property.countDocuments({ "characteristics.type": "Appartement" });
            const studios = await Property.countDocuments({ "characteristics.type": "Studio" });
            const terrains = await Property.countDocuments({ "characteristics.type": "Terrain" });

            res.json({
                success: true,
                statistics: {
                    users: {
                        total: totalUsers,
                        byRole: {
                            particuliers: particuliers,
                            entreprises: entreprises,
                            admins: admins
                        },
                        entreprises: {
                            verified: verifiedEntreprises,
                            unverified: unverifiedEntreprises
                        }
                    },
                    properties: {
                        total: totalProperties,
                        byStatus: {
                            active: activeProperties,
                            inactive: inactiveProperties,
                            sold: soldProperties
                        },
                        byType: {
                            villas: villas,
                            appartements: appartements,
                            studios: studios,
                            terrains: terrains
                        }
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }
}

export default StatisticsController;