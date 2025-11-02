import type { Request, Response } from "express";
import Report from "../../models/reportModel.ts";
import Property from "../../models/propertyModel.ts";

class ReportController {

    async getAllReports(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.query;

            const filter: any = {};

            if (status && status !== 'all') {
                filter.status = status;
            }

            const reports = await Report.find(filter)
                .populate('property', 'title price location status')
                .populate('reportedBy', 'firstname lastname email')
                .populate('reviewedBy', 'firstname lastname email')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                count: reports.length,
                reports: reports
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async getReportById(req: Request, res: Response): Promise<void> {
        try {
            const reportId = req.params.id;

            if (!reportId) {
                res.status(400).json({ error: "Report ID is required" });
                return;
            }

            const report = await Report.findById(reportId)
                .populate('property')
                .populate('reportedBy', 'firstname lastname email role createdAt')
                .populate('reviewedBy', 'firstname lastname email');

            if (!report) {
                res.status(404).json({ error: "Report not found" });
                return;
            }

            res.json({
                success: true,
                report: report
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async approveReport(req: Request, res: Response): Promise<void> {
        try {
            const reportId = req.params.id;
            const adminId = res.locals.payload.userId;
            const { notes } = req.body;

            if (!reportId) {
                res.status(400).json({ error: "Report ID is required" });
                return;
            }

            const report = await Report.findById(reportId);

            if (!report) {
                res.status(404).json({ error: "Report not found" });
                return;
            }

            if (report.status !== "pending") {
                res.status(400).json({ error: "Report has already been reviewed" });
                return;
            }

            report.status = "approved";
            report.reviewedBy = adminId;
            report.reviewedAt = new Date();
            if (notes) {
                report.adminNotes = notes;
            }

            await report.save();

            res.json({
                success: true,
                message: "Report approved successfully",
                report: {
                    id: report._id,
                    status: report.status,
                    reviewedAt: report.reviewedAt
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async rejectReport(req: Request, res: Response): Promise<void> {
        try {
            const reportId = req.params.id;
            const adminId = res.locals.payload.userId;
            const { notes } = req.body;

            if (!reportId) {
                res.status(400).json({ error: "Report ID is required" });
                return;
            }

            const report = await Report.findById(reportId);

            if (!report) {
                res.status(404).json({ error: "Report not found" });
                return;
            }

            if (report.status !== "pending") {
                res.status(400).json({ error: "Report has already been reviewed" });
                return;
            }

            report.status = "rejected";
            report.reviewedBy = adminId;
            report.reviewedAt = new Date();
            if (notes) {
                report.adminNotes = notes;
            }

            await report.save();

            res.json({
                success: true,
                message: "Report rejected successfully",
                report: {
                    id: report._id,
                    status: report.status,
                    reviewedAt: report.reviewedAt
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }

    async deleteReportedProperty(req: Request, res: Response): Promise<void> {
        try {
            const reportId = req.params.id;
            const adminId = res.locals.payload.userId;

            if (!reportId) {
                res.status(400).json({ error: "Report ID is required" });
                return;
            }

            const report = await Report.findById(reportId);

            if (!report) {
                res.status(404).json({ error: "Report not found" });
                return;
            }

            const property = await Property.findById(report.property);

            if (!property) {
                res.status(404).json({ error: "Property not found" });
                return;
            }

            await Property.findByIdAndDelete(report.property);

            report.status = "approved";
            report.reviewedBy = adminId;
            report.reviewedAt = new Date();
            report.adminNotes = "Property deleted by admin";
            await report.save();

            res.json({
                success: true,
                message: "Reported property deleted successfully",
                deletedProperty: {
                    id: property._id,
                    title: property.title
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Server error", details: error });
        }
    }
}

export default ReportController;