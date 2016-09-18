import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToolbarItem from '../components/toolbarItem';
import { toggleCircle, moveCircle } from '../actions/circles';

let mapStateToProps    = (state)    => state;
let mapDispatchToProps = (dispatch) => ({
    toggleCircle: index => dispatch(toggleCircle(index)),
    moveCircle: (index, x, y) => dispatch(moveCircle(index, x, y))
});

class Circles extends Component {
    componentDidMount() {
        this.refs.canvas.width = 400;
        this.refs.canvas.height = 400;
        this.ctx = this.refs.canvas.getContext('2d');

        this.helpers = {
            dragging: false,
            circle: null,
            offsetX: 0,
            offsetY: 0,
            x: 0,
            y: 0
        };
        
        this.renderCanvas(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.renderCanvas(nextProps);
    }

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

    _mouseDown(e) {
        let x = e.nativeEvent.offsetX || e.nativeEvent.layerX;
        let y = e.nativeEvent.offsetY || e.nativeEvent.layerY;

        for (let i = this.props.circles.length - 1; i >= 0; i--) {
            if (
                x >= this.props.circles[i].x - this.props.circleRadius &&
                x <= this.props.circles[i].x + this.props.circleRadius &&
                y >= this.props.circles[i].y - this.props.circleRadius &&
                y <= this.props.circles[i].y + this.props.circleRadius &&
                this.props.circles[i].enabled
            ) {
                this.helpers.circle = i;
                this.helpers.dragging = true;
                this.helpers.offsetX = this.props.circles[i].x - x;
                this.helpers.offsetY = this.props.circles[i].y - y;
                return;
            }
        }
    }

    _mouseMove(e) {
        if (!this.helpers.dragging) return;

        let x = e.nativeEvent.offsetX || e.nativeEvent.layerX;
        let y = e.nativeEvent.offsetY || e.nativeEvent.layerY;

        let circles = [...this.props.circles];

        this.helpers.x = x + this.helpers.offsetX;
        this.helpers.y = y + this.helpers.offsetY;
        circles[this.helpers.circle].x = this.helpers.x;
        circles[this.helpers.circle].y = this.helpers.y;

        this.renderCanvas(Object.assign({}, this.props, {
            circles
        }));
    }

    _mouseUp(e) {
        this.helpers.dragging = false;
        this.props.moveCircle(this.helpers.circle, this.helpers.x, this.helpers.y);
    }
    
    render() {
        return (
            <div className='app-wrapper'>
                <div className='canvas-wrapper'>
                    <canvas
                        ref='canvas'
                        onMouseDown={this._mouseDown.bind(this)}
                        onMouseMove={this._mouseMove.bind(this)}
                        onMouseUp={this._mouseUp.bind(this)} />
                </div>
                <ul className='toolbar'>
                    {this.props.circles.map((item, key) => (
                        <ToolbarItem
                            key={key}
                            color={item.color}
                            enabled={item.enabled}
                            onClick={() => this.props.toggleCircle(key)} />
                    ))}
                </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Circles);