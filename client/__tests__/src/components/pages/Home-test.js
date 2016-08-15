import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

import SegmentedControl from 'react-segmented-control';


var Home = require("../../../../src/components/pages/Home.jsx");


describe('home', function () {
  // constructor. 
  before(function(){
    var home = TestUtils.renderIntoDocument(<Home/>);
    this.home = home;
    var h2 = TestUtils.findRenderedDOMComponentWithTag(
       home, 'h2'
    );
    this.h2 = h2;
    var seg_ctrl = TestUtils.findRenderedComponentWithType(
        home, SegmentedControl);
    var seg_inputs = TestUtils.scryRenderedDOMComponentsWithTag(
        seg_ctrl, 'input');
    this.segCtrl = seg_ctrl;
    this.segInputs = seg_inputs;

    expect(seg_inputs.length).toEqual(2);
    this.input_en = seg_inputs[0];
    this.input_fr = seg_inputs[1];
  });

  it('renders default in frech', function () {
    // by default, it should have french welcom
    expect(this.h2.textContent)
        .toEqual("Bienvenue à Dillinger!");
    });

  it('switch to english', function(){
    TestUtils.Simulate.change(this.input_en, {"target": {"checked": true}}); //ick(this.input_en);
    expect(this.h2.textContent)
        .toEqual("Welcome to Dillinger!");
    
  });
  
  it('switch to french', function(){
    TestUtils.Simulate.change(this.input_fr, {"target": {"checked": true}}); //ick(this.input_en);
    expect(this.h2.textContent).toEqual("Bienvenue à Dillinger!");
  });

});
