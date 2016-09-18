import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Circles from './containers/circles';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers/circles';

render(
    <Provider store={createStore(reducer, window.devToolsExtension && window.devToolsExtension())}>
        <Circles />
    </Provider>,
    document.getElementById('app')
);