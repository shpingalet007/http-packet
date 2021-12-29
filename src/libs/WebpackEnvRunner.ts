/**
 * Small hack to allow running Webpack process.env.BROWSER
 * checks on run. This is needed for CommonJS build, as is
 * compiled by Typescript. Dirty way, could be replaced in
 * near future.
 */

const isRealBrowser = (typeof window !== 'undefined');
const isBrowserCompilation = (process.env.BROWSER === 'true');

export default () => (isRealBrowser || isBrowserCompilation);
