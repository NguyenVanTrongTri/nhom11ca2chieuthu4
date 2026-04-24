// ============================================================
// CONFIG - Frontend User
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
        REGISTER:        "/auth/register",
        LOGIN:           "/auth/login",
        WORDS:           "/api/user/words",
        WORDS_CATEGORY:  "/api/user/words/category/{categoryId}",
        WORDS_SEARCH:    "/api/user/words/search",
        QUIZ:            "/api/user/quiz/{categoryId}",
        QUIZ_SUBMIT:     "/api/user/quiz/submit",
        PROGRESS:        "/api/user/progress/summary"
    },

    getUserApiUrl() { return this.USER_API_BASE_URL; },

    getEndpointUrl(endpoint, params = {}) {
        let url = this.USER_API_BASE_URL + endpoint;
        for (const [k, v] of Object.entries(params)) {
            url = url.replace(`{${k}}`, v);
        }
        return url;
    }
};
