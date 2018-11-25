
const { expect } = require('chai');
const etcd = require('../index');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const path = require('path');
const DateFormat = 'YYYY-MM-DD';

describe('etcd', () => {
    beforeEach(async () => {
        const config = {};
        config.serviceName = 'etcd-adapter';

        config.etcd = {
            protocol: 'http',
            host: process.env.ETCD_CLIENT_SERVICE_HOST || 'localhost',
            port: process.env.ETCD_CLIENT_SERVICE_PORT || 4001
        };

        await etcd.init(config.etcd, null, null, true);
    });
    describe('get/set', () => {
        it('should set a key and then get the same key', async () => {
            const jobId = uuidv4();
            const taskId = uuidv4();
            const data = { data: 'yes' };
            const res = await etcd.put({ path: path.join('hkube', moment().format(DateFormat), jobId, taskId), data });
            const result = await etcd.get(res);
            expect(result).to.deep.equal(data);
        });
        it('should set a key and then get the same key - result', async () => {
            const jobId = uuidv4();
            const data = { data: 'yes' };
            const res = await etcd.put({ path: path.join('hkube-results', moment().format(DateFormat), jobId), data });
            const result = await etcd.get(res);
            expect(result).to.deep.equal(data);
        });
    });
});
