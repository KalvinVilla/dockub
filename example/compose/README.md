# How to launch app

1. Clone the repository and build the container

```bash
git clone https://github.com/KalvinVilla/dockub
cd dockup
docker build -t dockup -f Dockerfile .
```

2. Create an openssl config file, here is a template

Go to `cd example/compose` and create openssl.cnf

```toml
# openssl.cnf
[ req ]
# You can let's this value by default
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
x509_extensions    = v3_req

[ dn ]
C  = <COUNTRY-ALPHA-2 Code>
ST = <COUNTRY>
L  = <CITY>
O  = <ORGANISATION>
OU = <DEPARTEMENT>
CN = <DOMAIN-NAME>
emailAddress = <EMAIL>

[ v3_req ]
subjectAltName = @alt_names

[ alt_names ]
IP.1 = <SERVER-IP>
DNS.0 = <DNS>
```

3. Configure env file

Rename `.env.example` to `.env` & change value app_key & web push options using the command

4. Create certificate & private key

```sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
 -keyout nginx/certs/server.key \
 -out nginx/certs/server.crt \
 -config openssl.cnf
```

5. Start container

```sh
docker compose up -d
```
