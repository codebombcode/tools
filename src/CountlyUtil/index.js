export default class CountlyUtil {
  static init(key, env = 'development') {
    const countlyConfig =  {
      "sdk": {
        "online": "http://countly.toobob.com/sdk/web/countly.min.js",
        "pre": "http://countly.ops.com/sdk/web/countly.min.js",
        "qaif": "http://countly.ops.com/sdk/web/countly.min.js",
        "qafc": "http://countly.ops.com/sdk/web/countly.min.js",
        "dev": "http://countly.ops.com/sdk/web/countly.min.js",
        "development": "http://countly.ops.com/sdk/web/countly.min.js"
      },
      "url": {
        "online": "http://countly.toobob.com",
        "pre": "http://countly.ops.com",
        "qaif": "http://countly.ops.com",
        "qafc": "http://countly.ops.com",
        "dev": "http://countly.ops.com",
        "development": "http://countly.ops.com"
      },
    }

    if (env === 'local') {
      env = 'development';
    }
    const countlySdkUrl = countlyConfig.sdk[env];
    const countlyUrl = countlyConfig.url[env];
    const countlyAppKey = key;

    global.Countly = global.Countly || {};
    global.Countly.q = global.Countly.q || [];

    // load countly script asynchronously
    // provide countly initialization parameters
    global.Countly.q.push(['track_sessions']);
    global.Countly.q.push(['track_pageview']);
    global.Countly.q.push(['track_clicks']);
    global.Countly.q.push(['track_errors']);
    global.Countly.q.push(['track_links']);
    global.Countly.q.push(['track_forms']);
    global.Countly.q.push(['collect_from_forms']);

    global.Countly.app_key = countlyAppKey;
    global.Countly.url = countlyUrl;
    const cly = document.createElement('script');
    cly.type = 'text/javascript';
    cly.async = true;
    // enter url of script here
    cly.src = `${countlySdkUrl}`;

    let retry = 0;
    cly.onload = () => {
      let initCountly = () => {
        if (typeof global.Countly.init !== 'function') {
          setTimeout(initCountly, 250);

          // everytime we try to init countly, dont forget to increase the retry counter
          retry += 1;

          if (retry > 40) {
            // clear this interval function after 40 retries, that is, 10s
            initCountly = null;
            throw new Error('Countly cannot be initialized, it seems that you are in terrible a network.');
          }
        } else {
          global.Countly.init();
          // multi error listeners
          const onerrorCountly = window.onerror;
          window.addEventListener('error', function(e) {
              onerrorCountly(e.message, e.filename, e.lineno, e.colno, e.error);
          }, false);
          window.onerror = null;
        }
      };

      initCountly();
    };
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(cly, s);
  }
}
  