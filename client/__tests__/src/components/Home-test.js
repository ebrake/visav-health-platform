import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
var Home = require('../../../src/components/Home.js')

describe('home', function () {
  it('renders without problems', function () {
    var home = TestUtils.renderIntoDocument(<Home/>);
    expect(home).toExist();
  });
});
