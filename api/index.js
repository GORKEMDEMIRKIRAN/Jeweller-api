export default function handler(req, res) {
    res.status(200).json({
        message: 'GOLD BORSE API is working!',
        test: 'File-based routing',
        timestamp: new Date().toISOString()
    });
}