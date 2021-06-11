import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  RouteProps,
} from 'react-router-dom'
import Overlay from './components/Overlay';
import { OverlayContext } from './components/Overlay/context';
import { CanvasContext, CanvasStateEnum } from './core/Canvas';
import { SceneHandler } from './scenes';
import * as Views from './views'

const routes: RouteProps[] = [
  { path: "/home", component: Views.Home },
  { path: "/demo", component: Views.Demo },
  { path: "/live", component: Views.Live }
]

function App() {
  const [overlayProps, setOverlayProps] = useState({})
  const [canvasState, setCanvasState] = useState(CanvasStateEnum.Initial)

  return (
    <Router>
      <OverlayContext.Provider value={{ setOverlayProps, resetOverlay: () => setOverlayProps({}) }}>
        <CanvasContext.Provider value={{ state: canvasState, setState: setCanvasState }}>
          <Switch>
            {routes.map((props,index) => <Route key={index} exact {...props}/>)}
            <Route path="/">
              <Redirect to="/home"/>
            </Route>
          </Switch>
          <Overlay {...overlayProps}>
            <Canvas
              camera={{ position: [0,0,20] }}
            >
              <directionalLight position={[1, 5, 1]} intensity={0.8} />
              <SceneHandler state={canvasState}/>
            </Canvas>
          </Overlay>
        </CanvasContext.Provider>
      </OverlayContext.Provider>
    </Router>
  );
}

export default App;
