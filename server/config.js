module.exports = {
    PORT: 8000,
    CURRENT_ACCEPT_USER:3,
    ALLOWED_CLIENT: {
       ORIGIN: ["http://localhost:3001", "http://localhost:3002"],
       METHODS: ["GET", "POST", "PUT", "DELETE"]
    },
}