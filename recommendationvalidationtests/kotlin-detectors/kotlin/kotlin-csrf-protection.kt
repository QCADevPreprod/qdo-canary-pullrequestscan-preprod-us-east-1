import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

class CSRFProtection {

    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        @Throws(Exception::class)
        protected fun configure(http: HttpSecurity) {
            http {
                // ruleid: kotlin-csrf-protection
                csrf().disable()
                // Other security configurations...
            }
        }
    }

    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        @Throws(Exception::class)
        protected fun configure(http: HttpSecurity) {
            http {
                // ruleid: kotlin-csrf-protection
                csrf {
                    disable()
                    }
                }
            }
        }

    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        override fun configure(http: HttpSecurity) {
            http {
                // ruleid: kotlin-csrf-protection
                csrf().ignoringAntMatchers("/api/**") // Disabling CSRF protection for specific URL patterns.
                // Other security configurations...
            }
        }
    }


    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        override fun configure(http: HttpSecurity) {
            http {
                // ruleid: kotlin-csrf-protection
                csrf().ignoringRequestMatchers{ request ->
                    request.method == HttpMethod.GET.name // Disabling CSRF protection for specific HTTP method.
                }
                // Other security configurations...
            }
        }
    }


    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        override fun configure(http: HttpSecurity) {
            http {
                // ruleid: kotlin-csrf-protection
                csrf {
                    ignoringRequestMatchers { request ->
                        request.requestURI.startsWith("/api/public/")
                    }
                }
                // Other security configurations...
            }
        }
    }



    @Configuration
    @EnableWebSecurity
    class SecurityConfig {

        @Bean
        open fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
            http {
                // ruleid: kotlin-csrf-protection
                csrf {
                    csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse()
                }
            }
            return http.build()
        }
    }

    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {

        @Throws(Exception::class)
        override fun configure(http: HttpSecurity) {
            http {
                // ok: kotlin-csrf-protection
                csrf { }
                // Other security configurations...
            }
        }
    }

    @Configuration
    @EnableWebSecurity
    class WebSecurityConfig : WebSecurityConfigurerAdapter() {
        override fun configure(http: HttpSecurity) {
            http {
                // ok: kotlin-csrf-protection
                csrf().someMethod("/api/**") 
                // Other security configurations...
            }
        }
    }
}
