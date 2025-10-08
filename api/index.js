export default function handler(req, res) {
    res.status(200).json({
        message: 'API is working!',
        build_status: 'Testing without dist import',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
    });
}