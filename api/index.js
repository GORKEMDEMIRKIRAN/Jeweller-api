


export default async function handler(req, res) {
    try {
        // Express app'i import et
        const { default: app } = await import('../dist/server.js');
        
        // Express app'i serverless'e adapt et
        return app(req, res);
        
    } catch (error) {
        console.error('Import failed:', error);
        return res.status(500).json({
            error: 'App import failed',
            details: error.message,
            buildCheck: 'Ensure dist/server.js exists'
        });
    }
}