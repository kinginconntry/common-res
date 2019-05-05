/*
*
* 事件bus
 */

import Assert from "./assert"

/**
 * 事件bus
 *
 * @param config
 * @returns {*}
 * @constructor
 */
var EventBus = function (config) {
    if(config == null){
        config = {};
    }
    let o = {
        container: {},
        distinct: true,
        producer(){
            let group = arguments[0];
            let event = arguments[1];

            let watchers = this.getWatcher(group, event);
            if(watchers.length !== 0){
                for(let i = 0, len = watchers.length; i < len; i++){
                    watchers[i](arguments.slice(2));
                }
            }
        },
        watch(group, event, func){
            Assert.validateNone(func);
            let watchers = this.getWatcher(group, event);
            if(this.distinct){
                for(let i = 0, len = watchers.length; i < len; i++){
                    if(func === watchers[i]){
                        return;
                    }
                }
            }
            this.container[group + ''][event + ''].append(func);
        },
        getWatcher(group, event){
            Assert.validateEmpty(group, 'group can not be empty');
            Assert.validateEmpty(event, 'group can not be empty');

            if(this.container[group + ''] === undefined){
                this.container[group + ''] = {};
            }

            if(this.container[group + ''][event + ''] === undefined){
                this.container[group + ''][event + ''] = [];
            }
            return this.container[group + ''][event + ''];
        }
    };
    o.distinct = config.distinct || true;
    return o;
}

export default EventBus
