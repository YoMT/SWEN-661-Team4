// SDK-54 compat shim.
// expo-router@6.0.24 imports `@expo/metro-runtime/error-overlay` (dev-only redbox
// wrapper), but that subpath only ships in @expo/metro-runtime ~6.1.2, which was
// never published to this registry (only the 56.x line exists, and it lacks the
// subpath). This passthrough lets Metro resolve the import; the app loses the
// fancy dev error overlay but otherwise runs unchanged.
module.exports = { withErrorOverlay: (Component) => Component };
