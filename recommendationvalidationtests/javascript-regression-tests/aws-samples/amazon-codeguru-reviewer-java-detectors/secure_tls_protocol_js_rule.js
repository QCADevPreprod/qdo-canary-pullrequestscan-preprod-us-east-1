//{fact rule=secure_tls_protocol@v1.0 defects=1}
function non_conformant1(){

    let options = {
        secureProtocol: 'TLSv1_method' // Noncompliant: TLS1.0 is insecure
      };
    tls.connect(443, "www.example.com", options, () => { });
}

//{fact rule=secure_tls_protocol@v1.0 defects=0}
function conformant1(){

    let options = {
        secureProtocol: 'TLSv1_2_method' // compliant: TLS2.0 is secure
      };
    tls.connect(443, "www.example.com", options, () => { });
}