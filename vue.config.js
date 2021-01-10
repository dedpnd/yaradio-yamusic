/* eslint-disable prettier/prettier */
// const path = require("path");

module.exports = {
    transpileDependencies: ["vuetify"],
    // chainWebpack: config => {
    //     config.plugin("copy").tap(args => {
    //         args.push([{
    //             from: path.join(__dirname, "src/media"),
    //             to: path.join(__dirname, "dist_electron"),
    //             toType: "dir"
    //         }]); //add
    //         return args;
    //     });
    // },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
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
                    "icon": "./build/icons/icon.ico"
                }
            }
        },
    }
};