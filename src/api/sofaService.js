import apiClient from './client';

/**
 * SOFA (Sequential Organ Failure Assessment) Scoring Service
 * FastAPI: /patients/{patient_id}/admissions/{admission_id}/sofa
 */
export const sofaService = {
  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/sofa/current
   * Returns most recent SOFA score, immediate previous score, and 6-organ breakdown
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<{
   *   currentTotal: number,
   *   previousTotal: number,
   *   currentWindow: string,
   *   organs: {
   *     respiration: { score: number, valueStr: string, evidence: string },
   *     coagulation: { score: number, valueStr: string, evidence: string },
   *     liver: { score: number, valueStr: string, evidence: string },
   *     cardio: { score: number, valueStr: string, evidence: string },
   *     cns: { score: number, valueStr: string, evidence: string },
   *     renal: { score: number, valueStr: string, evidence: string }
   *   }
   * }>}
   */
  async getSofaCurrent(patientId, admissionId) {
    if (!patientId || !admissionId) return null;
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/sofa/current`);
  },

  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/sofa/history
   * Computes SOFA score for every 4-hour window since admission
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<Array<{
   *   time: string,
   *   sofa: number,
   *   prevSofa?: number,
   *   respiration: number,
   *   coagulation: number,
   *   liver: number,
   *   cardio: number,
   *   cns: number,
   *   renal: number
   * }>>}
   */
  async getSofaHistory(patientId, admissionId) {
    if (!patientId || !admissionId) return [];
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/sofa/history`);
  },
};

export default sofaService;
