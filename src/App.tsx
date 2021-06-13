import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  RouteProps,
} from 'react-router-dom'
import Light from './components/Lights';
import Overlay from './components/Overlay';
import { OverlayContext } from './components/Overlay/context';
import { store } from './store';
import * as Views from './views'

const routes: RouteProps[] = [
  { path: "/home", component: Views.Home },
  { path: "/demo", component: Views.Demo },
  { path: "/live", component: Views.Live }
]

function App() {
  const [overlayProps, setOverlayProps] = useState({})

  return (
    <Overlay {...overlayProps}>
      <Canvas
        camera={{ position: [0,0,20] }}
      >
        <Provider store={store}>  
          <Light>
            <OverlayContext.Provider value={{ setOverlayProps, resetOverlay: () => setOverlayProps({}) }}>
              <Router>
                <Switch>
                  {routes.map((props,index) => <Route key={index} exact {...props}/>)}
                  <Route path="/">
                    <Redirect to="/home"/>
                  </Route>
                </Switch>
              </Router>
            </OverlayContext.Provider>
          </Light>
        </Provider>
      </Canvas>
    </Overlay>
  );
}

export default App;
