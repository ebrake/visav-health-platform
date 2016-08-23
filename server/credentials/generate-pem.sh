openssl x509 -in phlex_dev_cert.cer -inform DER -outform PEM -out phlex_dev_cert.pem
openssl pkcs12 -in phlex_dev_key.p12 -out phlex_dev_key.pem -nodes
