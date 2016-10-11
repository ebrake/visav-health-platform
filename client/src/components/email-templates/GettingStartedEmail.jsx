import React from 'react';
import Layout from './layouts/Layout';
import VisavHeader from './modules/VisavHeader';
import Body from './modules/Body';
import Footer from './modules/Footer';

export default function GettingStartedEmail(props) {

  const { user } = props;

  return (
    <Layout>
      <VisavHeader />

      <Body>
        Welcome to VISAV!
        <p>Here is your e-mail: { user.email }</p>
      </Body>

      <Footer color="#134ac0" />
    </Layout>
  );

}

GettingStartedEmail.defaultProps = { user: { email: 'dev@test.user'} };
