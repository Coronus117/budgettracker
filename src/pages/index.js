import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";

import App from "../App";
import { fetcher } from "/src/helpers";

const IndexPage = () => {
  return (
    <BrowserRouter>
      <SWRConfig value={{ fetcher }}>
        <App />
      </SWRConfig>
    </BrowserRouter>
  );
};

export default IndexPage;
