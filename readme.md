Facebook app test project

### Canvas Page
https://apps.facebook.com/mgatlandtestapp

### Secure canvas URL:
https://cryptic-cove-9988.herokuapp.com/

### Then I added a test app to facebook that has url:
https://localhost:3000

### How I generated the key and cert:

To serve https locally, I needed a key and cert.

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem -config "C:\Program Files (x86)\Git\ssl\openssl.cnf"

Then I ran `node index.js` and the server hosted at https://localhost:3000

I had to ask my browser to allow my dody self-signed certificate

and then I could open the page in facebook: `https://apps.facebook.com/mgatlandtest/`

### but socket.io wasn't working

I had to change socket.io to use https now, instead of http

### still not done yet

In my test app, the `App Domains` are blank
The `Secure Canvas URL` should be https://local.cryptic-cove-9988.herokuapp.com:3000/

This is a fake URL that doesn't really go anywhere.

Then on my own computer, I edit my HOSTS file to make that url point to localhost - just for me on this computer.

now the site loads and logs in with facebook - on the test version only.

https://apps.facebook.com/mgatlandtest/

### now the non-test version

OK, I did some quick hacks so all those HTTPS changes don't happen on Heroku. (Heroku seems to do its own HTTPS stuff and we just pretend we're serving HTTP. So, now our own HTTPS code and keys and certs are only used locally.)

That fixed it at 
https://cryptic-cove-9988.herokuapp.com/

So now the app works at both:

'production'
https://apps.facebook.com/mgatlandtestapp/

'dev'
https://apps.facebook.com/mgatlandtest/
