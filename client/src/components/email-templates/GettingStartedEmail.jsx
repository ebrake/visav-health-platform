import React from 'react';
import Layout from './layouts/Layout';
import Header from './modules/Header';
import Body from './modules/Body';
import Footer from './modules/Footer';

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
