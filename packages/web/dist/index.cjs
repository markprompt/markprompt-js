'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./markprompt.prod.cjs');
} else {
  module.exports = require('./markprompt.dev.cjs');
}
