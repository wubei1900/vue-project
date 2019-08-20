const path = require('path');
const postcss = require('postcss');
const updateRule = require('postcss-sprites/lib/core').updateRule;
const revHash = require('rev-hash');

const spritePath = process.env.NODE_ENV === 'development' ? './build/' : './dist/';

module.exports = {
    plugins: {
		'postcss-import': {
            resolve: function (id) {
                const match = id.match(/^\~?\@styles\/(.*)/);
                if (match) {
                    return path.join(__dirname, 'app/styles', match[1]);
                }
                return id;
            }
        },
		'postcss-url': {
			url: function (asset) {
                const { url } = asset;
                const match = url.match(/^\~\@(.*)/);
                if (match) {
                    return path.join(__dirname, 'app/', match[1]);
                }
                return url;
			}
		},
        'postcss-preset-env': {
            autoprefixer: {},
            importFrom: path.resolve(__dirname, 'app/styles/root.css'),
            preserve: false
        },
        'postcss-sprites': {
            retina: false,
            spritesmith: {
                padding: 5
            },
            basePath: './',
            spritePath,
            filterBy: function (image) {
                if (/static\\sprites/.test(image.url)) {
                    return Promise.resolve();
                }
                return Promise.reject();
            },
            hooks: {
                onUpdateRule: function (rule, token, image) {
                    updateRule(rule, token, image);
                    ['width', 'height'].forEach(function (prop) {
                        var value = image.coords[prop];
                        if (image.retina) {
                            value /= image.ratio;
                        }
                        rule.insertAfter(rule.last, postcss.decl({
                            prop: prop,
                            value: value + 'px'
                        }));
                    });
                },
                onSaveSpritesheet: function (opts, spritesheet) {
                    return path.join(
                        opts.spritePath,
                        spritesheet.groups.concat([
                            revHash(spritesheet.image),
                            spritesheet.extension
                        ]).join('.')
                    );
                }
            }
        },
        'cssnano': {}
    }
}