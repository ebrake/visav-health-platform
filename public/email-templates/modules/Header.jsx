import React from 'react';

import EmptySpace from './EmptySpace.jsx';


const Header = (props) => {
  const style = {
    color: props.color,
    fontWeight: 'bold'
  };

  return (
    <table
      width="100%"
      height="120"
      color={props.color}>
      <tbody>
        <tr>
          <td>
            <EmptySpace height={50} />

            {/* Text area, could be another component, i.e. HeroText */}
            <table width="100%">
              <tbody>
                <tr>
                  <td
                    align="center"
                    style={{color: props.color, fontFamily: 'Arial'}}>
                    Logo here
                  </td>
                </tr>
              </tbody>
            </table>

            <EmptySpace height={50} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Header.propTypes = {
  color: React.PropTypes.string.isRequired
};


export default Header;