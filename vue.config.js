module.exports = {
    devServer: {
        disableHostCheck: true,
    },
    pwa: {
        name: 'RDrONE',
        themeColor: '#FFF',
        msTileColor: '#FFF',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'white',

        // настройки манифеста
        manifestOptions: {
            "theme_color": "#4a90e2",
            "background_color": "#fff",
            "display": "standalone",
            "scope": "/",
            "start_url": "/",
            "description": "This is RDrONE",
            "short_name": "RDrONE",
            "name": "RDrONE",
            "icons": [
                {
                    "src": "./img/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "./img/icons/icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png"
                },
                {
                    "src": "./img/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png"
                },
                {
                    "src": "./img/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                },
                {
                    "src": "./img/icons/maskable_icon.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ]
        },
    },
    publicPath: "/"
};