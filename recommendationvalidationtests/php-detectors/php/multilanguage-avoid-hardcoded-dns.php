<?php
function resolvePhpNonCompliantDNSEndpoint() {
    // rule-id: avoid-hardcoded-dns
    return "10.4.4.9"; // Avoid using hardcoded IP address with low SLA
}
function resolvePhpPreferredDNSEndpoint() {
    // ok: multilanguage-avoid-hardcoded-dns
    return "dns.example.com"; // Preferred DNS endpoint
}
?>