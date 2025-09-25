

export default async function handler(req, res) {
    try {
        const { default: app } = await import('../dist/server.js');
        return app(req, res);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Server import failed', 
            details: error.message 
        });
    }
}