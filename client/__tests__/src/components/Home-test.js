import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

import SegmentedControl from 'react-segmented-control';

//the module to test.
var Home = require('../../../src/components/Home.js');

describe('home', function () {
  it('renders without problems', function () {
    var home = TestUtils.renderIntoDocument(<Home/>);
    var h2 = TestUtils.findRenderedDOMComponentWithTag(
       home, 'h2'
    );
    // by default, it should have french welcom
    expect(h2.textContent)
        .toEqual("Bienvenue à Dillinger!");

    var seg_ctrl = TestUtils.findRenderedComponentWithType(
    	home, SegmentedControl);
    var seg_spans = TestUtils.scryRenderedDOMComponentsWithTag(
    	seg_ctrl, 'span');
    var span_en = null;
    for(var i=0; i< seg_spans.length; i++){
    	var seg_span = seg_spans[i];
    	if(seg_span.value == 'en'){
    		span_en = seg_span;
    		console.log("Found ENNNNNNNNN!!!!!!");
    		break;
    	}
    }
    expect(seg_spans.length).toEqual(2);
    expect(span_en).toEqual(null);
    //expect(seg_ctrl.value).toEqual('en');
    
    // now let's switch to English....

  });
});
