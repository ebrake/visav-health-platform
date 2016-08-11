import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

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
    
    // now let's switch to English....
    
  });
});
