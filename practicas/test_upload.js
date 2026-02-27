const http = require('http');
const fs = require('fs');
const path = require('path');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const data = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="section"',
    '',
    'mejora',
    `--${boundary}`,
    'Content-Disposition: form-data; name="category"',
    '',
    'Procedimientos',
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"; filename="test.pdf"',
    'Content-Type: application/pdf',
    '',
    'PDF content here',
    `--${boundary}--`,
    ''
].join('\r\n');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/sgi/upload',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    console.log('STATUS:', res.statusCode);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('BODY:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
