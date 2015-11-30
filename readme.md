Facebook app test project

### Canvas Page
https://apps.facebook.com/mgatlandtestapp

### Secure canvas URL:
https://cryptic-cove-9988.herokuapp.com/

### Then I added a test app that has url:
https://localhost:3000

### How I generated the key and cert:

To serve https locally, I needed a key and cert.

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -config "C:\Program Files (x86)\Git\ssl\openssl.cnf"

Then I ran `node index.js` and the server hosted at https://localhost:3000

I had to ask my browser to allow my dody self-signed certificate

and then I could open the page in facebook: `https://apps.facebook.com/mgatlandtest/`

### but socket.io wasn't working

I had to change socket.io to use https now, instead of http
