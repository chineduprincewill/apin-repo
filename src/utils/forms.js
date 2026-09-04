import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com";

export const fetchForms = async (token, setForms, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/fetch-forms`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setForms(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const fetchActiveForms = async (token, setForms, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/active-forms`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setForms(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const updateForm = async (token, data, setSuccess, setError, setSaving) => {
    setSaving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSaving(false);
    }
};

export const fetchDomainOptions = async (token, data, setOptions, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.post(`${API_BASE}/domain-options`, data, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setOptions(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const adminDomainOptions = async (token, data, setOptions, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.post(`${API_BASE}/admin-domain-options`, data, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setOptions(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getVendorRegistrationStatus = async (token, setStatus, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.get(`${API_BASE}/vendor-registration-status`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setStatus(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const adminVendorRegistrationStatus = async (token, data, setStatus, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.post(`${API_BASE}/admin-vendor-registration-status`, data, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setStatus(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const addVendorRegistrationData = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/vendor-registration-data`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const getVendors = async (token, setVendors, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/vendors`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setVendors(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const fileUpload = async (token, data, setSuccess, setError, setUploading) => {
    setUploading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(
            `${API_BASE}/file-upload`, 
            data, 
            {
                headers: {
                    Accept: "application/json",
                    // Remove Content-Type for GET — may trigger preflight unnecessarily
                    Authorization: `Bearer ${token.trim()}`,
                },
                // withCredentials: true, // uncomment if the backend expects cookies
            }
        );
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUploading(false);
    }
};

export const getVendorDashboardStatistics = async (token, setStatistics, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/vendor-dashboard-statistics`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setStatistics(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getAdminRegistrationDocuments = async (token, setDocuments, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.get(`${API_BASE}/registration-documents`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setDocuments(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getAdminRegistrationFormfields = async (token, setList, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.get(`${API_BASE}/registration-formfields`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setList(response.data);
    } catch (err) {
        if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const updateDocumentValidationRule = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-document-validation-rule`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};

export const fetchFormfields = async (token, setFormfields, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/vendor-registration-form`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setFormfields(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const fetchAdminFormfields = async (token, data, setFormfields, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/admin-vendor-registration-form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setFormfields(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const loadVendorScoringForm = async (token, setFormfields, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/vendor-scoring-form`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setFormfields(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const submitVendorScores = async (token, data, setSuccess, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/submit-vendor-scores`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getVendorScores = async (token, data, setScores, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/vendor-scores`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setScores(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const submitVendorCategorization = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/submit-vendor-categorization`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const getVendorCategorizationResult = async (token, data, setCategorization, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/vendor-categorization-result`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setCategorization(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getSystemEmails = async (token, setEmails, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/system-emails`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setEmails(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const processApprovalRequest = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/process-approval-request`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const getNofifications = async (token, setNotifications, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/notifications`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setNotifications(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const readNofification = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/read-notification`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};

export const vendorConsent = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/vendor-consent`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const searchTrackingid = async (data, setSuccess, setError, setSearching) => {
    setSearching(true);
    try {
        /**if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }*/
        const response = await axios.post(`${API_BASE}/search-trackingid`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                //Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSearching(false);
    }
};

export const submitProcurementRequest = async (data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        /**if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }*/
        const response = await axios.post(`${API_BASE}/procurement-request`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                //Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const uploadProcurementDocuments = async (data, setSuccess, setError, setUploading) => {
    setUploading(true);
    try {
        const response = await axios.post(`${API_BASE}/procurement-documents`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUploading(false);
    }
};

export const getProcurementRequests = async (token, setRequests, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/procurement-requests`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setRequests(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const getProcurementRequestDocuments = async (token, data, setDocuments, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/procurement-request-documents`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setDocuments(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const submitVendorRating = async (token, data, setSucces, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/rate-vendor`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSucces(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const proceedToSubgrouping = async (token, data, setSucces, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/process-subgrouping`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSucces(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const fetchFormFieldCategories = async (token, data, setCategories, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/fetch-categories`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setCategories(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const addFormfieldGrouping = async (token, data, setSuccess, setError, setAdding) => {
    setAdding(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/add-category`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAdding(false);
    }
};

export const updateFormField = async (token, data, setSuccess, setError, setAdding) => {
    setAdding(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-formfield`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAdding(false);
    }
};

export const assignFormToUser = async (token, data, setSuccess, setError, setAssigning) => {
    setAssigning(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/assign-form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAssigning(false);
    }
};

export const fetchFormAssignments = async (token, data, setAssignments, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/form-assignments`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setAssignments(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};


export const removeUserAssignment = async (token, data, setSuccess, setError, setRemoving) => {
    setRemoving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/remove-assignment`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setRemoving(false);
    }
};


export const updateFormUid = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-uid`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};


export const updateFormdata = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};

export const finalizeRating = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/finalize-rating`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};


export const submitVendorForRating = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/submit-for-rating`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSubmitting(false);
    }
};

export const fetchFormdata = async (token, data, setFormdata, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/fetch-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setFormdata(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const removeFormdata = async (token, data, setSuccess, setError, setDeleting) => {
    setDeleting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/remove-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setDeleting(false);
    }
};

export const getDependentFieldOptions = async (token, data, setD_options, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/dependent-options`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setD_options(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const fetchFields = async (token, setFormfields, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/formfields`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setFormfields(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const fetchForm = async (token, data, setFields, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setFields(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const addField = async (token, data, setSuccess, setError, setAdding) => {
    setAdding(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/add-formfield`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAdding(false);
    }
};

export const notifyToRate = async (token, setNotifications, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/notify-to-rate`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setNotifications(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};