
const Etcd = require('@hkube/etcd-client');
const MODULE_NAME = '@hkube/etcd-adapter';
const pathLib = require('path');

class EtcdAdapter {
    constructor() {
        this._isInit = false;
    }

    async init(options, log, prefixes, bootstrap = false) {
        if (!this._isInit) {
            this._etcd = new Etcd(options.etcd);
            this._isInit = true;
        }
    }

    async put(options) {
        return this._put({ ...options, path: pathLib.join('/', options.Path), data: options.Data });
    }

    async putResults(options) {
        return this._put({ path: pathLib.join('/', pathLib.join('/', options.Path)), data: options.Data });
    }

    async _put(options) {
        const { data, path } = options;
        await this._etcd.put({ path, value: data });
        return { path, moduleName: MODULE_NAME };
    }

    async get(options) {
        const { path } = options;
        return this._etcd.get({ path });
    }
}

module.exports = new EtcdAdapter();
