"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xf6e3b8, 2.2)
    key.position.set(5, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xd9bd7e, 1.4)
    rim.position.set(-6, -3, 4)
    scene.add(rim)

    // Floating gold rings (torus)
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc79a45,
      metalness: 1,
      roughness: 0.22,
    })
    const rings: THREE.Mesh[] = []
    const ringGeos = [
      new THREE.TorusGeometry(2.3, 0.09, 32, 160),
      new THREE.TorusGeometry(1.5, 0.06, 32, 160),
      new THREE.TorusGeometry(3.1, 0.05, 32, 200),
    ]
    ringGeos.forEach((geo, i) => {
      const m = new THREE.Mesh(geo, gold)
      m.rotation.x = Math.PI / 2.4 + i * 0.3
      m.rotation.y = i * 0.6
      m.position.z = -i * 0.8
      scene.add(m)
      rings.push(m)
    })

    // Gold particle field
    const count = 420
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xd9bd7e,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(pGeo, pMat)
    scene.add(points)

    // Interaction
    let targetX = 0
    let targetY = 0
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMove)

    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      const t = clock.getElapsedTime()
      rings.forEach((r, i) => {
        r.rotation.z = t * (0.12 + i * 0.05)
        r.rotation.y += 0.002
      })
      points.rotation.y = t * 0.03
      camera.position.x += (targetX * 1.5 - camera.position.x) * 0.04
      camera.position.y += (-targetY * 1.2 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      ringGeos.forEach((g) => g.dispose())
      pGeo.dispose()
      gold.dispose()
      pMat.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />
}
