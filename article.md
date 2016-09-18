# Keep canvas in sync with react and redux.

When writing modern apps you will often need to use canvas. It's great for things like data visualisation and sometimes it's easier to use than DOM or SVG.

But how to connect canvas with React components and Redux state?

This article will show you a simple example in which you can toggle visibility of three circles, drag them around canvas and keep it all in sync with UI and app state.

![screencast](http://projects.bartoszkrawczyk.com/canvas.gif)

## File structure

```
react-redux-canvas/
├── app/
│   ├── actions/
│   │   └── circles.js
│   ├── assets/
│   │   └── index.html
│   ├── components/
│   │   └── toolbarItem.js
│   ├── containers/
│   │   └── circles.js
│   ├── reducers/
│   │   └── circles.js
│   ├── styles/
│   │   └── main.scss
│   └── app.js
├── dist/
├── gulpfile.js
└── package.json
```

## Setup

Let's start with `app.js` file. Import react, redux, main reducer and container, create your redux store and render it to DOM.

* **app/app.js**

```javascript
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
```

Now create container and reducer with default state for circles:

* **app/containers/circles.js**

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';

let mapStateToProps    = (state)    => state;
let mapDispatchToProps = (dispatch) => ({});

class Circles extends Component {
    render() {
        return (
            <div className='app-wrapper'>
                <div className='canvas-wrapper'>
                    <canvas />
                </div>
                <ul className='toolbar'></ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Circles);
```

* **app/reducers/circles.js**

```javascript
const defaultState = () => ({
    circleRadius: 40,
    circles: [
        {
            color: '#DA4167',
            enabled: false,
            x: 200,
            y: 200
        }, {
            color: '#F4D35E',
            enabled: false,
            x: 200,
            y: 200
        }, {
            color: '#F78764',
            enabled: false,
            x: 200,
            y: 200
        }
    ]
});

export default (state = defaultState(), action) => {
    switch (action.type) {
        default:
            return state;
    }
}
```

Grab the styles from [here](https://github.com/bartoszkrawczyk2/react-redux-canvas/blob/master/app/styles/main.scss) and copy them to `app/styles/main.scss`.

## Render on canvas

We can move on to rendering on canvas. Component's `render()` method handles DOM rendering, but we can create another method for canvas element.

First, lets get rendering context and set resolution:

* **app/containers/circles.js**

```javascript
// ...
class Circles extends Component {
    componentDidMount() {
        // set resolution and get rendering context
        this.refs.canvas.width = 400;
        this.refs.canvas.height = 400;
        this.ctx = this.refs.canvas.getContext('2d');
    }

    render() {
        return (
            <div className='app-wrapper'>
                <div className='canvas-wrapper'>
                    {/* add ref attribute to get DOM node */}
                    <canvas
                        ref='canvas' />
                </div>
                <ul className='toolbar'></ul>
            </div>
        );
    }
}

// ...
```

Now add `renderCanvas()` method and pass props. This method will handle rendering circles on canvas.

```javascript
// ...
class Circles extends Component {
    componentDidMount() {
        this.refs.canvas.width = 400;
        this.refs.canvas.height = 400;
        this.ctx = this.refs.canvas.getContext('2d');

        this.renderCanvas(this.props);
    }

    renderCanvas(props) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    }

    render() {
        return (
            <div className='app-wrapper'>
                <div className='canvas-wrapper'>
                    <canvas
                        ref='canvas' />
                </div>
                <ul className='toolbar'></ul>
            </div>
        );
    }
}

// ...
```

At this point your app should look like this:

![screen1](http://projects.bartoszkrawczyk.com/rrc1.png)

Now let's loop through our circles and draw them on canvas:

```javascript
// ...
    renderCanvas(props) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

        for (let circle of props.circles) {
            if (circle.enabled) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, props.circleRadius, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = circle.color;
                this.ctx.fill();
            }
        }
    }
// ...
```

Your canvas still remains blank, because all circles have property **enabled** set to **false**. Change it in `app/containers/circles.js`. You can also play with **x** and **y** properties and see how it renders. 