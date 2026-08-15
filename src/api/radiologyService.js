import apiClient from './client';

/**
 * Radiology Scans & Reports Service (FastAPI /patients/{patient_id}/admissions/{admission_id}/radiology)
 */
export const radiologyService = {
  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/radiology/images
   * Returns URLs or base64 data for scans fetched securely from Azure Blob Storage
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<Array<{
   *   id: string,
   *   title: string,
   *   modality: 'X-RAY' | 'CT' | 'MRI' | 'ULTRASOUND',
   *   date: string,
   *   imageUrl: string,
   *   thumbnailUrl?: string
   * }>>}
   */
  async getRadiologyImages(patientId, admissionId) {
    if (!patientId || !admissionId) return [];
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/radiology/images`);
  },

  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/radiology/reports
   * Returns radiologist text reports (Impression & Findings)
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<Array<{
   *   id: string,
   *   modality: string,
   *   date: string,
   *   radiologist: string,
   *   findings: string,
   *   impression: string,
   *   comparison?: string
   * }>>}
   */
  async getRadiologyReports(patientId, admissionId) {
    if (!patientId || !admissionId) return [];
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/radiology/reports`);
  },
};

export default radiologyService;
