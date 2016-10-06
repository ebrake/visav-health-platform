import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

class VisavInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      isActive: (this.props.value && this.props.value.length > 0) ? true : false,
      value: this.props.value,
      selectedAutocompleteItem: null
    };

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.valueDidChange = this.valueDidChange.bind(this);
    this.autocompleteValueDidChange = this.autocompleteValueDidChange.bind(this);
    this.autocompleteElement = this.autocompleteElement.bind(this);
    this.autocompleteMainKeyForItem = this.autocompleteMainKeyForItem.bind(this);
    this.shouldItemRender = this.shouldItemRender.bind(this);
    this.autocompleteOnSelect = this.autocompleteOnSelect.bind(this);
    this.autocompleteRenderItem = this.autocompleteRenderItem.bind(this);


  } 

  getInitialClasses() {
    let classes = [
      'floating-label-input',
      'VisavInput'
    ];

    let userClasses = this.props.className || '';

    userClasses.split(' ').forEach((name) => {
      classes.push(name);
    });

    return classes;
  }

  onKeyPress(event){
    // Handle enter key actions
    if (this.props.enterPressed) {
      if (event.key === 'Enter') {
        this.props.enterPressed(event);
        if (this.props.clearOnEnter) {
          this.setState({value: ''});
        }
      }
    }
  }

  onKeyUp(event){
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
    }
  }

  valueDidChange(event){
    let val = event.target.value;

    this.setState({
      isActive: (val.length > 0),
      value: val
    });

    this.props.valueDidChange(event, this.props.label, val);
  }

  autocompleteValueDidChange(event, value){
    var key;
    //check to see if main key has been fully typed out, select if it has
    var completeMainKeyObject = null;
    this.props.autocompleteObjects.forEach((item) => {
      key = this.props.autocompleteKeys[0];
      if (value === item[key]) {
        //if an object who's main key has been fully typed out cannot be found
        if(!completeMainKeyObject) completeMainKeyObject = item;
      }
    });
    //if an object was found with main key matching value
    if (completeMainKeyObject) {
      this.autocompleteOnSelect(value, completeMainKeyObject);
      return;
    }

    console.log('value did not match any items main key');
    console.log(value);
    //value did not match any items main key
    if (this.state.selectedAutocompleteItem) {
      this.autocompleteOnSelect(value, null);
    }
    this.setState({
      isActive: (value.length > 0),
      value: value,
      selectedAutocompleteItem: null,
    });

    this.props.valueDidChange(event, this.props.label, value);
  }


  shouldItemRender(item, value){
    var key;
    for( keyIndex in this.props.autocompleteKeys ){
      key = this.props.autocompleteKeys[keyIndex];
      if(item[key]) {
        if (item[key].includes(value)) {
          return true;
        }
      }
    }
    return false;
  }

  autocompleteOnSelect(value, item){
    var key = this.props.autocompleteKeys[0];
    this.setState({
      selectedAutocompleteItem: item,
      value: item ? item[key]: null
    });

    if (item) {
      this.props.valueDidChange(event, this.props.label, item[key]);
    }
    this.props.autocompleteDidSelect(item);
  }

  autocompleteMainKeyForItem(item){
    var key = this.props.autocompleteKeys[0];
    if (item[key]) item[key];
    else{
      return 'NO KEY FOR ITEM'
    }
  }

  autocompleteRenderItem(item, isHighlighted){
    var value = item[ this.props.autocompleteKeys[0]];
    return(
      <div className="autocomplete-item" key={item.abbr}>
        { value }
      </div>
    );
  }

  autocompleteElement(){
    return(
      <Autocomplete
        value={ this.state.value }
        inputProps={{name: "US state", id: "states-autocomplete"}}
        items={ this.props.autocompleteObjects }
        getItemValue={(item) => item.firstName}
        shouldItemRender={ this.shouldItemRender }
        onChange={ this.autocompleteValueDidChange }
        onSelect={ this.autocompleteOnSelect }
        renderItem={ this.autocompleteRenderItem }
        menuStyle={ { borderRadius: 0, position: 'fixed', background: 'white' } }
      ></Autocomplete>
    );
  }

  render() {
    let type = this.props.type || 'text';

    let classes = this.getInitialClasses();

    if (this.state.isActive) {
      classes.push('is-active');
    }
    var input;
    if (this.props.autocompleteObjects && 
      this.props.autocompleteObjects.length > 0 &&
      this.props.autocompleteKeys &&
      this.props.autocompleteKeys.length > 0){
      input = this.autocompleteElement();
    }
    else{
      input =
      <input type={ type } placeholder={ this.props.label } value={ this.state.value } onChange={ this.valueDidChange } onKeyUp={ this.onKeyUp } onKeyPress={ this.onKeyPress } />

    }

    return (
      <div className={ classes.join(' ') }>
        <label>{ this.state.isActive ? this.props.label : null }</label>
        { input }
      </div>
    );
  }
}

VisavInput.propTypes = {
  clearOnEnter: React.PropTypes.bool,
  enterPressed: React.PropTypes.func,
  valueDidChange: React.PropTypes.func,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  onKeyUp: React.PropTypes.func,
  autocompleteObjects: React.PropTypes.array,
  autocompleteKeys: React.PropTypes.array,
  autocompleteDidSelect: React.PropTypes.func
};

export default VisavInput;
