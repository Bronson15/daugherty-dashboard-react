import React, { Component } from 'react'
import '../../styles/Bottom/index.css'

export default class Bottom extends Component {
  
  render() {
    return (
      <div className="bottom">
        <p className="marquee">
        {this.props.text}

        </p>
      </div>
    )
  }
}