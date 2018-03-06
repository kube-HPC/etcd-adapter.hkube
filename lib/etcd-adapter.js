
const Etcd = require('@hkube/etcd-client');
const MODULE_NAME = '@hkube/etcd-adapter';
const pathLib = require('path');
let client;

class EtcdAdapter {
    constructor() {
        this._isInit = false;
    }

    async init(options) {
        if (!this._isInit) {
            client = new Etcd(options);
            this._isInit = true;
        }
    }

    async put(options) {
        const { jobId, taskId, data } = options;
        const path = pathLib.join('/', 'pipelineResults', jobId, taskId);
        await client.put({ path, value: data });
        return { path, moduleName: MODULE_NAME };
    }

    async get(options) {
        const { path } = options;
        return client.get({ path });
    }

    async jobPath(options) {
        return true;
    }

    async getStream(options) {
        return this.get(options);
    }
}

module.exports = new EtcdAdapter();
