import React from 'react';
import Layout from './layouts/Layout';
import PhlexHeader from './modules/PhlexHeader';
import Body from './modules/Body';
import Footer from './modules/Footer';
import phlexColors from '../utils/phlexColors';

export default function PasswordResetEmail(props) {
  const buttonStyle = {
    outline: 'none',
    border: 'none',
    display: 'inline-block',
    margin: '10px ',
    width: '40%',
    height: '50px',
    cursor: 'pointer',
    color: phlexColors.getFontColor('light'),
    fontSize: '15px',
    fontStyle: 'bold',
    float: 'middle',
    backgroundColor: phlexColors.getColor('red'),
  };
  const actionsStyle = {
    margin: '20px 0 0 0',

  };
  const { accessToken } = props;
  var takeActionURL = process.env.API_ROOT + 'resetPassword';

  return (
    <Layout>
      <PhlexHeader />
      <Body>
        <h2>Password reset requested!</h2>
        <p>A password reset was requested for your account. If you did not request this password reset, disregard this message.</p>
        <div style={actionsStyle} className="actions">
          <form action={takeActionURL} method="get">
            <input type="hidden" name="access_token" value={accessToken} />
            <input style={buttonStyle} type="submit" value="Set new password" />
          </form>
        </div>
      </Body>

      <Footer color="#134ac0" />
    </Layout>
  );

}

PasswordResetEmail.defaultProps = { 
  accessToken: 'ask98asd7he943385'
};
