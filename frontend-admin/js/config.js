// ============================================================
// CONFIG - Frontend Admin
// ============================================================
const CONFIG = {
    // ---- LOCAL development ---------------------------------
    ADMIN_API_BASE_URL: "http://localhost:8080",
    USER_API_BASE_URL:  "http://localhost:8081",

    // ---- PRODUCTION (bỏ comment khi deploy) ---------------
    // ADMIN_API_BASE_URL: "https://backend-admin-vekl.onrender.com",
    // USER_API_BASE_URL:  "https://backend-user-oclw.onrender.com",

    TOKEN_KEY: "authToken",
    USER_KEY:  "currentUser",

    ENDPOINTS: {
        REGISTER:           "/auth/register",
        LOGIN:              "/auth/login",
        USERS:              "/users",
        UPDATE_ME:          "/users/me",
        VOCABULARY:         "/api/admin/vocabulary",
        DELETE_VOCABULARY:  "/api/admin/vocabulary/delete/{id}",
        ADMIN_HOME:         "/admin"
    },

    getAdminApiUrl() { return this.ADMIN_API_BASE_URL; },

    getEndpointUrl(endpoint, params = {}) {
        let url = this.ADMIN_API_BASE_URL + endpoint;
        for (const [k, v] of Object.entries(params)) {
            url = url.replace(`{${k}}`, v);
        }
        return url;
    }
};
