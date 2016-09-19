import React from 'react';
import Layout from './layouts/Layout';
import PhlexHeader from './modules/PhlexHeader';
import Body from './modules/Body';
import Footer from './modules/Footer';
import phlexColors from '../utils/phlexColors';

export default function InviteUserEmail(props) {
  const { organizationName, invitedBy, user, password } = props;

  return (
    <Layout>
      <PhlexHeader />
      <Body>
        Welcome to VISAV! You have been invited to {organizationName} by {invitedBy.firstName+' '+invitedBy.lastName}.
        Your account information is:
        <p>E-mail: { user.email }</p>
        <p>Password: { password }</p>
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
  organizationName: 'Super Medicine Group'
}