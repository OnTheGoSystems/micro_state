'use strict';

import MicroStore from "../../src/micro_store";

class SampleStore {
  constructor() {
    this.state = {
      data: {
        values: [],
        loaded: false,
      }
    }
  }

  getValues() {
    return this.state.data.values;
  }

  isLoaded() {
    return this.state.data.loaded;
  }

  loadValues(page = 0) {
    const req = SampleRequest.load(page);
    req.then((response)=> {
      const json = JSON.parse(response);
      this.setValues(json.data.values);
    });
  }

  setValues(values) {
    this.trigger(`values.loaded`);
    this.state.data.values = values;
    this.state.data.loaded = true;
  }

  bindValuesLoaded(key, callback) {
    this.bind(`values.loaded`, key, callback);
  }

  unbindValuesLoaded(key) {
    this.unbind(`values.loaded`, key);
  }
}

MicroStore.mixin(SampleStore);

class SampleRequest {
  static setResponse(response) {
    this.response = response;
  }

  static getResponse() {
    return this.response || '{ "data": { "values": [1, 2, 3] }}';
  }

  static load() {
    return {
      then: (callback) => {
        callback(this.getResponse());
      }
    }
  }
}

describe('Main scenario', ()=>{
  it('works', ()=> {
    // init store
    const store = new SampleStore();
    // define local object interested in data
    const localObject = { values: store.getValues(), reloadNumber: 0 };

    // define local callback
    store.bindValuesLoaded('local-key', () => {
      localObject.reloadNumber++;
      localObject.values = store.getValues();
    });

    // check default store values
    expect(store.isLoaded()).toEqual(false);
    expect(store.getValues()).toEqual([]);

    // load values 2 times
    store.loadValues();
    store.loadValues();

    // check store is updated
    expect(store.isLoaded()).toEqual(true);
    expect(store.getValues()).toEqual([1, 2, 3]);

    // check local subscriber is updated
    expect(localObject.values).toEqual([1, 2, 3]);
    expect(localObject.reloadNumber).toEqual(2);

    // unsubscribe
    store.unbindValuesLoaded('local-key');
    // update response
    SampleRequest.setResponse('{ "data": { "values": [5, 6, 7] }}');

    // re-load values
    store.loadValues();

    // check store is updated
    expect(store.isLoaded()).toEqual(true);
    expect(store.getValues()).toEqual([5, 6, 7]);

    // check local object has outdated data.
    expect(localObject.values).toEqual([1, 2, 3]);
    expect(localObject.reloadNumber).toEqual(2);
  });
});
