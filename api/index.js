
export default async function handler(req, res) {
    try {
        console.log('Attempting to import server...');
        console.log('Process CWD:', process.cwd());
        
        // Dynamic import with error handling
        const { default: app } = await import('../dist/server.js');
        
        console.log('Server imported successfully');
        console.log('App type:', typeof app);
        
        if (typeof app === 'function') {
            return app(req, res);
        } else {
            throw new Error('Imported app is not a function');
        }
        
    } catch (error) {
        console.error('Import Error:', error);
        
        return res.status(500).json({
            error: 'Server import failed',
            message: error.message,
            stack: error.stack,
            cwd: process.cwd(),
            timestamp: new Date().toISOString()
        });
    }
}