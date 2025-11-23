/* eslint-disable prettier/prettier */
const path = require("path");
const webpack = require("webpack");

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: config => {
        // Use a supported hash algorithm on Node 17+ to avoid OpenSSL errors
        config.output.hashFunction("sha256");
        config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
        config.resolve.alias.set("vue-cli-plugin-electron-builder/lib/installVueDevtools", path.resolve(__dirname, "src/electron/noop-devtools.js"));
        config.resolve.alias.set("electron-devtools-installer", path.resolve(__dirname, "src/electron/noop-electron-devtools-installer.js"));
        // Disable fork-ts-checker (spawns a child process that can fail with EPERM on some Windows setups)
        config.plugins.delete("fork-ts-checker");
        config
            .plugin("replace-devtools")
            .use(webpack.NormalModuleReplacementPlugin, [
                /vue-cli-plugin-electron-builder[\\/]lib[\\/]installVueDevtools/,
                path.resolve(__dirname, "src/electron/noop-devtools.js")
            ]);
        // config.plugin("copy").tap(args => {
        //     args.push([{
        //         from: path.join(__dirname, "src/media"),
        //         to: path.join(__dirname, "dist_electron"),
        //         toType: "dir"
        //     }]); //add
        //     return args;
        // });
    },
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    quietDeps: true,
                    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "slash-div"]
                }
            },
            scss: {
                sassOptions: {
                    quietDeps: true,
                    silenceDeprecations: ["legacy-js-api", "import", "global-builtin", "slash-div"]
                }
            }
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            chainWebpackMainProcess: config => {
                config.output.hashFunction("sha256");
                config.resolve.alias.set("vue-cli-plugin-electron-builder/lib/installVueDevtools", path.resolve(__dirname, "src/electron/noop-devtools.js"));
                config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
                config.resolve.alias.set("electron-devtools-installer", path.resolve(__dirname, "src/electron/noop-electron-devtools-installer.js"));
                config
                    .plugin("replace-devtools-main")
                    .use(webpack.NormalModuleReplacementPlugin, [
                        /vue-cli-plugin-electron-builder[\\/]lib[\\/]installVueDevtools/,
                        path.resolve(__dirname, "src/electron/noop-devtools.js")
                    ]);
            },
            chainWebpackRendererProcess: config => {
                config.output.hashFunction("sha256");
                config.resolve.alias.set("vue-cli-plugin-electron-builder/lib/installVueDevtools", path.resolve(__dirname, "src/electron/noop-devtools.js"));
                config.resolve.alias.set("fs/promises", path.resolve(__dirname, "src/electron/fs-promises-shim.js"));
                config.resolve.alias.set("electron-devtools-installer", path.resolve(__dirname, "src/electron/noop-electron-devtools-installer.js"));
                config
                    .plugin("replace-devtools-renderer")
                    .use(webpack.NormalModuleReplacementPlugin, [
                        /vue-cli-plugin-electron-builder[\\/]lib[\\/]installVueDevtools/,
                        path.resolve(__dirname, "src/electron/noop-devtools.js")
                    ]);
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
