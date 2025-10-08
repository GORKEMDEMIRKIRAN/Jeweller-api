export default async function handler(req, res) {
    try {
        console.log('=== DEBUG START ===');
        console.log('Request URL:', req.url);
        console.log('Request Method:', req.method);
        console.log('Working Directory:', process.cwd());
        
        // File system kontrolü
        const fs = await import('fs');
        const path = await import('path');
        
        const serverPath = path.resolve(process.cwd(), 'dist', 'server.js');
        console.log('Looking for server.js at:', serverPath);
        
        const serverExists = fs.existsSync(serverPath);
        console.log('Server.js exists:', serverExists);
        
        if (serverExists) {
            console.log('Attempting to import server.js...');
            const { default: app } = await import('../dist/server.js');
            console.log('Import successful, app type:', typeof app);
            
            if (typeof app === 'function') {
                console.log('Calling app function...');
                return app(req, res);
            } else {
                throw new Error(`Expected function, got ${typeof app}`);
            }
        } else {
            throw new Error('server.js not found');
        }
        
    } catch (error) {
        console.error('=== ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return res.status(500).json({
            error: 'Handler failed',
            message: error.message,
            cwd: process.cwd(),
            timestamp: new Date().toISOString()
        });
    }
}