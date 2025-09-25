

export default function handler(req, res) {
    res.status(200).json({ 
        message: 'GOLD BORSE API is working!',
        method: req.method,
        url: req.url,
        build_test: 'Simple handler working',
        timestamp: new Date().toISOString()
    });
}