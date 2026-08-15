import apiClient from './client';

/**
 * Patient Selection & Demographics Service (FastAPI /patients)
 */
export const patientService = {
  /**
   * GET /patients
   * Returns a list of all unique Patient IDs
   * @returns {Promise<string[]>} e.g. ["P001", "P002", "P003", "P004"]
   */
  async getPatients() {
    return apiClient.get('/patients');
  },

  /**
   * GET /patients/{patient_id}/admissions
   * Returns a list of hospital admissions for the selected patient
   * @param {string} patientId - e.g. "P001"
   * @returns {Promise<string[]>} e.g. ["ADM001", "ADM002"]
   */
  async getAdmissions(patientId) {
    if (!patientId) return [];
    return apiClient.get(`/patients/${patientId}/admissions`);
  },

  /**
   * GET /patients/{patient_id}/admissions/{admission_id}/info
   * Returns patient demographics & clinical metadata
   * @param {string} patientId - e.g. "P001"
   * @param {string} admissionId - e.g. "ADM001"
   * @returns {Promise<{
   *   name: string,
   *   age: number,
   *   gender: string,
   *   diagnosis: string,
   *   physician: string,
   *   admissionDate: string,
   *   patientId: string,
   *   admissionId: string
   * }>}
   */
  async getPatientInfo(patientId, admissionId) {
    if (!patientId || !admissionId) return null;
    return apiClient.get(`/patients/${patientId}/admissions/${admissionId}/info`);
  },
};

export default patientService;
