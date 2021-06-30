import React from "react";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Login from "views/examples/Login.js";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />

          <Redirect from="/" to="/admin/index" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
