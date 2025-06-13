import com.amazon.coral.metrics.*
import com.amazon.coral.metrics.helper.MetricsHelper
import com.amazon.coral.metrics.helper.QuerylogHelper
import com.google.common.collect.ImmutableList
import javax.inject.Inject
import javax.inject.Singleton

class ImproperCoralMetricsFactoryInstantiation @Inject constructor(
    private val metricsFactory1: MetricsFactory
) {

    // Noncompliant Cases

    fun getMetricsFactoryNoncompliant1(): MetricsFactory {
        val root = System.getProperty("root")
        val realm = AppConfig.getRealm().name
        val domain = AppConfig.getDomain()

        // Non-Compliant: Consider using a singleton instead of creating a new instance of 'MetricsFactory' each time.
        // ruleid: kotlin-metrics-factory
        val metricsFactory = MetricsHelper()
        val queryLogHelper = QuerylogHelper()
        queryLogHelper.filename = "$root/var/output/logs/service_log"
        metricsFactory.reporters = ImmutableList.of(queryLogHelper)
        metricsFactory.program = APP_NAME
        metricsFactory.marketplace = "$APP_NAME:$domain:$realm"
        return metricsFactory
    }

    fun getMetricsFactoryNoncompliant2(): MetricsFactory {
        // Non-Compliant: Consider using a singleton instead of creating a new instance of 'MetricsFactory' each time.
        // ruleid: kotlin-metrics-factory
        val metricsFactory = NullMetricsFactory()
        val queryLogHelper = QuerylogHelper()
        queryLogHelper.filename = root + "/var/output/logs/service_log"
        metricsFactory.reporters = ImmutableList.of(queryLogHelper)
        return metricsFactory
    }

    private fun getMetricsNoncompliant3(): Metrics {
        val reporterFactory = QuerylogReporterFactory(System.out)

        // Non-Compliant: Consider using a singleton instead of creating a new instance of 'MetricsFactory' each time.
        // ruleid: kotlin-metrics-factory
        val metricsFactory = DefaultMetricsFactory(reporterFactory)

        return metricsFactory.newMetrics()
    }

    fun getMetricsFactoryNoncompliant4(cloudWatchReporter: ReporterFactory): MetricsFactory {
        // Non-Compliant: Consider using a singleton instead of creating a new instance of 'MetricsFactory' each time.
        // ruleid: kotlin-metrics-factory
        return DefaultMetricsFactory(cloudWatchReporter)
    }

    // Compliant Cases

    // Compliant: `MetricsFactory` object is injected and reused.
    private fun getMetricsCompliant1(): Metrics {
        // ok: kotlin-metrics-factory
        return metricsFactory1.newMetrics()
    }

    @Provides
    @Singleton
    fun getMetricsFactoryCompliant2(): MetricsFactory {
        // Compliant: `@Singleton` is used to instantiate the object only once.
        // ok: kotlin-metrics-factory
        val metricsFactory = MetricsHelper()
        val cloudWatchReporterFactory = CloudWatchReporterFactory()
        val cloudwatch = AmazonCloudWatchClientBuilder.standard().withRegion(getRegion().name).build()
        cloudWatchReporterFactory.withCloudWatchClient(cloudwatch)
        cloudWatchReporterFactory.withAutoFlush(false)
        cloudWatchReporterFactory.withNamespace("nitasthhelloworld")

        val queryLogHelper = QuerylogHelper()
        queryLogHelper.filename = root + "/var/output/logs/service_log"
        metricsFactory.reporters = ImmutableList.of(queryLogHelper, cloudWatchReporterFactory)
        metricsFactory.program = "nitasthhelloworld"
        metricsFactory.marketplace = "nitasthhelloworld:$domain:$realm"
        return metricsFactory
    }

    fun isHealthyCompliant3(): Boolean {
        // Compliant: No detection expected if the object is not returned.
        // ok: kotlin-metrics-factory
        val metricsFactory = NullMetricsFactory()
        MetricsContext.setMetrics(metricsFactory.newMetrics())
        return try {
            checkDnsCache()
            checkConfig()
            checkDynamoDbDataStores()
            MetricsContext.getMetrics().close()
            true
        } catch (exception: Exception) {
            LOG.error("Encountered exception during deep ping: ${exception.message}", exception)
            MetricsContext.getMetrics().close()
            false
        }
    }

    private val metricsFactory2 = NullMetricsFactory()

    fun getMetricsCompliant4(): Metrics {
        // Compliant: A global instance is being used.
        // ok: kotlin-metrics-factory
        val metrics = metricsFactory2.newMetrics()
        metrics.addDate("StartTime", System.currentTimeMillis())
        return metrics
    }

    @Singleton
    fun getMetricsFactoryCompliant5(cloudWatchReporter: ReporterFactory): MetricsFactory {
        // Compliant: `@Singleton` is used to instantiate the object only once.
        // ok: kotlin-metrics-factory
        return DefaultMetricsFactory(cloudWatchReporter)
    }

    @Bean
    fun metricsFactoryCompliant6(appConfig: Config): MetricsFactory {
        val querylogHelper = QuerylogHelper()
        querylogHelper.filename = appConfig.root + "/var/output/logs/service_log"

        // Compliant: `@Bean` has been used.
        // ok: kotlin-metrics-factory
        val metricsHelper = MetricsHelper()
        metricsHelper.reporters = querylogHelper
        metricsHelper.program = PROGRAM_NAME
        metricsHelper.marketplace = "${appConfig.domain}-${appConfig.realm}"
        metricsHelper.addSensors(HeapLiveSetSensor())
        val metricCollector = CoralRequestMetricCollector.Builder()
            .withDefaultMetricAdapters()
            .build(metricsHelper)
        val newMetricCollector = CoralMetricCollector(metricCollector)
        AwsSdkMetrics.setMetricCollector(newMetricCollector)
        return metricsHelper
    }

    @Bean(name = ["MetricsFactory"])
    fun metricsFactoryCompliant7(@Value("\${domain}") domain: String, @Value("\${root}") root: String, @Value("\${realm}") realm: String): MetricsHelper {
        val queryLogHelper = QuerylogHelper()
        queryLogHelper.filename = root + SERVICE_LOG_PATH

        // Compliant: `@Bean` has been used.
        // ok: kotlin-metrics-factory
        val result = MetricsHelper()
        result.reporters = queryLogHelper
        result.program = APP_NAME
        result.marketplace = realm
        return result
    }

    companion object {
        private const val APP_NAME = "YourAppName"
        private const val PROGRAM_NAME = "YourProgramName"
        private const val SERVICE_LOG_PATH = "/var/output/logs/service_log"
        private val LOG = LoggerFactory.getLogger(ImproperCoralMetricsFactoryInstantiation::class.java)
        private lateinit var root: String
        private lateinit var domain: String
        private lateinit var realm: String
    }
}
