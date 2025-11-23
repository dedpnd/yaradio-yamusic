/* eslint-disable prettier/prettier */
const path = require("path");

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        // Use a supported hash algorithm on Node 17+ to avoid OpenSSL errors
        config.output.hashFunction("sha256");
        config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
        // config.plugin("copy").tap(args => {
        //     args.push([{
        //         from: path.join(__dirname, "src/media"),
        //         to: path.join(__dirname, "dist_electron"),
        //         toType: "dir"
        //     }]); //add
        //     return args;
        // });
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            chainWebpackMainProcess: config => {
                config.output.hashFunction("sha256");
                config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
            },
            chainWebpackRendererProcess: config => {
                config.output.hashFunction("sha256");
                config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
            },
            builderOptions: {
                "publish": ['github'],
                "productName": "YaMusic.app",
                "appId": "com.github.dedpnd.yamusic",
                "win": {
                    "target": [
                        "nsis"
                    ],
                    "icon": "./build/icons/icon.ico"
                },
                "mac": {
                    "category": "public.app-category.music",
                    "target": [
                        "dmg"
                    ],
                    "icon": "./build/icons/icon.icns"
                },
                "linux": {
                    "category": "Audio",
                    "target": [
                        "AppImage",
                        "deb"
                    ],
                    "icon": "./build/icons/256x256.png"
                }
            }
        },
    }
};
