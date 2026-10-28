import test from 'node:test';import assert from 'node:assert/strict';
import {reportPeriodLabel} from '../src/lib/nuwaIndex.mjs';
test('baseline is not labelled as monthly and topical scope does not change period',()=>{assert.equal(reportPeriodLabel('baseline','en'),'Monitoring baseline');assert.equal(reportPeriodLabel('weekly','en'),'Weekly review');assert.equal(reportPeriodLabel('monthly','zh'),'月度综述');});
