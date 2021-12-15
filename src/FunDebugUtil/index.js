import fundebug from 'fundebug-javascript';

// multi error listeners
const onerrorFunDenug = window.onerror;
window.addEventListener('error', function(e) {
    onerrorFunDenug(e.message, e.filename, e.lineno, e.colno, e.error);
}, false);
window.onerror = null;

export default class FunDebugUtil {
  static init(key, env = 'development', version, username = '', options = {}) {

    fundebug.apikey = key;
    fundebug.appversion = version;
    fundebug.user = {
        name: username,
    };
    fundebug.metaData = options;

    const envMap = {
        development: 'development',
        dev: 'development',
        qafc: 'test',
        pre: 'test',
        online: 'production',
        local: 'development',
    };

    fundebug.releasestage = envMap[env];
  }
}

FunDebugUtil.notify = fundebug.notify;
FunDebugUtil.notifyError = fundebug.notifyError;
FunDebugUtil.notifyHttpError = fundebug.notifyHttpError;

export {
    fundebug,
};
  