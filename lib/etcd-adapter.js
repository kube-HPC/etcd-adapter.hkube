
const Etcd = require('@hkube/etcd-client');
const pathLib = require('path');

class EtcdAdapter {
    constructor() {
        this._isInit = false;
    }

    async init(options, log, prefixes, bootstrap = false) {
        if (!this._isInit) {
            this._etcd = new Etcd(options);
            this._isInit = true;
        }
    }

    async put(options) {
        return this._put({ ...options, path: pathLib.join('/', options.path), data: options.data });
    }

    async _put(options) {
        const { data, path } = options;
        await this._etcd.put({ path, value: data });
        return { path };
    }

    async get(options) {
        let { path } = options;
        if (!path.startsWith('/')) {
            path = pathLib.join('/', path);
        }
        const res = await this._etcd.get({ path });
        if (!res) {
            return { error: new Error('failed to get from storage') };
        }
        return res;
    }

    async list(options) {
        let { path } = options;
        if (!path.startsWith('/')) {
            path = pathLib.join('/', path);
        }
        const res = await this._etcd.get({ path, isPrefix: true });
        const entries = Object.entries(res);
        return entries.map(x => ({ path: x[0] }));
    }

    async delete(options) {
        let { path } = options;
        if (!path.startsWith('/')) {
            path = pathLib.join('/', path);
        }
        return this._etcd.delete({ path });
    }
}

module.exports = new EtcdAdapter();
