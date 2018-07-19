const express = require('express');
const dogapi = require('dogapi');
const _ = require('lodash');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 5000;

const event_statuses = new Set(['warning', 'error']);

const dog_options = {
  api_key: process.env.DD_API_KEY,
  app_key: process.env.DD_APP_KEY
};

// Later this should be from config.
const products_n_tags = [
  {
    product_name: "Sponsors",
    tags: ["service:sponsors"]
  },
  {
    product_name: "Pro Group Search",
    tags: ["bucket:chapter_sql"]
  },
  {
    product_name: "All of Pro",
    tags: ["team:pro"]
  },
  {
    product_name: "Switchboard",
    tags: ["process:switchboardd"]
  },
  {
    product_name: "Core Services",
    tags: ["core-services"]
  }
];

app.get('/api/monitors', (req, res) => {
  dogapi.initialize(dog_options);

  Promise.all(products_n_tags.map(product => {
    return new Promise((resolve, rejected) => {
      dogapi.monitor.getAll(
        { monitor_tags: product.tags },
        (err, monitor_res) => {
          if (err) {
            console.error(err);
            rejected()
          } else {
            resolve(
              Object.assign(product,
                { monitors: monitor_res })
            );
          }
        });
    });
  })).then(products => {
    products.forEach( product => {
      var overall_states =
        new Set(product.monitors.map(monitor => monitor.overall_state));

      if(overall_states.has("Alert")) {
        product.overall_state = "Alert";
      } else if (overall_states.has("Warn") || overall_states.has("No Data")) {
        product.overall_state = "Warn";
      } else {
        product.overall_state = "Ok";
      }
    });

    res.send({
      products: products
    });
  });
});

app.get('/api/history', (req, res) => {
  dogapi.initialize(dog_options);
  const tonight = moment().endOf('day');
  const seven_days_ago = moment().subtract(30, 'days').startOf('day');

  dogapi.event.query(seven_days_ago.unix(), tonight.unix(), { tags: 'monitor' }, (err, response) => {
    if (err) {
      console.error(err);
    }

    // Go through all events and match them to
    // a product
    var products = JSON.parse(JSON.stringify(products_n_tags))
    products.forEach( product => {
      product.events = [];
    })
    response.events.forEach( event => {
      event.date_happened_formatted =
        moment.unix(event.date_happened).format('YYYY-MM-DD HH:mm:ss ZZ');

      products.forEach( product => {
        var diff = _.difference(product.tags, event.tags)
        if(
          diff.length == 0 &&
          event_statuses.has(event.alert_type)
        ) {
          product.events.push(event);
        }
      })
    });


    products.forEach( product => {
      product.events.forEach( event => {
        var m = moment.unix(event.date_happened);
        var key = m.format('YYYY-MM-DD');

        if(_.isUndefined(product.events_by_day)) {
          product.events_by_day = {
            [key]: [event]
          }
        } else if (_.isUndefined(product.events_by_day[key])) {
          product.events_by_day[key] = [event]
        } else {
          product.events_by_day[key].push(event)
        }
      })
    });

    res.send({
      products: products
    });
  });
});


app.get('/api/history/all', (req, res) => {
  dogapi.initialize(dog_options);
  const tonight = moment().endOf('day');
  const seven_days_ago = moment().subtract(30, 'days').startOf('day');

  dogapi.event.query(seven_days_ago.unix(), tonight.unix(), { tags: 'monitor' }, (err, response) => {
    if (err) {
      console.error(err);
    }

    res.send(response);
  });
});


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

/*
[
    {
        "created": "2018-02-10T20:51:26.547665+00:00",
        "created_at": 1518295886000,
        "creator": {
            "email": "sak@meetup.com",
            "handle": "sak@meetup.com",
            "id": 508962,
            "name": "Sak Lee"
        },
        "deleted": null,
        "id": 4114303,
        "matching_downtimes": [],
        "message": "{{#is_warning}}\nThere seems to be a change in the number of people seeing sponsors. Maybe something's up?\n{{/is_warning}} \n\n{{#is_alert}}\nThere seems to be a change in the number of people seeing sponsors. Something's up!\n{{/is_alert}} \n\n{{#is_recovery}}\nThe number of people seeing sponsors has gone back to normal\n{{/is_recovery}}  @slack-pro-alerts",
        "modified": "2018-07-18T15:51:29.985004+00:00",
        "multi": false,
        "name": "[Pro] Change in number of users the sponsors are shown to",
        "options": {
            "escalation_message": "",
            "include_tags": false,
            "locked": false,
            "new_host_delay": 300,
            "no_data_timeframe": null,
            "notify_audit": false,
            "notify_no_data": false,
            "renotify_interval": 0,
            "require_full_window": false,
            "silenced": {},
            "thresholds": {
                "critical": 0.0,
                "warning": 1000.0
            },
            "timeout_h": 0
        },
        "org_id": 99765,
        "overall_state": "OK",
        "overall_state_modified": "2018-04-24T13:07:44.682201+00:00",
        "query": "sum(last_2h):sum:pro.sponsor.service.rds.access.success{*}.as_count() <= 0",
        "tags": [
            "team:pro",
            "service:sponsors",
            "hackathon:test"
        ],
        "type": "query alert"
    },
    {
        "created": "2018-03-27T18:55:40.626194+00:00",
        "created_at": 1522176940000,
        "creator": {
            "email": "jim@meetup.com",
            "handle": "jim@meetup.com",
            "id": 631645,
            "name": "Jim Connell"
        },
        "deleted": null,
        "id": 4510457,
        "matching_downtimes": [],
        "message": "Something went wrong and creating a Pro/Plus account failed.\n\nTroubleshooting:\n\n1. Find the time when the error last occurred: [Splunk query](https://meetup.splunkcloud.com/en-US/app/search/search?earliest=-24h%40h&latest=now&q=search%20source%3D%2Fmeetup%2Fprod%2Fapi-mupweb%2Fapache%20%2Fpro%2Faccounts%20500&display.page.search.mode=fast&dispatch.sample_ratio=1&sid=1530521277.317826)\n\n2. Search `source=/meetup/prod/api-mupweb/tomcat` around that time for errors or exceptions\n\n@slack-payments-alerts",
        "modified": "2018-07-18T15:51:08.779071+00:00",
        "multi": false,
        "name": "@payments PRO/Plus Account Create has http 500 errors",
        "options": {
            "escalation_message": "",
            "include_tags": false,
            "locked": false,
            "new_host_delay": 300,
            "no_data_timeframe": null,
            "notify_audit": false,
            "notify_no_data": false,
            "renotify_interval": 0,
            "require_full_window": false,
            "silenced": {},
            "thresholds": {
                "critical": 1.0,
                "critical_recovery": 0.0
            },
            "timeout_h": 0
        },
        "org_id": 99765,
        "overall_state": "Alert",
        "overall_state_modified": "2018-07-04T15:28:19.243845+00:00",
        "query": "sum(last_1m):sum:chapstick.api_errors{endpoint:3_mothershipscreate,http_code:500}.as_count() >= 1",
        "tags": [
            "hackathon:test"
        ],
        "type": "query alert"
    }
]
*/
