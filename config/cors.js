const corsConfig = {
    // origin: [
    //     'http://127.0.0.1:5000',
    //     'http://localhost:3000'
    // ],
    origin: true,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ['*', 'Authorization', ]
}
module.exports = corsConfig