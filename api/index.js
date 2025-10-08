export default async function handler(req, res) {
    const debugInfo = {
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        cwd: process.cwd()
    };
    
    try {
        debugInfo.step = 'Starting file system check';
        
        const fs = await import('fs');
        const path = await import('path');
        
        const serverPath = path.resolve(process.cwd(), 'dist', 'server.js');
        debugInfo.serverPath = serverPath;
        debugInfo.serverExists = fs.existsSync(serverPath);
        
        if (debugInfo.serverExists) {
            debugInfo.step = 'Attempting import';
            const { default: app } = await import('../dist/server.js');
            debugInfo.appType = typeof app;
            
            if (typeof app === 'function') {
                debugInfo.step = 'Calling app function';
                return app(req, res);
            } else {
                throw new Error(`Expected function, got ${typeof app}`);
            }
        } else {
            throw new Error('server.js not found');
        }
        
    } catch (error) {
        debugInfo.error = error.message;
        debugInfo.stack = error.stack;
        
        return res.status(500).json({
            debug: debugInfo,
            error: 'Handler failed'
        });
    }
}