
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
        return this._put({ ...options, path: pathLib.join('/', options.Path), data: options.Data });
    }

    async _put(options) {
        const { data, path } = options;
        await this._etcd.put({ path, value: data });
        return { Path: path };
    }

    async get(options) {
        if (!options.Path.startsWith('/')) {
            options.Path = pathLib.join('/', options.Path);
        }
        const path = options.Path;
        const res = await this._etcd.get({ path });
        if (!res) {
            return { error: new Error('failed to get from storage') };
        }
        return res;
    }

    async list(options) {
        if (!options.Path.startsWith('/')) {
            options.Path = pathLib.join('/', options.Path);
        }
        const res = await this._etcd.get({ path: options.Path, isPrefix: true });
        const entries = Object.entries(res);
        return entries.map(x => ({ Path: x[0] }));
    }

    async delete(options) {
        if (!options.Path.startsWith('/')) {
            options.Path = pathLib.join('/', options.Path);
        }
        return this._etcd.delete({ path: options.Path });
    }
}

module.exports = new EtcdAdapter();
