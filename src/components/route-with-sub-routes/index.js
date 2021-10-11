import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

function RouteWithSubRoutes({ routes }) {
  if (!routes?.length) return null

  return (
    <Switch>
      {routes.map((route) =>
        route.redirectTo ? (
          <Redirect from={route.path} to={route.redirectTo} exact key={route.path} />
        ) : (
          <Route
            key={route.path}
            path={route.path}
            exact={!!route.exact}
            render={(props) => <route.component {...props} routes={route.routes} />}
          />
        )
      )}
    </Switch>
  )
}

export default RouteWithSubRoutes
