import path from 'path';
import vue from '@vitejs/plugin-vue';
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";


const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www',);
export default async () => {

    return {
        plugins: [
            vue({template: {compilerOptions: {isCustomElement: (tag) => tag.includes('swiper-')}}}), ,

        ],
        root: SRC_DIR,
        base: '',
        publicDir: PUBLIC_DIR,
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: 'globalThis'
                },
                plugins: [
                    NodeGlobalsPolyfillPlugin({process: true})
                ]
            }
        },
        build: {
            outDir: BUILD_DIR,
            assetsInlineLimit: 0,
            emptyOutDir: true,
            chunkSizeWarningLimit: 800,
            rollupOptions: {
                treeshake: false,
                output: {
                    manualChunks: {
                        'gui': ['vue', 'framework7', 'framework7-vue', 'dom7'],
                        'vex': ['vexaniumjs', 'eos-common', 'scatter-ts']
                    }
                }
            },
        },
        resolve: {
            alias: {
                '@': SRC_DIR,
                process: "process/browser",
                stream: "stream-browserify",
                util: "util/"
            },
        },
        server: {
            host: true,
        },

    };
}
