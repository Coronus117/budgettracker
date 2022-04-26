import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

function Layout({ clickAddHandler, children }) {
  return (
    <div>
      <Navigation clickAddHandler={clickAddHandler} />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
