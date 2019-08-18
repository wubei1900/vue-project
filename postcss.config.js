const path = require('path');

module.exports = {
    plugins: {
        'postcss-import': {
            resolve: function (id) {
                const match = id.match(/^\~?@styles\/(.*)/)
                if (match) {
                    return path.join(__dirname, 'app/styles', match[1]);
                }
                return id;
            }
        },
        'postcss-preset-env': {
            autoprefixer: {}
        },
        'cssnano': {}
    }
}