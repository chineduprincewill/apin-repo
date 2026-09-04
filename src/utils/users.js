import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com";

export const fetchUsers = async ( token, setUsers, setError, setLoading ) => {

    setLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/users`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setUsers(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
}

/**export const fetchOrgData = async ( token, setData, setError, setLoading ) => {

    setLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/organization`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
} */

export const fetchGeodata = async (token, setGeodata, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/geodata`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setGeodata(response.data);
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

export const newUser = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/new-account`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const updateUser = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-user`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const getUniqueBy = (arr, prop) => {
    const map = new Map();
    arr.forEach(item => {
        if (!map.has(item[prop])) {
        map.set(item[prop], item);
        }
    });
    return Array.from(map.values(), geo => geo.state);
};


export const fetchOffices = async ( token, setOffices, setError, setLoading ) => {

    setLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/offices`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setOffices(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
}


export const newOffice = async (token, data, setSuccess, setError, setSaving) => {
    setSaving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/office`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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


export const updateCoordinates = async (token, data, setSuccess, setError, setSaving) => {
    setSaving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/coordinates`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const fetchCoordinates = async (token, setCoordinates, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/coordinates`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setCoordinates(response.data);
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

export const updatePassword = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-password`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const updateProfile = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-profile`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const updateProfileRequestAction = async (token, data, setSuccess, setError, setApproving) => {
    setApproving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-profile-request-action`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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
        setApproving(false);
    }
};


export const fetchActivityLog = async ( token, setLog, setError, setLoading ) => {

    setLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/log`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        console.log(response.data);
        setLog(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
}

export const updateUserOfficeLocation = async (token, data, setSuccess, setError, setSaving) => {
    setSaving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/office-location`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const getUserOfficeLocation = async (token, setUserlocation, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/office-location`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setUserlocation(response.data);
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

export const getUserOfficeCoordinates = async (token, setUsercoordinates, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/user-office-coordinates`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setUsercoordinates(response.data);
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


export const getUserRecords = async (token, setRecords, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/user-logs`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setRecords(response.data);
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

export const newDirectorate = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/add-directorate`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const fetchAdminDirectorates = async (token, setDirectorates, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/admin-directorates`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setDirectorates(response.data);
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

export const fetchDirectorates = async (setDirectorates, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.get(`${API_BASE}/directorates`, {
            headers: {
                Accept: "application/json",
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setDirectorates(response.data);
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

export const newUnit = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/add-unit`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
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

export const fetchAdminUnits = async (token, setUnits, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/admin-units`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setUnits(response.data);
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


export const fetchUnits = async (data, setUnits, setError, setFetching) => {
    setFetching(true);
    try {
        const response = await axios.post(`${API_BASE}/units`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setUnits(response.data);
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
