/*
MIT License

Copyright (c) 2019 Vitaly Tarasenko, https://github.com/tarvit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let MicroStore	= function(){};

MicroStore.prototype	= {
  bind: function(event, key, action){
    this._events = this._events || {};
    this._events[event] = this._events[event]	|| {};
    this._events[event][key] = action;
  },
  unbind: function(event, key){
    this._events = this._events || {};
    if(event in this._events === false)	return;
    delete this._events[event][key];
  },
  unbindAll: function(){
    this._events = {}
  },
  trigger: function(event){
    this._events = this._events || {};
    if(event in this._events === false)	return;
    const entries = Object.entries(this._events[event]);

    for(let i = 0; i < entries.length; i++){
      entries[i][1].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

MicroStore.mixin	= function(destObject){
  let props	= ['bind', 'unbind', 'trigger', 'unbindAll'];
  for(let i = 0; i < props.length; i ++){
    if(typeof destObject === 'function'){
      destObject.prototype[props[i]]	= MicroStore.prototype[props[i]];
    } else {
      destObject[props[i]] = MicroStore.prototype[props[i]];
    }
  }
  return destObject;
};

export default MicroStore;