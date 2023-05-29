import {app} from './app.js';
import {PORT} from './utils/config.js';
import {infoM} from './utils/logger.js';

app.listen(PORT, () => {
    infoM(`Server running on port ${PORT}`);
  });

