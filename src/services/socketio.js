"use strict";
const EventEmitter = require('events');

let map = (service, config) => {

    let io = require('socket.io-client');

    this.service = service;

    let endpoint = config.endpoint;

    class Socket {
        constructor(channel) {

            this.emitter = new EventEmitter();

            this.socket = io.connect(endpoint + '/' + channel, {multiplex: true})

            this.socket.on('connect', () => {
                this.socket.emit('start', config.uuid, config.state);
                this.emitter.emit('ready');
            });

            this.socket.on('join', (uuid, state) => {
                this.emitter.emit('join', uuid, state);
            });

            this.socket.on('leave', (uuid) => {
                this.emitter.emit('leave', uuid);
            });

            this.socket.on('message', (uuid, data) => {
                this.emitter.emit('message', uuid, data);
            });

            this.socket.on('state', (uuid, state) => {
                this.emitter.emit('state', uuid, state);
            });

        }
        publish(data) {
            this.socket.emit('publish', config.uuid, data);
        }
        hereNow(cb) {
            
            this.socket.emit('whosonline', null, function(users) {
              cb(users);
            });

        }
        setState (state) {
            this.socket.emit('setState', config.uuid, state);
        }
        history(cb) {
                        
            this.socket.emit('history', null, function(data) {
              cb(data);
            });

        }
        unsubscribe(cb) {
            this.socket.off('message');
        }
    }

    this.join = (channel) => {

        console.log('new socket', endpoint + '/' + channel)
        return new Socket(channel);

    };

    return this;

};

module.exports = map;
