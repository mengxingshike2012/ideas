import React, { PropTypes,}from 'react';

export default class Hello extends React.Component {

  static propTypes = {
    compiler: PropTypes.string.isRequired,
    framework: PropTypes.string.isRequired,
  }

  render() {
    return <h1> Hello from {this.props.compiler} and {this.props.framework}</h1>;
  }
}
