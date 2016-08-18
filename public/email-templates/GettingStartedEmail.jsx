import React from 'react';
import Layout from './layouts/Layout.jsx';
import Header from './modules/Header.jsx';
import Body from './modules/Body.jsx';
import Footer from './modules/Footer.jsx';

export default function GettingStartedEmail(props) {
  
  const { user } = props;

  return (
    <Layout>
      <Header color="#134ac0" />

      <Body>
        Welcome to VISAV!
        <p>Here is your e-mail: {user.email}</p>
      </Body>

      <Footer color="#134ac0" />
    </Layout>
  );

}
