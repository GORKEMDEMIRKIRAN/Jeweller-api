export default async function handler(req, res) {
    try {
        // app.js dosyasını import et (server.js yerine)
        const { default: app } = await import('../dist/app.js');
        
        console.log('App imported successfully');
        return app(req, res);
        
    } catch (error) {
        console.error('Import Error:', error);
        return res.status(500).json({
            error: 'App import failed',
            details: error.message,
            availableFiles: 'Check dist folder',
            timestamp: new Date().toISOString()
        });
    }
}