import React from 'react';
import EmptySpace from './EmptySpace';

const Header = (props) => {

  const style = {
    color: props.color,
    fontFamily: 'Arial',
    textAlign: 'center'
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
                    style={style}>
                    <img
                    src="https://www.krisandbrake.com/images/kris-and-brake-logo.png"
                    height={100}
                    width={600}
                    style={{display: 'block', maxWidth: '100%'}} />
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


export default Header;