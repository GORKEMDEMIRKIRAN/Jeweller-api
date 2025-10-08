export default async function handler(req, res) {
    try {
        // server.js dosyasını import et (doğru entry point)
        const { default: app } = await import('../dist/server.js');
        
        console.log('Server imported successfully');
        return app(req, res);
        
    } catch (error) {
        console.error('Import Error:', error);
        return res.status(500).json({
            error: 'Server import failed',
            details: error.message,
            importPath: '../dist/server.js',
            timestamp: new Date().toISOString()
        });
    }
}