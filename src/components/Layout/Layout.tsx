import Page from '../Page';
import Footer from '../Footer/Footer';

import classes from './Layout.module.scss';

function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <Page title={title}>
      <div className={classes.root}>
        {/* Header */}
        <div className={classes.content}>{children}</div>
        <Footer />
      </div>
    </Page>
  );
}

export default Layout;
