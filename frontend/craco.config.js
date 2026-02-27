const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  style: {
    postcss: {
      mode: 'file', // Это заставит craco использовать созданный выше postcss.config.js
    },
  },
};
