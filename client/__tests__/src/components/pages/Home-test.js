import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

import SegmentedControl from 'react-segmented-control';

var rfr = require('rfr');

//var la = require('lazy-ass');
//the module to test.
rfr.setRoot('/Users/michael007/Desktop/projects/dellinger');
console.log("RFR root:" + rfr.root);
console.log("NODE_PROJ_ENV:" + process.env.NODE_PROJ_ROOT);

var Home = require(process.env.NODE_PROJ_ROOT + '/client/src/components/pages/Home.jsx');
//var Home = rfr('client/src/components/pages/Home.jsx');


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
