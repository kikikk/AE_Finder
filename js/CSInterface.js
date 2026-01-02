/**
 * CSInterface - Adobe CEP Interface Library
 * Minimal version for AE Finder
 */

function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    try {
        window.__adobe_cep__.evalScript(script, callback);
    } catch (e) {
        console.error('evalScript error:', e);
        if (callback) callback(null);
    }
};

CSInterface.prototype.getSystemPath = function(pathType) {
    try {
        return window.__adobe_cep__.getSystemPath(pathType);
    } catch (e) {
        return '';
    }
};

CSInterface.prototype.getHostEnvironment = function() {
    try {
        return JSON.parse(window.__adobe_cep__.getHostEnvironment());
    } catch (e) {
        return {};
    }
};

// System path constants
CSInterface.prototype.EXTENSION_PATH = 'extension';
CSInterface.prototype.USER_DATA = 'userData';

// Export
if (typeof module !== 'undefined') {
    module.exports = CSInterface;
}
