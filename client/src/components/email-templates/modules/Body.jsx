import React from 'react';
import EmptySpace from './EmptySpace';

export default (props) => {

  const bodyStyle = {
    color: '#42444c',
    backgroundColor: '#eeeeee',
    fontFamily: 'Arial',
    fontSize: '18px',
    textAlign: 'center',
    padding: '20px'
  };

  return (
    <table width="100%">
      <tbody>
        <tr>
          <td
            className="body"
            style={bodyStyle}>
            <EmptySpace height={200} />
            <div className="content">
              {props.children}
            </div>
            <EmptySpace height={200} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};