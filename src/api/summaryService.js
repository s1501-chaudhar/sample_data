import apiClient from './client';

/**
 * AI Progress Summary Service (FastAPI /patients/{patient_id}/admissions/{admission_id}/summary)
 */
export const summaryService = {
  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/summary
   * Sends patient's vitals, labs, SOFA scores, and radiology notes to GPT models
   * and returns a synthesized plain-English clinical progress summary
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<{
   *   sofaSummary: string,
   *   vitalsSummary: string,
   *   labsSummary?: string,
   *   generatedAt: string
   * }>}
   */
  async getAiSummary(patientId, admissionId) {
    if (!patientId || !admissionId) return null;
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/summary`);
  },
};

export default summaryService;
