export default function handler(req, res) {
    try {
        console.log(`${req.method} ${req.url}`);
        
        // Express app'i import et ve direkt çağır
        import('../server.js')
            .then(({ default: app }) => {
                app(req, res); // Express app response'u handle edecek
            })
            .catch((e1) => {
                import('../dist/server.js')
                    .then(({ default: app }) => {
                        app(req, res);
                    })
                    .catch((e2) => {
                        res.status(500).json({
                            error: 'Import failed',
                            message: e2.message
                        });
                    });
            });
            
    } catch (error) {
        res.status(500).json({
            error: 'Handler failed',
            message: error.message
        });
    }
}