// SDK-54 compat: see metro-error-overlay-stub.js for why this resolver override
// exists. Maps the missing `@expo/metro-runtime/error-overlay` subpath (required
// by expo-router@6.0.24 but absent from the published 56.x metro-runtime) to a
// local passthrough stub so Metro can bundle.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@expo/metro-runtime/error-overlay') {
    return {
      type: 'sourceFile',
      filePath: require.resolve('./metro-error-overlay-stub.js'),
    };
  }
  const resolve = upstreamResolveRequest ?? context.resolveRequest;
  return resolve(context, moduleName, platform);
};

module.exports = config;
