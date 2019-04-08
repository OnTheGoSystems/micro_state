# MicroState
## Simple and minimalistic pure JS router for clientside

# Commands

## install dependencies
$ yarn

## test
$ yarn test

## build
$ yarn build

## release
$ npm publish


## Usage example

## Define your Sample Store
```js
import { MicroState } from "@tarvit/micro_state";

// Your service
import SampleRequest from "../services/requests/sample_request";

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
      this.state.data.loaded = true;
      this.state.data.values = json.data.values;
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

MicroState.mixin(SampleStore);

export default SampleStore;
```

## How to use defined store in your react component
```js
import React, { Component } from 'react';
import SampleStore from "../../stores/sample_store";

export default class StateDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // load initial values
      values: SampleStore.instance.getValues(),
      loaded: SampleStore.instance.isLoaded(),
      text: props.text
    };
  }

  componentWillMount() {
    // subscribe to changes in store
    SampleStore.instance.bindValuesLoaded(`dashboard`, () => {
      // update your local state
      this.setState({
        values: SampleStore.instance.getValues(),
        loaded: SampleStore.instance.isLoaded()
      })
    });
  }

  componentWillUnmount() {
    // unsubscribe this content
    SampleStore.instance.unbindValuesLoaded(`dashboard`);
  }

  componentDidMount() {
    // trigger load and state update
    SampleStore.instance.loadValues();
    // you can always manually call SampleStore.instance.setValues(values)
  }
}
```

