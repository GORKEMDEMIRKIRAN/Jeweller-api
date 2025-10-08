


export default async function handler(req, res) {
    try {
        console.log('=== HANDLER START ===');
        console.log('Working directory:', process.cwd());
        
        let app;
        
        // Önce root'daki server.js'yi dene
        try {
            console.log('Attempting import from root...');
            const { default: importedApp } = await import('../server.js');
            app = importedApp;
            console.log('✅ SUCCESS: Imported from root server.js');
        } catch (rootError) {
            console.log('❌ Root import failed:', rootError.message);
            
            // Sonra dist/server.js'yi dene
            try {
                console.log('Attempting import from dist...');
                const { default: importedApp } = await import('../dist/server.js');
                app = importedApp;
                console.log('✅ SUCCESS: Imported from dist/server.js');
            } catch (distError) {
                throw new Error(`Both imports failed - Root: ${rootError.message}, Dist: ${distError.message}`);
            }
        }
        
        if (typeof app !== 'function') {
            throw new Error(`Expected function, got ${typeof app}`);
        }
        
        console.log('✅ Calling Express app...');
        return app(req, res);
        
    } catch (error) {
        console.error('❌ HANDLER ERROR:', error.message);
        return res.status(500).json({
            error: 'Handler failed',
            message: error.message,
            cwd: process.cwd(),
            timestamp: new Date().toISOString()
        });
    }
}