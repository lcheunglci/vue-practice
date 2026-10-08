import type {
  ElectronReportApi,
  ExportFormat,
  ExportResult,
  OpenCsvResult,
  ReportDetail,
  ReportRow,
  ReportRowUpdate,
  ReportSummary
} from '../electron.d';

export class ReportService {
  listReports(): Promise<ReportSummary[]> {
    return this.requireApi().listReports();
  }

  getReport(id: number): Promise<ReportDetail | null> {
    return this.requireApi().getReport(id);
  }

  importReport(filePath: string, name: string): Promise<ReportDetail> {
    return this.requireApi().importReport(filePath, name);
  }

  renameReport(id: number, name: string): Promise<ReportDetail | null> {
    return this.requireApi().renameReport(id, name);
  }

  updateRow(id: number, values: ReportRowUpdate): Promise<ReportRow | null> {
    return this.requireApi().updateRow(id, values);
  }

  deleteReport(id: number): Promise<boolean> {
    return this.requireApi().deleteReport(id);
  }

  clearAllReports(): Promise<number> {
    return this.requireApi().clearAllReports();
  }

  exportReport(id: number, format: ExportFormat): Promise<ExportResult> {
    return this.requireApi().exportReport(id, format);
  }

  openCsvDialog(): Promise<OpenCsvResult> {
    return this.requireApi().openCsvDialog();
  }

  private requireApi(): ElectronReportApi {
    if (!window.reportApi) {
      throw new Error(
        'Electron API is not available. Run the app via Electron (npm run electron:dev or electron:start).'
      );
    }
    return window.reportApi;
  }
}

export const reportService = new ReportService();
