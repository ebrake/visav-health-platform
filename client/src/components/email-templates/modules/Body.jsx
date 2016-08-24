import React from 'react';
import EmptySpace from './EmptySpace';

export default (props) => {

  const textStyle = {
    color: '#42444c',
    backgroundColor: '#eeeeee',
    fontFamily: 'Arial',
    fontSize: '18px',
    textAlign: 'center'
  };

  return (
    <table width="100%">
      <tbody>
        <tr>
          <td
            style={textStyle}>
            <EmptySpace height={200} />
            {props.children}
            <EmptySpace height={200} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};