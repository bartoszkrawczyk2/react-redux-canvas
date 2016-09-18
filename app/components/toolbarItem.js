import React, { Component } from 'react';
import classnames from 'classnames';

class ToolbarItem extends Component {
    render() {
        return (
            <li
                className={classnames('toolbar__item', {
                    'active': this.props.enabled
                })}
                onClick={this.props.onClick}>
                <span
                    style={{
                        backgroundColor: this.props.color
                    }} />
            </li>
        );
    }
}

export default ToolbarItem;