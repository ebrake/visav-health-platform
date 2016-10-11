import React from 'react';
import Layout from './layouts/Layout';
import VisavHeader from './modules/VisavHeader';
import Body from './modules/Body';
import Footer from './modules/Footer';
import colors from '../utils/colors';

export default function PasswordResetEmail(props) {
  const buttonStyle = {
    outline: 'none',
    border: 'none',
    display: 'inline-block',
    margin: '10px ',
    width: '40%',
    height: '50px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '15px',
    fontStyle: 'bold',
    float: 'middle',
    backgroundColor: colors.getColor('red'),
    WebkitAppearance: 'none !important',
    WebkitBorderRadius: 0
  };

  const actionsStyle = {
    margin: '20px 0 0 0'
  };

  const { accessToken } = props;
  
  var takeActionURL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000/resetPassword' : process.env.API_ROOT + 'resetPassword');

  return (
    <Layout>
      <VisavHeader />
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
