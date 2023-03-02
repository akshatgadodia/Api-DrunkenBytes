const corsHandler = (req, res, next) => {
    const supportOrigin = [
        "http://localhost:3000/",
        "http://localhost:3000",
        "https://support-drunkenbytes.vercel.app/",
        "https://support-drunkenbytes.vercel.app"
    ];
    const mainOrigin = [
        "http://localhost:3005/",
        "http://localhost:3005",
        "https://drunkenbytes.vercel.app/",
        "https://drunkenbytes.vercel.app"
    ];

    const origin = req.get("origin");
    if (supportOrigin.includes(origin)) {
        req.originSource = "SUPPORT";
    } else if (mainOrigin.includes(origin)) {
        req.originSource = "MAIN";
    } else {
        req.originSource = "ANOTHER"
    }
    next();
};

module.exports = corsHandler;