import apiClient from './client';

/**
 * Laboratory Reports Service (FastAPI /patients/{patient_id}/admissions/{admission_id}/lab-reports)
 */
export const labService = {
  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/lab-reports
   * Returns laboratory test results with comparison telemetry
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @param {string} timeWindow - e.g. "6h", "12h", "18h", "24h"
   * @returns {Promise<Array<{
   *   reportName: string,
   *   tests: Array<{
   *     testName: string,
   *     current: number | string,
   *     previous: number | string,
   *     delta: string,
   *     deltaNum: number,
   *     unit: string,
   *     refRange: string,
   *     flag: 'N' | 'H' | 'L' | 'C',
   *     trendLabel: string,
   *     trendColor: string,
   *     history: Array<{ time: string, value: number, fullTime?: string }>
   *   }>
   * }>>}
   */
  async getLabReports(patientId, admissionId, timeWindow = '24h') {
    if (!patientId || !admissionId) return [];
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/lab-reports`, {
      window: timeWindow,
    });
  },

  /**
   * POST /upload/report
   * Lab Technician report upload endpoint
   * @param {FormData} formData
   */
  async uploadReport(formData) {
    return apiClient.request('/upload/report', {
      method: 'POST',
      body: formData,
      headers: {}, // let browser set multipart/form-data boundary
    });
  },
};

export default labService;
