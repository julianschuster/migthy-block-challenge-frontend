import PropTypes from 'prop-types';
import '../styles/reset.scss';
import '../styles/globals.scss';
import '../styles/modal.scss';
import { Header } from '../components/header';

const MyApp = ({
  Component, pageProps,
}) => (
  <>
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
