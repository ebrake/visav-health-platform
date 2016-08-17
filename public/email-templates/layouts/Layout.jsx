import React from 'react';


export default (props) => {

  const tableStyle = {
    WebkitTextSizeAdjust: '100%',
    msTextSizeAdjust: '100%',
    msoTableLspace: '0pt',
    msoTableRspace: '0pt',
    borderCollapse: 'collapse',
    margin: '0px auto',
    textAlign: 'center'
  };

  const tdStyle = {
    textAlign: 'center'
  };

  return (
    <table
      width="100%"
      style={tableStyle}>
      <tbody>
        <tr>
          <td style={tdStyle}>

            {/* Centered column */}
            <table
              width="600"
              style={tableStyle}>
              <tbody>
                <tr>
                  <td>
                    {props.children}
                  </td>
                </tr>
              </tbody>
            </table>

          </td>
        </tr>
      </tbody>
    </table>
  );
};