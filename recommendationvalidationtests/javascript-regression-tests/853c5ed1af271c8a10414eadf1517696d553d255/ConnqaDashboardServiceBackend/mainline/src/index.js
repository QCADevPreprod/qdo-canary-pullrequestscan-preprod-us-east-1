const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const testRailRouter = require('./routes/testrail.routes')
const teamRouter = require('./routes/team.routes')
const metricRouter = require('./routes/metric.routes')
const sub_metricRouter = require('./routes/sub_metric.routes')
const field_entryRouter = require('./routes/field_entry.routes')
const metric_dateRouter = require('./routes/metric_date.routes')
const sub_metric_fieldRouter = require('./routes/sub_metric_field.routes')
const productRouter = require('./routes/product.routes')
const milestoneRouter = require('./routes/milestone.routes')
const project_typeRouter = require('./routes/project_type.routes')
const statusSummaryRouter = require('./routes/status_summary.routes')
const jira_blockerRouter = require('./routes/jira_blocker.routes')
const projectRouter = require('./routes/project.routes')
const connectivity_domainRouter = require('./routes/connectivity_domain.routes')
const jira_Router = require('./routes/jira.routes')
const feature_Router = require('./routes/feature.routes')
const projectStatus_Router = require('./routes/project_status.routes')
const milestoneName_Router = require('./routes/milestone_name.routes');

const app = express();
const jwtSecret = process.env.JWT_SECRET
const hour = 3600000
app.use(helmet()); //helps secure express apps by setting multiple Headers
app.use(morgan('dev')) // http request logger middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/testrail', testRailRouter)
app.use('/api/v1/team', teamRouter)
app.use('/api/v1/metric', metricRouter)
app.use('/api/v1/sub_metric', sub_metricRouter)
app.use('/api/v1/field_entry', field_entryRouter)
app.use('/api/v1/metric_date', metric_dateRouter)
app.use('/api/v1/sub_metric_field', sub_metric_fieldRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/milestone', milestoneRouter)
app.use('/api/v1/project_type', project_typeRouter)
app.use('/api/v1/status_summary', statusSummaryRouter)
app.use('/api/v1/jira_blocker', jira_blockerRouter)
app.use('/api/v1/project', projectRouter)
app.use('/api/v1/connectivity_domain', connectivity_domainRouter)
app.use('/api/v1/jira', jira_Router)
app.use('/api/v1/feature', feature_Router)
app.use('/api/v1/project_status', projectStatus_Router)
app.use('/api/v1/milestone_name', milestoneName_Router)

app.get('/api/oauth/redirect',(req, res) => {
    if (req.query.error) {
        res.status(404).send("error authentication")
    } else {
        const req_code = req.query.code
        const id_token = req.query.id_token
        const access_token = req.query.access_token
        const expires = req.query.expires_in
        const token_type = req.query.token_type
        const state = req.query.state
        console.log(req.query)
        const token = jwt.sign({ a_t: access_token, expires_in: new Date(Date.now() + hour)}, jwtSecret)
        res.cookie('jwt_connqa_dashboard', token, { maxAge: expires * 1000, httpOnly: false})
        res.redirect(process.env.CLIENT_URI)
    }
})


// Order of routes matter
/*
    if using route like /:id and /search/:id
    use /search/:id before /:id
*/

app.listen(process.env.PORT || 8080, () => {console.log(`Listening on port ${process.env.PORT || 8080}!`)});

