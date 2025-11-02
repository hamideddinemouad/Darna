import type { Request, Response } from "express";
import Report from "../../models/reportModel.ts";

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
}

export default ReportController;