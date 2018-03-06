
const S3Client = require('@hkube/etcd-client');
const MODULE_NAME = '@hkube/etcd-adapter';
const pathLib = require('path');

class EtcdAdapter {
    constructor() {
        this._wasInit = false;
    }

    async init(options) {
        if (!this._wasInit) {
            this._client = new Etcd(options);
            this._wasInit = true;
        }
    }

    async put(options) {
        const { jobId, taskId, data } = options.instance;
        const path = pathLib.join('/', 'pipelineResults', jobId, taskId);
        return this._client.put({ path, value: data });
    }

    async get(options) {
        const path = pathLib.join('/', 'pipelineResults', jobId, taskId);
        return this._client.get({ path });
    }

    async jobPath(options) {
        return true;
    }

    async getStream(options) {
        const path = pathLib.join('/', 'pipelineResults', jobId, taskId);
        return this._client.get({ path });
    }
}

module.exports = new EtcdAdapter();
