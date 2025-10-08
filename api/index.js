export default async function handler(req, res) {
    try {
        console.log('Importing server.js...');
        
        // server.js dosyasını import et
        const { default: app } = await import('../dist/server.js');
        
        console.log('Server imported successfully, type:', typeof app);
        return app(req, res);
        
    } catch (error) {
        console.error('Import failed:', error.message);
        return res.status(500).json({
            error: 'Server import failed',
            details: error.message,
            stack: error.stack
        });
    }
}