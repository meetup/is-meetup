const express = require('express');
const dogapi = require('dogapi');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 5000;

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
    product_name: "Test hack",
    tags: ["hackathon:test"]
  }
];

app.get('/api/monitors', (req, res) => {
  // Later this should be from config.
  var all_tags = _.flatten(products_n_tags.map(product =>
    product.tags
  ));
  console.log(all_tags);

  dogapi.initialize(dog_options);
  dogapi.monitor.getAll(
    { monitor_tags: all_tags },
    function (err, monitor_res) {
      if (err) {
        console.error(err);
      }

      monitor_res.forEach(mon => console.log(mon.name));

      var products_with_monitors = products_n_tags.map(product => {
        var monitors = monitor_res.filter(monitor => {
          // Does this monitor contain tags for the
          // current product
          return monitor.tags
            .filter(tag => {
              var find = product.tags.find(x => x == tag);
              return (typeof find !== "undefined");
            })
            .length > 0;
        });

        return Object.assign(product,
          { monitors: monitors });
      });

      res.send({
        products: products_with_monitors
      });
    }
  );
});

app.get('/api/history', (req, res) => {
  dogapi.initialize(dog_options);
  const now = parseInt(Date.now() / 1000);
  const then = now - 7 * 24 * 3600;

  dogapi.event.query(then, now, { tags: 'monitor' }, (err, response) => {
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
