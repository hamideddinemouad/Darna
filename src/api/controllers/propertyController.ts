import type { Request, Response } from "express";
import PropertyService from "../services/propertyService.ts";
import Mediacontroller from "./mediaController.ts";
import Report from "../../models/reportModel.ts";

class PropertyController {
    private propertyService: PropertyService;
    private mediaController: Mediacontroller;

    constructor() {
        this.propertyService = new PropertyService();
        this.mediaController = new Mediacontroller();
    }

    async getPropertyById(req: Request, res: Response): Promise<void> {
        try {
            const propertyId = req.params.id;
            
            if (!propertyId) {
                res.status(400).json({ error: "Property ID is required" });
                return;
            }

            const property = await this.propertyService.getPropertyById(propertyId);

            if (!property) {
                res.status(404).json({ error: "Property not found" });
                return;
            }

            let imageUrls: string[] = [];
            let videoUrls: string[] = [];

            if (property.media && property.media.images) {
                imageUrls = await this.mediaController.fetchImages(property.media.images);
            }

            if (property.media && property.media.videos) {
                videoUrls = await this.mediaController.fetchImages(property.media.videos);
            }

            res.json({
                success: true,
                property: {
                    id: property._id,
                    title: property.title,
                    description: property.description,
                    price: property.price,
                    location: property.location,
                    characteristics: property.characteristics,
                    media: {
                        images: imageUrls,
                        videos: videoUrls
                    },
                    owner: property.owner,
                    status: property.status,
                    createdAt: property.createdAt,
                    updatedAt: property.updatedAt
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async getAllProperties(req: Request, res: Response): Promise<void> {
        try {
            const properties = await this.propertyService.getAllActiveProperties();
            const propertiesWithMedia = [];

            for (const property of properties) {
                let mainImageUrl = null;

                if (property.media && property.media.images && property.media.images.length > 0) {
                    const firstImage = property.media.images[0] || '';
                    const urls = await this.mediaController.fetchImages([firstImage]);
                    mainImageUrl = urls[0];
                }

                propertiesWithMedia.push({
                    id: property._id,
                    title: property.title,
                    price: property.price,
                    location: property.location,
                    characteristics: property.characteristics,
                    mainImage: mainImageUrl,
                    owner: property.owner,
                    createdAt: property.createdAt
                });
            }

            res.json({
                success: true,
                count: properties.length,
                properties: propertiesWithMedia
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async createProperty(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.payload.userId;

            if (!userId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const { title, description, price, location, characteristics } = req.body;

            if (!title || !description || !price || !location || !characteristics) {
                res.status(400).json({ error: "All required fields must be provided" });
                return;
            }

            const imageNames: string[] = [];
            const videoNames: string[] = [];

            if (files && files.images) {
                for (const image of files.images) {
                    const fileName = new Date().toISOString();
                    await this.mediaController.uploadImages({ images: [image] }, fileName);
                    imageNames.push(fileName);
                }
            }

            if (files && files.videos) {
                for (const video of files.videos) {
                    const fileName = new Date().toISOString();
                    await this.mediaController.uploadImages({ videos: [video] }, fileName);
                    videoNames.push(fileName);
                }
            }

            const propertyData = {
                title,
                description,
                price,
                location: JSON.parse(location),
                characteristics: JSON.parse(characteristics),
                media: {
                    images: imageNames,
                    videos: videoNames
                }
            };

            const newProperty = await this.propertyService.createProperty(propertyData, userId);

            res.status(201).json({
                success: true,
                message: "Property created successfully",
                property: newProperty
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async updateOwnProperty(req: Request, res: Response): Promise<void> {
        try {
            const propertyId = req.params.id;
            const userId = res.locals.payload.userId || res.locals.payload._id;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!propertyId) {
                res.status(400).json({ error: "Property ID is required" });
                return;
            }

            const { title, description, price, location, characteristics, status } = req.body;

            const updateData: any = {};

            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (price) updateData.price = price;
            if (location) updateData.location = JSON.parse(location);
            if (characteristics) updateData.characteristics = JSON.parse(characteristics);
            if (status) updateData.status = status;

            if (files) {
                const newImageNames: string[] = [];
                const newVideoNames: string[] = [];

                if (files.images) {
                    for (const image of files.images) {
                        const fileName = new Date().toISOString();
                        await this.mediaController.uploadImages({ images: [image] }, fileName);
                        newImageNames.push(fileName);
                    }
                }

                if (files.videos) {
                    for (const video of files.videos) {
                        const fileName = new Date().toISOString();
                        await this.mediaController.uploadImages({ videos: [video] }, fileName);
                        newVideoNames.push(fileName);
                    }
                }

                if (newImageNames.length > 0 || newVideoNames.length > 0) {
                    updateData.media = {
                        images: newImageNames,
                        videos: newVideoNames
                    };
                }
            }

            const updatedProperty = await this.propertyService.updateProperty(
                propertyId,
                userId,
                updateData
            );

            res.json({
                success: true,
                message: "Property updated successfully",
                property: updatedProperty
            });
        } catch (error: any) {
            if (error.message === "Property not found") {
                res.status(404).json({ error: error.message });
            } else if (error.message === "Unauthorized") {
                res.status(403).json({ error: "You can only modify your own properties" });
            } else {
                res.status(500).json({ error: "Server error", details: error });
            }
        }
    }

    async deleteOwnProperty(req: Request, res: Response): Promise<void> {
        try {
            const propertyId = req.params.id;
            const userId = res.locals.payload.userId || res.locals.payload._id;

            if (!propertyId) {
                res.status(400).json({ error: "Property ID is required" });
                return;
            }

            await this.propertyService.deleteProperty(propertyId, userId);

            res.json({
                success: true,
                message: "Property deleted successfully"
            });
        } catch (error: any) {
            if (error.message === "Property not found") {
                res.status(404).json({ error: error.message });
            } else if (error.message === "Unauthorized") {
                res.status(403).json({ error: "You can only delete your own properties" });
            } else {
                res.status(500).json({ error: "Server error", details: error });
            }
        }
    }

    async getMyProperties(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.payload.userId || res.locals.payload._id;
            const properties = await this.propertyService.getPropertiesByOwner(userId);

            res.json({
                success: true,
                count: properties.length,
                properties: properties
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async reportProperty(req: Request, res: Response): Promise<void> {
        try {
            const propertyId = req.params.id;
            const userId = res.locals.payload.userId;
            const { reason, description } = req.body;

            if (!propertyId) {
                res.status(400).json({ error: "Property ID is required" });
                return;
            }

            if (!reason || !description) {
                res.status(400).json({ error: "Reason and description are required" });
                return;
            }

            const validReasons = [
                "inappropriate_content",
                "fake_listing",
                "wrong_information",
                "spam",
                "scam",
                "other"
            ];

            if (!validReasons.includes(reason)) {
                res.status(400).json({ error: "Invalid reason" });
                return;
            }

            const property = await this.propertyService.getPropertyById(propertyId);

            if (!property) {
                res.status(404).json({ error: "Property not found" });
                return;
            }

            const existingReport = await Report.findOne({
                property: propertyId,
                reportedBy: userId,
                status: "pending"
            });

            if (existingReport) {
                res.status(400).json({ error: "You have already reported this property" });
                return;
            }

            const report = new Report({
                property: propertyId,
                reportedBy: userId,
                reason: reason,
                description: description,
                status: "pending"
            });

            await report.save();

            res.status(201).json({
                success: true,
                message: "Property reported successfully",
                report: {
                    id: report._id,
                    property: propertyId,
                    reason: reason,
                    status: report.status
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }
}

export default PropertyController;