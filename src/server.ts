
import app from "./app.js";
import { config } from './config/config.js';

if (process.env.NODE_ENV !== 'production') {
    app.listen(config.port, () => {
        console.log(`GOLD BORSE http://localhost:${config.port} address working....`);
    });
}

export default app;



