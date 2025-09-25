

export default async function handler(req, res) {
    try {
        // Farklı path'leri deneyin
        const { default: app } = await import('../dist/server.js');
        // VEYA
        // const { default: app } = await import('../dist/src/server.js');
        
        return app(req, res);
    } catch (error) {
        console.error('Import Error:', error.message);
        console.error('Import Path:', '../dist/server.js');
        res.status(500).json({ 
            error: 'Server import failed', 
            details: error.message,
            path: '../dist/server.js'
        });
    }
}