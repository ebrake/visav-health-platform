import React from 'react';
import Layout from './layouts/Layout';
import VisavHeader from './modules/VisavHeader';
import Body from './modules/Body';
import Footer from './modules/Footer';
import colors from '../utils/colors';

export default function InviteUserEmail(props) {
  const { organizationName, invitedBy, user, password } = props;

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
    backgroundColor: colors.getColor('brightBlue'),
    WebkitAppearance: 'none !important',
    WebkitBorderRadius: 0
  };

  const actionsStyle = {
    margin: '20px 0 0 0'
  };

  var loginURL = process.env.API_ROOT + 'login';

  return (
    <Layout>
      <VisavHeader />
      <Body>
        Welcome to VISAV! You have been invited to {organizationName} by {invitedBy.firstName+' '+invitedBy.lastName}.
        Your account information is:
        <p>E-mail: { user.email }</p>
        <p>Password: { password }</p>
        <div style={actionsStyle} className="actions">
          <form action={loginURL} method="get">
            <input style={buttonStyle} type="submit" value="Log in here" />
          </form>
        </div>
      </Body>

      <Footer color="#134ac0" />
    </Layout>
  );
}

InviteUserEmail.defaultProps = {
  invitedBy: {
    email: 'kristophergoudie@krisandbrake.com',
    firstName: 'Kristopher',
    lastName: 'Goudie'
  },
  user: {
    email: 'dev@krisandbrake.com'
  },
  password: 'Afg1i72!j!?',
  organizationName: 'Phlex RS'
}