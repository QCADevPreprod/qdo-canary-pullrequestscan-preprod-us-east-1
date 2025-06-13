let express = require('express');
import helmet from 'helmet';
import bodyParser from 'body-parser';
let csrf = require('csurf');
import cookieParser from 'cookie-parser';
import { bootstrapDynamoDB } from './bootstrap/dynamodb-bootstrapper';
import { bootstrapSns } from './bootstrap/sns-bootstrapper';
import { bootstrapS3 } from './bootstrap/s3-bootstrapper';


const LOGGER = LogBuilder.getLogger('index.js');

const app = express();
app.set('port', getConfig().port);
app.use(helmet());
app.use(helmet.hidePoweredBy());

app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // set secure headers https://aristotle.corp.amazon.com/recommendations/26/
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains;');
    res.header('Cache-Control', 'no-cache');
    res.header('X-Frame-Options', 'DENY');
    res.header('Content-Security-Policy', "default-src 'self' midway-auth.amazon.com midway-auth.lck.aws-border.com midway-auth.c2s.ic.gov; " +
        "img-src 'self' https://internal-cdn.amazon.com data: content:; font-src 'self' data: content:; block-all-mixed-content");
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
}, express.static(getConfig().assetsDir));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(csrf({ cookie: true, ignoreMethods: ["POST", "GET"] }));

app.use(async (err, req, res, next) => {
    if (err) {
        LOGGER.info('Error when parsing request' + err);
        await putMetrics([getStatusCodeMetric(400)]);
        res.sendStatus(400)
    } else {
        next()
    }
})

app.use(async (req, res, next) => {
    if (!req.path || req.path.includes('.') || req.path.includes('/ping') || req.path.startsWith('/pages') || req.path.includes('/csrf')) {
        next();
    } else {
        const userName = getUserName(req);
        const metrics = [{
            MetricName: 'API Count',
            Value: 1,
            Unit: 'Count',
            Dimensions: [{ Name: 'API', Value: req.path.substring(1) }]
        }];
        try {
            const result = await isApiAuthorized(userName, req.path, req.method, metrics);
            if (result) {
                await putMetrics(metrics);
                next();
            } else {
                LOGGER.info(`${userName} is not authorized for ${req.path}`);
                await putMetrics(metrics.concat([getStatusCodeMetric(401)]));
                res.sendStatus(401)
            }
        } catch (error) {
            LOGGER.error('error getting resources for API: ' + error.message);
            await putMetrics(metrics.concat([getStatusCodeMetric(500)]));
            res.sendStatus(500)
        }
    }
});

app.route('/csrf').get((req, res) => {
// pass the csrfToken to the view
    res.json({ csrfToken: req.csrfToken() })
});
app.route('/getRoleMapping').get(getRoleMapping);
app.route('/authorize').get(LdapApi.authorize);
app.route('/getLimitsData').get(getLimitsData);
app.route('/optOutLimit').post(optOutLimit);
app.route('/Accounts').post(Accounts);
app.route('/Principals').post(ServicePrincipals);
app.route('/checkAccountStatus').post(checkAccountStatus);
app.route('/checkServicePrincipalStatus').post(checkServicePrincipalStatus);
app.route('/getDeploymentSchedule').post(getDeploymentSchedule);
app.route('/getMatchedServicePrincipals').get(getMatchedServicePrincipals);
app.route('/getFeatureToggleData').get(getFeatureToggleData);
app.route('/getFeatureToggleHistoryData').get(getFeatureToggleHistoryData);
app.route('/getInstanceConfigurationData').get(getInstanceConfigurationData);
app.route('/getRegions').get(getRegions);
app.route('/getFvsRegions').get(getFvsRegions);
app.route('/updatePoolPropertyConfig').post(NewInstanceLaunchesApi.updatePoolPropertyConfig);
app.route('/putNewLaunchRequest').post(NewInstanceLaunchesApi.putPendingLaunchRequests);
app.route('/getPendingLaunchRequestsData').get(NewInstanceLaunchesApi.getPendingLaunchRequestsData);
app.route('/searchLaunchRequestData').get(NewInstanceLaunchesApi.searchLaunchRequestData);
app.route('/searchLaunchRequestAuditData').get(NewInstanceLaunchesApi.searchLaunchRequestAuditData);
app.route('/getInstanceLaunchRequestPreview').post(NewInstanceLaunchesApi.getInstanceLaunchRequestPreview);
app.route('/editLaunchRecord').post(NewInstanceLaunchesApi.editLaunchRecord);
app.route('/updateInstanceLaunchRecordStatus').post(NewInstanceLaunchesApi.updateInstanceLaunchStatus);
app.route('/adminGetUserRole').get(LdapApi.adminGetUserRole);
app.route('/getSimFolder').get(SimApi.getSimFolder);
app.route('/getAccountInfo').get(getAccountData);
app.route('/getAccountUsage').get(getAccountUsage);
app.route('/getAuthorizedGroup').get(LdapApi.getAuthorizedGroup);
app.route('/getExistingLimit').get(getExistingLimit);
app.route('/getLimitOptions').get(getLimitOptions);
app.route('/createLimitIncrease').post(createLimitIncrease);
app.route('/updateLimitIncrease').post(updateLimitIncrease);
app.route('/searchLimitIncrease').get(searchLimitIncrease);
app.route('/getHWConfiguration').get(getHWConfiguration);
app.route('/expandAttributeResource').get(expandAttributeResource);
app.route('/getAttributeList').get(getAttributeList);
app.route('/setAccountAttributes').post(setAccountAttributes);
app.route('/niloOpsRequest').get(getNiloOpsRequest);
app.route('/getAllNiloOpsRequest').get(getAllNiloOpsRequests);
app.route('/createNiloOpsRequest').post(createNiloOpsRequest);
app.route('/niloOpsRequest').post(updateNiloOpsRequest);
app.route('/generateNiloConfig').get(generateNiloConfig);
app.route('/submitNiloConfig').post(submitNiloOpsRequest);

app.route('/getPoolData').post(PoolViewerApi.getPoolData);
app.route('/getPoolMetrics').get(PoolViewerApi.getPoolMetrics);
app.route('/getHistoricalPoolData').post(PoolViewerApi.getHistoricalPoolData);

app.route('*').get((req, res) => {
    res.sendFile('index.html', { root: getConfig().assetsDir });
});

// bootstrap resources if haven't been created
bootstrapDynamoDB();
bootstrapSns();
bootstrapS3();

// Start scheduled jobs
refreshLimitsCache();
setInterval(refreshLimitsCache, limitsCacheTTL);
refreshHardwareConfigurationJob();
setInterval(refreshHardwareConfigurationJob, hardwareConfigurationRefreshJobIntervalMillis);
refreshInstanceConfigurationJob();
setInterval(refreshInstanceConfigurationJob, instanceConfigurationRefreshJobIntervalMillis);
exportLaunchRequestsDataJob();
setInterval(exportLaunchRequestsDataJob, exportLaunchRequestsJobIntervalMillis);

function getStatusCodeMetric (code) {
    return {
        MetricName: `Status Code Count`,
        Value: 1,
        Unit: 'Count',
        Dimensions: [{ Name: 'Status Code', Value: String(code) }]
    }
}

app.listen(getConfig().port, '127.0.0.1', function () {
    LOGGER.info(`Website listening on port ${getConfig().port}, in region ${getConfig().region} and stage ${getConfig().domain}`);
});