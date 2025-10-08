export default function handler(req, res) {
    try {
        // File system kontrolü için require kullan
        const fs = require('fs');
        const path = require('path');
        
        const distPath = path.join(process.cwd(), 'dist');
        const serverPath = path.join(process.cwd(), 'dist', 'server.js');
        
        const distExists = fs.existsSync(distPath);
        const serverExists = fs.existsSync(serverPath);
        
        let distFiles = [];
        if (distExists) {
            try {
                distFiles = fs.readdirSync(distPath);
            } catch (e) {
                distFiles = [`Error reading directory: ${e.message}`];
            }
        }
        
        return res.status(200).json({
            message: 'Debug info - File system check',
            cwd: process.cwd(),
            distExists,
            serverExists,
            distFiles,
            environment: process.env.NODE_ENV,
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        return res.status(500).json({
            error: 'Debug failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}