import Page from '../Page';
import Footer from '../Footer/Footer';
import HeaderComponent from '../Header/Header';

import classes from './Layout.module.scss';

function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Page title={title}>
      <div className={classes.root}>
        <HeaderComponent />
        <div className={classes.contentWrapper}>
          <div className={classes.content}>{children}</div>
        </div>
        <Footer />
      </div>
    </Page>
  );
}

export default Layout;
