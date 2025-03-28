// load-test.js
import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },  // ramp up to 50 virtual users over 30 seconds
    { duration: '1m', target: 50 },     // stay at 50 users for 1 minute
    { duration: '30s', target: 0 }      // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should complete below 500ms
  },
};

export default function () {
  // Replace with your API endpoint URL
  let res = http.get('http://localhost:3000/documents');
  
  // Check response status and duration
  check(res, {
    'status is 200': (r) => r.status === 200,
    'duration < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
