openssl x509 -in phlex_prod_cert.cer -inform DER -outform PEM -out phlex_prod_cert.pem
openssl pkcs12 -in phlex_prod_key.p12 -out phlex_prod_key.pem -nodes
