import React, { Component } from 'react';
import UIStore from '../../alt/stores/UIStore';


class FullscreenAlertListener extends React.Component {
  constructor(props) {
    var activeAlert;
    let alertElements = UIStore.alertElements;
    if (alertElements && (alertElements.length > 0)) {
      activeAlert = alertElements[0];
    }
    super(props);
    this.state = {
      activeAlert: activeAlert
    }
    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
    this.uiStoreChanged = this.uiStoreChanged.bind(this);

  }

  componentWillReceiveProps(newProps) {

  }
  handleBackgroundClick(event){
    console.log(event);
    this.props.onClickOutside();
  }

  uiStoreChanged(uiStore) {
    let alertElements = uiStore.alertElements;
    console.log('uiStore changed');
    console.dir(alertElements);
    if (alertElements && (alertElements.length > 0)) {
      this.setState({
        activeAlert: alertElements[0]
      });
      
    }
    else{
      console.log('no active alert.. removing alert')
      this.setState({
        activeAlert: undefined
      });
    }
    
  }

  componentDidMount(){
    UIStore.listen(this.uiStoreChanged);
  }

  componentWillUnmount(){
    UIStore.unlisten(this.uiStoreChanged);
  }

  render() {
    if (!this.state.activeAlert) {
      return null;
    }
    return (
      <div className="FullscreenAlertListener">
        { this.state.activeAlert }
      </div>
    );
  }
};

FullscreenAlertListener.propTypes = {
};

export default FullscreenAlertListener;
