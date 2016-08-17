import React from 'react';
import EmptySpace from './EmptySpace.jsx';

const Footer = (props) => {

  const style = {
    color: props.color,
    backgroundColor: '#dddddd',
  };

  const spaceStyle = {
    lineHeight: '1px',
    fontSize: '1px'
  };

  const tdStyle = {
    fontFamily: 'Arial',
    textAlign: 'center',
    backgroundColor: '#eee'
  };

  return (
    <table
      width="100%"
      style={style}>
      <tbody>

        <tr>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
        </tr>

        <tr>
          <td
            height="1"
            width="20"
            style={spaceStyle}>&nbsp;</td>

          <td>
            <table width="270">
              <tbody>
                <tr>
                  <td
                    style={tdStyle}>
                    <EmptySpace height="10" />

                    <a
                      style={{color: props.color, fontWeight: 'bold', textDecoration: 'none'}}
                      href="http://www.visav.io">About Us</a>

                    <EmptySpace height="10" />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          <td
            height="1"
            width="20"
            style={spaceStyle}>&nbsp;</td>

          <td>
            <table width="270">
              <tbody>
                <tr>
                  <td
                    style={tdStyle}>

                    <EmptySpace height="10" />

                    <a
                      style={{color: props.color, fontWeight: 'bold', textDecoration: 'none'}}
                      href="http://www.visav.io">About Us</a>

                    <EmptySpace height="10" />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          <td
            height="1"
            width="20"
            style={spaceStyle}>&nbsp;</td>
        </tr>

        <tr>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
          <td><EmptySpace height="20" /></td>
        </tr>
      </tbody>
    </table>
  );
};

export default Footer;