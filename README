1. Configure `.env` files `.env.local` (serve) `.env.production` (build)

2. Obtain SSL Certificates:

 - Self-signed: 

  ```
  openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
  ```

  Wildcard certificate
  ```
  openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=domain.test' -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:domain.test,DNS:*.domain.test\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
  ```

- Let's Encrypt
  Manual config for certbot (LetsEncrypt). With manual config, certificated have to be renewed every 90 days

  ```
  certbot-auto certonly --manual --preferred-challenges=dns --email email@email.com --agree-tos -d mydomain.com,*.mydomain.com
  ```

3. Move SSL certificates to `./ssl` folder. See `./ssl/README` for details

4. Edit `nginx.conf` to include correct certificate names ( and possbile other settings as needed).

5. Rebuild docker image if needed.

