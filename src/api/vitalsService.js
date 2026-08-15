import apiClient from './client';

/**
 * Clinical Vitals Telemetry Service (FastAPI /patients/{patient_id}/admissions/{admission_id}/vitals)
 */
export const vitalsService = {
  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/vitals
   * Returns all recorded vitals (Heart rate, Blood Pressure, Temperature, SpO2, Resp Rate, etc.)
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @param {string} timeWindow - e.g. "6h", "12h", "18h", "24h"
   * @returns {Promise<{
   *   summary: {
   *     heartRate: { current: number, previous: number, unit: string, delta: number },
   *     systolicBP: { current: number, previous: number, unit: string, delta: number },
   *     diastolicBP: { current: number, previous: number, unit: string, delta: number },
   *     spO2: { current: number, previous: number, unit: string, delta: number },
   *     respRate: { current: number, previous: number, unit: string, delta: number },
   *     temp: { current: number, previous: number, unit: string, delta: number },
   *     painScore: { current: number, previous: number, unit: string, delta: number },
   *     urineOutput: { current: number, previous: number, unit: string, delta: number }
   *   },
   *   history: Array<{
   *     time: string,
   *     heartRate: number,
   *     systolicBP: number,
   *     diastolicBP: number,
   *     spO2: number,
   *     respRate: number,
   *     temperature: number,
   *     urineOutput: number
   *   }>
   * }>}
   */
  async getVitals(patientId, admissionId, timeWindow = '24h') {
    if (!patientId || !admissionId) return null;
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/vitals`, {
      window: timeWindow,
    });
  },
};

export default vitalsService;
