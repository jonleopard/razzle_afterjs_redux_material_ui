import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ensureReady, After } from '@jaredpalmer/after';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from '../common/theme'
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';


const store = configureStore(window.__PRELOADED_STATE__);

// This is needed in order to deduplicate the injection of CSS in the page.
const sheetsManager = new WeakMap();

ensureReady(routes).then(data =>
  hydrate(
    <Provider store={store}>
      <MuiThemeProvider sheetsManager={sheetsManager} theme={theme}>
        <BrowserRouter>
          <After data={data} routes={routes} />
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
    () => {
    // [ReHydratation](https://github.com/cssinjs/jss/blob/master/docs/ssr.md)
    const jssStyles = document.getElementById('jss-ssr');
    if (jssStyles && jssStyles.parentNode) 
      jssStyles.parentNode.removeChild(jssStyles);
    }
  )
);

if (module.hot) {
  module.hot.accept();
}
