const BASE_URL = import.meta.env.VITE_OFFCHAIN_API_URL || "http://localhost:4000";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error((body && body.error) || `Request to ${path} failed with ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return body;
}

export const offchainApi = {
  createParticipant: (address, profile) => request("/api/participants", { method: "POST", body: JSON.stringify({ address, profile }) }),
  getParticipant: (address) => request(`/api/participants/${address}`),
  createBatch: (batchId, details) => request("/api/batches", { method: "POST", body: JSON.stringify({ batchId, details }) }),
  getBatch: (batchId) => request(`/api/batches/${batchId}`),
  createPrescription: (prescriptionRef, details) =>
    request("/api/prescriptions", { method: "POST", body: JSON.stringify({ prescriptionRef, details }) }),
  getPrescription: (prescriptionRef) => request(`/api/prescriptions/${prescriptionRef}`),
};

/// Fetches a resource and returns { data, error } instead of throwing, for
/// call sites (like the public verify page) that want to render a 404 or a
/// network failure as part of normal UI rather than an unhandled rejection.
export async function tryFetch(promiseFactory) {
  try {
    const data = await promiseFactory();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
