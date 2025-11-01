import type { Request, Response } from "express";
import User from "../../models/userModel.ts";

class UserController {

    async searchEntreprises(req: Request, res: Response): Promise<void> {
        try {
            const { verified, search } = req.query;

            const filter: any = { role: "Entreprise" };

            if (verified === 'true') {
                filter.verified = true;
            } else if (verified === 'false') {
                filter.verified = false;
            }

            if (search) {
                filter.$or = [
                    { firstname: { $regex: search, $options: 'i' } },
                    { lastname: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const entreprises = await User.find(filter)
                .select('-password -twofactorcode')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                count: entreprises.length,
                entreprises: entreprises
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async getEntrepriseById(req: Request, res: Response): Promise<void> {
        try {
            const entrepriseId = req.params.id;

            if (!entrepriseId) {
                res.status(400).json({ error: "Entreprise ID is required" });
                return;
            }

            const entreprise = await User.findById(entrepriseId)
                .select('-password -twofactorcode');

            if (!entreprise) {
                res.status(404).json({ error: "Entreprise not found" });
                return;
            }

            if (entreprise.role !== "Entreprise") {
                res.status(400).json({ error: "User is not an Entreprise account" });
                return;
            }

            res.json({
                success: true,
                entreprise: entreprise
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }
}

export default UserController;