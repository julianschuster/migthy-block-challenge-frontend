import PropTypes from 'prop-types';
import '../styles/reset.scss';
import '../styles/globals.scss';
import '../styles/modal.scss';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { Header } from '../components/header';

const MyApp = ({
  Component, pageProps,
}) => (
  <>
    <Head>
      <title>Pixowlgram</title>
    </Head>
    <Toaster
      position="bottom-right"
    />
    <Header />
    <Component {...pageProps} />
  </>
);

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.object,
  userId: PropTypes.string,
};
