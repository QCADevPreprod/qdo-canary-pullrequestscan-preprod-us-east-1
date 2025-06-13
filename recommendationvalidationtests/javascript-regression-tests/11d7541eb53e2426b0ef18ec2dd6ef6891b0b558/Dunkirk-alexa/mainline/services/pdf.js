const wkhtmltopdf = require('wkhtmltopdf')
const express = require('express')
const app = express()



app.post('/test', (req, res) => {
    const html = req.body;
    return wkhtmltopdf(html, {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        orientation: 'portrait',
        pageSize: 'letter',
        printMediaType: true,
        debugJavascript: true,
        disableSmartShrinking: true,
        ignore: [/QSslSocket/],
      });
  })

