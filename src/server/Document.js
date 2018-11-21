// ./src/Document.js
import React from 'react';
import serialize from 'serialize-javascript';
import { Provider } from 'react-redux';
import { AfterRoot, AfterData } from '@jaredpalmer/after';

import {JssProvider, SheetsRegistry} from "react-jss";
import {createGenerateClassName} from "@material-ui/core/styles";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

export default class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {

    const sheets = new SheetsRegistry();
    const generateClassName = createGenerateClassName();
    const page = await renderPage(After => props => (
      <JssProvider registry={sheets} generateClassName={generateClassName}>
        <MuiThemeProvider sheetsManager={new Map()}>
          <After {...props} />
        </MuiThemeProvider>
      </JssProvider>
      ));
    
    return { assets, data, sheets, ...page };
  }

 render() {
    const { helmet, assets, data, sheets, serverState } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Welcome to the Afterparty</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <style type="text/css">
            {sheets.toString()}
          </style>
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data}/>
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
          <span
            dangerouslySetInnerHTML={
              { __html: `<script>window.__PRELOADED_STATE__ = ${serialize(serverState)}</script>` } // prettier-ignore
            }
      />
        </body>
      </html>
    );
  }
}
