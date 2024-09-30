import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Stats, Html, useAnimations } from '@react-three/drei'
import { useControls } from 'leva'
import Models from './models.json'
import { AnimationMixer, Vector3 } from 'three'
import { useRef } from 'react'


const Annotation = ({ key, position, distanceFactor, userData }) => {
  const [show, setShow] = useState(false);
  return (
    <Html key={key} position={position} distanceFactor={distanceFactor}>
      <div onClick={() => setShow(!show)} className='annotation-toggle'>{userData.prop || userData.name}</div>
      <div className={`annotation ${show ? "show" : "hide"}`} >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam distinctio voluptate beatae incidunt. Magnam ipsam consectetur tempore voluptates voluptatibus, qui magni veniam officia eaque quis quas corporis quibusdam unde ipsum repellendus ratione similique quae? Unde officia sint incidunt quaerat esse.</div>
    </Html >
  )
}


function Model({ url, explode }) {

  console.log("url", url)
  const { scene, animations } = useGLTF(url, true)
  const [cache, setCache] = useState({})
  const group = useRef();
  // useFrame(({ clock }) => {
  //   scene.rotation.y = clock.getElapsedTime();
  // })

  const { actions, mixer } = useAnimations(animations, group);

  console.log("action", actions)

  if (!cache[url]) {
    const annotations = []
    // console.log("secen", scene);
    scene.traverse((o) => {
      if (o.userData.name || o.userData.prop) {
        // o.visible = false;
        annotations.push(
          <Annotation key={o.uuid} position={[o.position.x, o.position.y, o.position.z]} distanceFactor={0.25} userData={o.userData} />
        )
      }
    })
    // scene.traverse((o) => {
    //   // o.userData["lol"] = "test";
    //   console.log("traverse:", o.userData.prop || o.userData.name)
    //   // if (o.userData.name == "outer_box") {
    //   //   console.log(o);
    //   //   // o?.addEventListener('click', () => { o.visible = !o.visible });
    //   // }
    // })


    // useEffect(() => {
    //   actions.Animation.play();
    // }, [mixer]);
    // console.log(annotations);
    console.log('Caching JSX for url ' + url)
    setCache({
      ...cache,
      [url]: <primitive
        // onClick={(e) => {
        //   console.log("event", e.object.userData.name, e);
        //   if (e.object.visible || !e.object.visible) {
        //     e.object.visible = !e.object.visible
        //   }
        // }}   
        ref={group}

        object={scene}>{annotations}</primitive>
    })
  }

  if (explode) {
    console.log("animations", actions.Animation)

    Object.keys(actions).forEach((action) => {
      actions[action].play();
    })
    // scene.traverse((o) => {
    //   // console.log("traverse:", o.userData.prop || o.userData.name)
    //   // console.log("animation:", o)
    //   // let { x, y, z } = o.position;
    //   // var point = new Vector3(x, y, z);
    //   // point.multiplyScalar(3);

    //   // o.position.x = point.x;
    //   // o.position.y = point.y;
    //   // o.position.z = point.z;

    // })
  }
  else {

    Object.keys(actions).forEach((action) => {
      actions[action].stop();
    })
  }

  return cache[url]
}

export default function App() {
  const { model, explode } = useControls({
    model: {
      value: 'batteryGlb',
      options: Object.keys(Models)
    },
    explode: {
      value: false,
      options: [true, false]
    }
  })



  return (
    <>
      <Canvas camera={{ position: [0, 0, -0.2], near: 0.025 }}>
        <Environment
          files="https://cdn.jsdelivr.net/gh/Sean-Bradley/React-Three-Fiber-Boilerplate@annotations/public/img/workshop_1k.hdr"
          background
        />
        <group>
          <Model url={Models[model]} explode={explode} />
        </group>
        <OrbitControls />
        <Stats />
      </Canvas>
      <span id="info">The {model.replace(/([A-Z])/g, ' $1').toLowerCase()} is selected.</span>
    </>
  )
}
