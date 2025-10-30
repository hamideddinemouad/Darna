import type { Request, Response } from "express";
import PropertyService from "../services/propertyService.ts";
import Mediacontroller from "./mediaController.ts";

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
}

export default PropertyController;