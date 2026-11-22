/**
 * Anatoma 3D — Comprehensive Procedural 3D Human Body Builder (34 Clickable Structures)
 * Anatomical coordinate convention:
 *   +Y = up (feet ~ -0.12, head top ~ 1.74)
 *   +Z = anterior (front of body)
 *   -X = anatomical RIGHT (viewer's left when facing body)
 *   +X = anatomical LEFT  (viewer's right when facing body)
 */
(function (global) {
  'use strict';

  function buildHumanBody(THREE) {
    const root = new THREE.Group();
    root.name = 'HumanBodyRoot';

    // Independent translucent outer body shell (controlled by Body Shell slider)
    const bodyShellGroup = new THREE.Group();
    bodyShellGroup.name = 'BodyShellGroup';
    root.add(bodyShellGroup);

    // 11 Toggleable Body System Groups (Complete Human Body)
    const systemGroups = {
      muscular: new THREE.Group(),
      skeletal: new THREE.Group(),
      nervous: new THREE.Group(),
      circulatory: new THREE.Group(),
      respiratory: new THREE.Group(),
      digestive: new THREE.Group(),
      urinary: new THREE.Group(),
      endocrine: new THREE.Group(),
      lymphatic: new THREE.Group(),
      reproductive: new THREE.Group(),
      integumentary: new THREE.Group()
    };

    Object.entries(systemGroups).forEach(([key, grp]) => {
      grp.name = `system_${key}`;
      root.add(grp);
    });

    // Start outer muscular & integumentary layers OFF by default so internal organs are unobstructed
    systemGroups.muscular.visible = false;
    systemGroups.integumentary.visible = false;

    const organs = {};
    const clickableMeshes = [];

    function registerOrgan(id, system, group, explodeOffset, focusDist = 0.65) {
      group.userData.organId = id;
      const meshes = [];
      group.traverse((child) => {
        if (child.isMesh) {
          child.userData.organId = id;
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material && !child.userData._matCloned) {
            child.material = child.material.clone();
            child.userData._matCloned = true;
            child.userData.baseColor = child.material.color ? child.material.color.clone() : null;
            child.userData.baseEmissive = child.material.emissive
              ? child.material.emissive.clone()
              : new THREE.Color(0x000000);
            child.userData.baseEmissiveIntensity = child.material.emissiveIntensity || 0;
          }
          meshes.push(child);
          clickableMeshes.push(child);
        }
      });

      const box = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      box.getCenter(center);

      organs[id] = {
        id,
        system,
        group,
        meshes,
        basePos: group.position.clone(),
        explodeOffset: new THREE.Vector3(explodeOffset[0], explodeOffset[1], explodeOffset[2]),
        localCenter: center.clone().sub(group.position),
        focusDist
      };
      systemGroups[system].add(group);
    }

    // Shared Materials
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.22,
      roughness: 0.35,
      metalness: 0.08,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      side: THREE.FrontSide
    });

    const muscleMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0x881337,
      emissiveIntensity: 0.22,
      roughness: 0.48,
      metalness: 0.06,
      transparent: true,
      opacity: 0.86
    });

    const muscleDeepMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      emissive: 0x4c0519,
      emissiveIntensity: 0.2,
      roughness: 0.52,
      transparent: true,
      opacity: 0.86
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x1e293b,
      emissiveIntensity: 0.08,
      roughness: 0.44,
      metalness: 0.05,
      transparent: true,
      opacity: 0.62
    });

    // =========================================================================
    // 1. TRANSLUCENT HUMAN BODY SHELL (Male & Female Sculpted Silhouettes)
    // =========================================================================
    const maleShellGroup = new THREE.Group();
    const femaleShellGroup = new THREE.Group();
    femaleShellGroup.visible = false;
    bodyShellGroup.add(maleShellGroup);
    bodyShellGroup.add(femaleShellGroup);

    function buildSilhouette(targetGrp, isFemale) {
      function addS(geo, pos, rot, scale) {
        const m = new THREE.Mesh(geo, skinMat);
        if (pos) m.position.set(pos[0], pos[1], pos[2]);
        if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
        if (scale) m.scale.set(scale[0], scale[1], scale[2]);
        targetGrp.add(m);
        return m;
      }

      // Head & Neck
      addS(new THREE.SphereGeometry(0.110, 28, 24), [0, 1.61, 0.005], null, isFemale ? [0.85, 1.05, 0.94] : [0.88, 1.08, 0.96]);
      addS(new THREE.CylinderGeometry(isFemale ? 0.043 : 0.048, isFemale ? 0.052 : 0.058, 0.11, 20), [0, 1.45, -0.005]);

      // Sculpted Torso via LatheGeometry
      const torsoPts = isFemale
        ? [
            new THREE.Vector2(0.01, 0.64),
            new THREE.Vector2(0.155, 0.69),
            new THREE.Vector2(0.178, 0.78), // Wider hips
            new THREE.Vector2(0.122, 0.94), // Sculpted waist
            new THREE.Vector2(0.145, 1.08),
            new THREE.Vector2(0.168, 1.24),
            new THREE.Vector2(0.168, 1.34), // Narrower shoulders
            new THREE.Vector2(0.10, 1.40),
            new THREE.Vector2(0.05, 1.42)
          ]
        : [
            new THREE.Vector2(0.01, 0.64),
            new THREE.Vector2(0.145, 0.68),
            new THREE.Vector2(0.162, 0.77),
            new THREE.Vector2(0.144, 0.90),
            new THREE.Vector2(0.158, 1.04),
            new THREE.Vector2(0.192, 1.22),
            new THREE.Vector2(0.198, 1.34), // Broader shoulders
            new THREE.Vector2(0.11, 1.40),
            new THREE.Vector2(0.055, 1.42)
          ];
      const tGeo = new THREE.LatheGeometry(torsoPts, 32);
      tGeo.scale(1.04, 1.0, 0.68);
      addS(tGeo, [0, 0, 0]);

      // Subtle anatomical chest contour for Female silhouette
      if (isFemale) {
        [-1, 1].forEach((side) => {
          addS(new THREE.SphereGeometry(0.062, 20, 16), [side * 0.072, 1.205, 0.095], null, [1.0, 0.92, 0.78]);
        });
      }

      const shX = isFemale ? 0.198 : 0.225;
      const armScale = isFemale ? 0.86 : 1.0;

      [-1, 1].forEach((side) => {
        addS(new THREE.SphereGeometry(0.064 * armScale, 20, 16), [side * shX, 1.33, -0.005], null, [0.95, 1.05, 0.9]);
        addS(new THREE.CylinderGeometry(0.046 * armScale, 0.038 * armScale, 0.30, 18), [side * (shX + 0.02), 1.15, -0.005], [0, 0, side * 0.07]);
        addS(new THREE.SphereGeometry(0.038 * armScale, 14, 12), [side * (shX + 0.035), 0.99, -0.005]);
        addS(new THREE.CylinderGeometry(0.036 * armScale, 0.027 * armScale, 0.27, 16), [side * (shX + 0.05), 0.85, 0.015], [-0.08, 0, side * 0.06]);
        addS(new THREE.SphereGeometry(0.034 * armScale, 14, 12), [side * (shX + 0.06), 0.69, 0.028], null, [0.65, 1.35, 0.85]);

        const hipX = isFemale ? 0.106 : 0.098;
        addS(new THREE.CylinderGeometry(isFemale ? 0.085 : 0.082, 0.055, 0.42, 20), [side * hipX, 0.49, 0], [0, 0, -side * (isFemale ? 0.055 : 0.04)]);
        addS(new THREE.SphereGeometry(0.050, 16, 12), [side * 0.088, 0.27, 0.005]);
        addS(new THREE.CylinderGeometry(0.050, 0.034, 0.38, 18), [side * 0.085, 0.09, -0.008]);
        addS(new THREE.SphereGeometry(0.043, 16, 12), [side * 0.085, -0.10, 0.045], null, [0.85, 0.55, 1.85]);
      });
    }

    buildSilhouette(maleShellGroup, false);
    buildSilhouette(femaleShellGroup, true);

    // =========================================================================
    // 2. MUSCULAR SYSTEM (8 Clickable Major Muscle Groups)
    // =========================================================================
    // Pectorals
    const pectoralsGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const pec = new THREE.Mesh(new THREE.SphereGeometry(0.082, 20, 16), muscleMat);
      pec.position.set(side * 0.086, 1.245, 0.098);
      pec.scale.set(1.18, 0.78, 0.36);
      pec.rotation.y = side * 0.25;
      pectoralsGroup.add(pec);
    });
    registerOrgan('pectorals', 'muscular', pectoralsGroup, [0, 0.06, 0.34], 0.62);

    // Deltoids
    const deltoidsGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const delt = new THREE.Mesh(new THREE.SphereGeometry(0.062, 18, 14), muscleMat);
      delt.position.set(side * 0.222, 1.33, -0.005);
      delt.scale.set(0.95, 1.15, 0.92);
      deltoidsGroup.add(delt);
    });
    registerOrgan('deltoids', 'muscular', deltoidsGroup, [0, 0.14, 0.14], 0.68);

    // Biceps & Triceps
    const bicepsGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const bi = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 14), muscleMat);
      bi.position.set(side * 0.244, 1.155, 0.014);
      bi.scale.set(0.85, 2.75, 0.85);
      bi.rotation.z = side * 0.07;
      bicepsGroup.add(bi);

      const tri = new THREE.Mesh(new THREE.SphereGeometry(0.040, 16, 14), muscleDeepMat);
      tri.position.set(side * 0.244, 1.16, -0.022);
      tri.scale.set(0.82, 2.65, 0.78);
      tri.rotation.z = side * 0.07;
      bicepsGroup.add(tri);
    });
    registerOrgan('biceps', 'muscular', bicepsGroup, [0, 0.02, 0.18], 0.72);

    // Abdominals (6-pack segments + obliques)
    const absGroup = new THREE.Group();
    for (let row = 0; row < 4; row++) {
      [-1, 1].forEach((side) => {
        const seg = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 12), muscleMat);
        seg.position.set(side * 0.034, 1.07 - row * 0.068, 0.095 - row * 0.004);
        seg.scale.set(1.05, 0.95, 0.45);
        absGroup.add(seg);
      });
    }
    [-1, 1].forEach((side) => {
      const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.24, 12), muscleDeepMat);
      ob.position.set(side * 0.115, 0.96, 0.045);
      ob.scale.set(0.75, 1.0, 0.62);
      absGroup.add(ob);
    });
    registerOrgan('abdominals', 'muscular', absGroup, [0, -0.04, 0.36], 0.62);

    // Latissimus Dorsi & Trapezius (Back)
    const latGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const trap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14), muscleMat);
      trap.position.set(side * 0.068, 1.33, -0.082);
      trap.scale.set(1.2, 1.15, 0.35);
      latGroup.add(trap);

      const lat = new THREE.Mesh(new THREE.SphereGeometry(0.088, 16, 14), muscleDeepMat);
      lat.position.set(side * 0.092, 1.11, -0.088);
      lat.scale.set(1.0, 1.85, 0.35);
      lat.rotation.z = -side * 0.18;
      latGroup.add(lat);
    });
    registerOrgan('latissimus', 'muscular', latGroup, [0, 0.04, -0.34], 0.72);

    // Gluteus Maximus
    const glutesGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const glute = new THREE.Mesh(new THREE.SphereGeometry(0.082, 18, 14), muscleMat);
      glute.position.set(side * 0.076, 0.725, -0.082);
      glute.scale.set(1.05, 1.12, 0.72);
      glutesGroup.add(glute);
    });
    registerOrgan('glutes', 'muscular', glutesGroup, [0, -0.08, -0.34], 0.65);

    // Quadriceps & Hamstrings
    const quadsGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const quad = new THREE.Mesh(new THREE.SphereGeometry(0.068, 18, 14), muscleMat);
      quad.position.set(side * 0.098, 0.50, 0.025);
      quad.scale.set(0.92, 2.75, 0.78);
      quad.rotation.z = -side * 0.04;
      quadsGroup.add(quad);

      const ham = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 14), muscleDeepMat);
      ham.position.set(side * 0.098, 0.49, -0.028);
      ham.scale.set(0.86, 2.65, 0.72);
      ham.rotation.z = -side * 0.04;
      quadsGroup.add(ham);
    });
    registerOrgan('quadriceps', 'muscular', quadsGroup, [0, -0.14, 0.22], 0.78);

    // Calves (Gastrocnemius)
    const calvesGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const calf = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 14), muscleMat);
      calf.position.set(side * 0.085, 0.145, -0.032);
      calf.scale.set(0.88, 2.45, 0.78);
      calvesGroup.add(calf);
    });
    registerOrgan('calves', 'muscular', calvesGroup, [0, -0.22, -0.22], 0.72);

    // =========================================================================
    // 3. SKELETAL SYSTEM (8 Clickable Bone Groups Across Entire Body)
    // =========================================================================
    // Skull (Cranium & Jaw)
    const skullGroup = new THREE.Group();
    const craniumMat = boneMat.clone();
    craniumMat.opacity = 0.34;
    craniumMat.depthWrite = false;
    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.098, 24, 18), craniumMat);
    cranium.position.set(0, 1.625, -0.005);
    cranium.scale.set(0.88, 1.02, 0.96);
    skullGroup.add(cranium);

    const jaw = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.015, 10, 18, Math.PI), boneMat);
    jaw.position.set(0, 1.535, 0.025);
    jaw.rotation.set(Math.PI * 0.42, 0, Math.PI);
    skullGroup.add(jaw);
    registerOrgan('skull', 'skeletal', skullGroup, [0, 0.34, 0.04], 0.46);

    // Clavicle & Scapula
    const clavicleGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const clav = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.175, 10), boneMat);
      clav.position.set(side * 0.105, 1.36, 0.055);
      clav.rotation.set(0, 0, Math.PI / 2 - side * 0.12);
      clavicleGroup.add(clav);

      const scap = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 3), boneMat);
      scap.position.set(side * 0.098, 1.25, -0.092);
      scap.scale.set(1.0, 1.0, 0.22);
      scap.rotation.set(Math.PI, 0, side * 0.12);
      clavicleGroup.add(scap);
    });
    registerOrgan('clavicle', 'skeletal', clavicleGroup, [0, 0.16, 0.14], 0.65);

    // Spine
    const spineGroup = new THREE.Group();
    const vertebraCount = 24;
    for (let i = 0; i < vertebraCount; i++) {
      const t = i / (vertebraCount - 1);
      const y = 0.72 + t * 0.72;
      const z = -0.078 + Math.sin(t * Math.PI * 2) * 0.015;
      const size = 0.022 - t * 0.006;
      const vert = new THREE.Mesh(new THREE.CylinderGeometry(size, size * 1.05, 0.021, 12), boneMat);
      vert.position.set(0, y, z);
      spineGroup.add(vert);
      const proc = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.014, 0.022), boneMat);
      proc.position.set(0, y - 0.004, z - size * 1.0);
      spineGroup.add(proc);
    }
    registerOrgan('spine', 'skeletal', spineGroup, [0, 0, -0.32], 0.75);

    // Ribcage & Sternum
    const ribcageGroup = new THREE.Group();
    const ribMat = boneMat.clone();
    ribMat.opacity = 0.48;
    const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.19, 0.014), ribMat);
    sternum.position.set(0, 1.22, 0.112);
    ribcageGroup.add(sternum);

    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const y = 1.33 - t * 0.27;
      const width = 0.115 + Math.sin(t * Math.PI * 0.85 + 0.2) * 0.055;
      const depth = 0.085 + Math.sin(t * Math.PI * 0.85 + 0.2) * 0.035;
      const isFloating = i >= 8;

      [-1, 1].forEach((side) => {
        const pts = [];
        const segs = 12;
        const maxAngle = isFloating ? Math.PI * 0.68 : Math.PI * 0.96;
        for (let s = 0; s <= segs; s++) {
          const a = (s / segs) * maxAngle;
          pts.push(
            new THREE.Vector3(
              side * Math.sin(a) * width,
              y - Math.sin(a * 0.65) * 0.026,
              -0.072 + (1 - Math.cos(a)) * depth
            )
          );
        }
        ribcageGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.0062, 7, false), ribMat));
      });
    }
    registerOrgan('ribcage', 'skeletal', ribcageGroup, [0, 0.06, 0.22], 0.75);

    // Pelvis
    const pelvisGroup = new THREE.Group();
    const pelvisRing = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.028, 12, 24, Math.PI * 1.35), boneMat);
    pelvisRing.position.set(0, 0.72, -0.01);
    pelvisRing.rotation.set(Math.PI * 0.48, 0, -Math.PI * 0.175);
    pelvisRing.scale.set(1.05, 0.78, 1.0);
    pelvisGroup.add(pelvisRing);
    [-1, 1].forEach((side) => {
      const ilium = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 12), boneMat);
      ilium.position.set(side * 0.105, 0.76, -0.015);
      ilium.scale.set(0.45, 1.15, 0.95);
      ilium.rotation.z = side * 0.35;
      pelvisGroup.add(ilium);
    });
    registerOrgan('pelvis', 'skeletal', pelvisGroup, [0, -0.14, 0.08], 0.62);

    // Arm Bones (Humerus, Radius & Ulna)
    const armBonesGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const hum = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.30, 10), boneMat);
      hum.position.set(side * 0.242, 1.16, -0.005);
      hum.rotation.set(0, 0, side * 0.07);
      armBonesGroup.add(hum);

      const radius = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.009, 0.25, 10), boneMat);
      radius.position.set(side * 0.282, 0.86, 0.016);
      radius.rotation.set(-0.08, 0, side * 0.06);
      armBonesGroup.add(radius);

      const ulna = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.007, 0.25, 10), boneMat);
      ulna.position.set(side * 0.264, 0.86, 0.006);
      ulna.rotation.set(-0.08, 0, side * 0.06);
      armBonesGroup.add(ulna);
    });
    registerOrgan('arm_bones', 'skeletal', armBonesGroup, [0, 0.02, 0.08], 0.82);

    // Femur (Thigh Bones)
    const femurGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const fem = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.017, 0.41, 12), boneMat);
      fem.position.set(side * 0.098, 0.49, 0);
      fem.rotation.set(0, 0, -side * 0.04);
      femurGroup.add(fem);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), boneMat);
      head.position.set(side * 0.085, 0.68, 0);
      femurGroup.add(head);
    });
    registerOrgan('femur', 'skeletal', femurGroup, [0, -0.18, 0.10], 0.78);

    // Lower Leg Bones (Tibia, Fibula & Patella)
    const legBonesGroup = new THREE.Group();
    [-1, 1].forEach((side) => {
      const patella = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 10), boneMat);
      patella.position.set(side * 0.088, 0.275, 0.032);
      patella.scale.set(1.0, 1.05, 0.52);
      legBonesGroup.add(patella);

      const tib = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.013, 0.36, 12), boneMat);
      tib.position.set(side * 0.082, 0.09, -0.002);
      legBonesGroup.add(tib);

      const fib = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.34, 8), boneMat);
      fib.position.set(side * 0.102, 0.09, -0.012);
      legBonesGroup.add(fib);
    });
    registerOrgan('leg_bones', 'skeletal', legBonesGroup, [0, -0.26, 0.10], 0.78);

    // =========================================================================
    // 4. NERVOUS SYSTEM (Brain, Spinal Cord, Peripheral Nerves)
    // =========================================================================
    const brainGroup = new THREE.Group();
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.25,
      roughness: 0.52,
      metalness: 0.08
    });

    function makeHemisphere(side) {
      const geo = new THREE.SphereGeometry(0.064, 32, 24);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
        const wrinkle = Math.sin(vx * 75 + vy * 55) * 0.0028 + Math.cos(vz * 65 - vy * 60) * 0.0024;
        const medial = side * vx < 0 ? 0.68 : 1.0;
        pos.setXYZ(i, vx * medial * 0.84 + wrinkle, vy * 1.02 + wrinkle, vz * 1.22 + wrinkle);
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, brainMat);
      mesh.position.set(side * 0.030, 1.635, -0.005);
      return mesh;
    }
    brainGroup.add(makeHemisphere(-1));
    brainGroup.add(makeHemisphere(1));

    const cerebellumMat = brainMat.clone();
    cerebellumMat.color.setHex(0xc084fc);
    const cerebellum = new THREE.Mesh(new THREE.SphereGeometry(0.036, 20, 14), cerebellumMat);
    cerebellum.position.set(0, 1.565, -0.048);
    cerebellum.scale.set(1.45, 0.72, 0.85);
    brainGroup.add(cerebellum);

    const brainstem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.011, 0.085, 14), cerebellumMat);
    brainstem.position.set(0, 1.525, -0.032);
    brainstem.rotation.x = 0.22;
    brainGroup.add(brainstem);
    registerOrgan('brain', 'nervous', brainGroup, [0, 0.28, 0.05], 0.42);

    const spinalCordGroup = new THREE.Group();
    const nerveMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.45,
      roughness: 0.35
    });

    const cordPts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      cordPts.push(new THREE.Vector3(0, 1.49 - t * 0.74, -0.068 + Math.sin((1 - t) * Math.PI * 2) * 0.015));
    }
    const cordCurve = new THREE.CatmullRomCurve3(cordPts);
    spinalCordGroup.add(new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 28, 0.0095, 10, false), nerveMat));

    for (let i = 1; i < 14; i++) {
      const p = cordCurve.getPoint(i / 14);
      [-1, 1].forEach((side) => {
        const rootCurve = new THREE.CatmullRomCurve3([
          p,
          new THREE.Vector3(side * 0.045, p.y - 0.015, p.z + 0.01),
          new THREE.Vector3(side * 0.095, p.y - 0.045, p.z + 0.02)
        ]);
        spinalCordGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rootCurve, 8, 0.0028, 6, false), nerveMat));
      });
    }
    registerOrgan('spinal_cord', 'nervous', spinalCordGroup, [0, 0, -0.22], 0.65);

    // Clickable Organ: PERIPHERAL NERVES
    const peripheralNervesGroup = new THREE.Group();
    const nervePaths = [cordCurve];
    [-1, 1].forEach((side) => {
      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.38, -0.06),
        new THREE.Vector3(side * 0.16, 1.34, -0.02),
        new THREE.Vector3(side * 0.24, 1.15, -0.01),
        new THREE.Vector3(side * 0.27, 0.85, 0.015)
      ]);
      const legCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.78, -0.06),
        new THREE.Vector3(side * 0.085, 0.66, -0.02),
        new THREE.Vector3(side * 0.095, 0.42, -0.01),
        new THREE.Vector3(side * 0.085, 0.12, -0.01)
      ]);
      const thinNerveMat = nerveMat.clone();
      thinNerveMat.transparent = true;
      thinNerveMat.opacity = 0.78;
      peripheralNervesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(armCurve, 18, 0.0045, 6, false), thinNerveMat));
      peripheralNervesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(legCurve, 18, 0.005, 6, false), thinNerveMat));
      nervePaths.push(armCurve, legCurve);
    });
    registerOrgan('peripheral_nerves', 'nervous', peripheralNervesGroup, [0, -0.04, -0.14], 0.95);

    // Clickable Facial Organ: EYES (Nervous / Sensory)
    const eyesGroup = new THREE.Group();
    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.22, metalness: 0.05 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0369a1, emissiveIntensity: 0.35, roughness: 0.2 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.1 });
    [-1, 1].forEach((side) => {
      const eyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.0145, 16, 14), scleraMat);
      eyeBall.position.set(side * 0.036, 1.615, 0.092);
      eyesGroup.add(eyeBall);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 14, 12), irisMat);
      iris.position.set(side * 0.036, 1.615, 0.101);
      iris.scale.set(1, 1, 0.55);
      eyesGroup.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 12, 10), pupilMat);
      pupil.position.set(side * 0.036, 1.615, 0.105);
      pupil.scale.set(1, 1, 0.4);
      eyesGroup.add(pupil);

      // Optic nerve connecting back into brain
      const optCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.036, 1.615, 0.080),
        new THREE.Vector3(side * 0.018, 1.612, 0.042),
        new THREE.Vector3(side * 0.008, 1.608, 0.012)
      ]);
      eyesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(optCurve, 10, 0.0032, 6, false), nerveMat));
    });
    registerOrgan('eyes', 'nervous', eyesGroup, [0, 0.16, 0.24], 0.34);

    // Clickable Facial Organ: EARS (Nervous / Sensory)
    const earsGroup = new THREE.Group();
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xe9d5ff,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.25,
      roughness: 0.45
    });
    const cochleaMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x9333ea,
      emissiveIntensity: 0.45,
      roughness: 0.35
    });
    [-1, 1].forEach((side) => {
      // Outer ear auricle
      const auricle = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.0065, 10, 18, Math.PI * 1.45), earMat);
      auricle.position.set(side * 0.098, 1.605, -0.004);
      auricle.rotation.set(0, side * Math.PI * 0.46, side * 0.25);
      auricle.scale.set(0.75, 1.25, 0.85);
      earsGroup.add(auricle);

      // Inner ear canal & cochlea
      const canal = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.032, 8), cochleaMat);
      canal.position.set(side * 0.082, 1.605, -0.004);
      canal.rotation.z = Math.PI / 2;
      earsGroup.add(canal);

      const cochlea = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 10), cochleaMat);
      cochlea.position.set(side * 0.064, 1.605, -0.004);
      earsGroup.add(cochlea);
    });
    registerOrgan('ears', 'nervous', earsGroup, [0, 0.14, 0.02], 0.38);

    // Clickable Facial Organ: NOSE & NASAL CAVITY (Respiratory)
    const noseGroup = new THREE.Group();
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.42
    });
    // Sculpted nasal bridge & tip
    const nasalBridge = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.044, 6), noseMat);
    nasalBridge.position.set(0, 1.586, 0.107);
    nasalBridge.rotation.x = 0.38;
    nasalBridge.scale.set(0.85, 1.0, 0.72);
    noseGroup.add(nasalBridge);

    // Internal nasal passage curving back toward throat/trachea
    const nasalAirway = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.572, 0.105),
      new THREE.Vector3(0, 1.582, 0.058),
      new THREE.Vector3(0, 1.545, 0.020),
      new THREE.Vector3(0, 1.475, 0.015)
    ]);
    noseGroup.add(new THREE.Mesh(new THREE.TubeGeometry(nasalAirway, 14, 0.009, 8, false), noseMat));
    registerOrgan('nose', 'respiratory', noseGroup, [0, 0.12, 0.28], 0.34);

    // Clickable Facial Organ: MOUTH, TONGUE & TEETH (Digestive)
    const mouthGroup = new THREE.Group();
    const lipMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0x9f1239,
      emissiveIntensity: 0.22,
      roughness: 0.38
    });
    const teethMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x334155,
      emissiveIntensity: 0.1,
      roughness: 0.25
    });
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x881337,
      emissiveIntensity: 0.25,
      roughness: 0.45
    });

    // Outer mouth/lips contour
    const mouthArch = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.0055, 10, 18, Math.PI), lipMat);
    mouthArch.position.set(0, 1.542, 0.095);
    mouthArch.rotation.set(Math.PI * 0.48, 0, Math.PI);
    mouthGroup.add(mouthArch);

    // Upper & Lower Dental Arches (Teeth)
    const upperTeeth = new THREE.Mesh(new THREE.TorusGeometry(0.023, 0.0042, 8, 16, Math.PI), teethMat);
    upperTeeth.position.set(0, 1.546, 0.088);
    upperTeeth.rotation.set(Math.PI * 0.5, 0, Math.PI);
    mouthGroup.add(upperTeeth);

    const lowerTeeth = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 8, 16, Math.PI), teethMat);
    lowerTeeth.position.set(0, 1.536, 0.086);
    lowerTeeth.rotation.set(Math.PI * 0.5, 0, Math.PI);
    mouthGroup.add(lowerTeeth);

    // Tongue
    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 12), tongueMat);
    tongue.position.set(0, 1.538, 0.072);
    tongue.scale.set(0.95, 0.42, 1.45);
    mouthGroup.add(tongue);

    registerOrgan('mouth', 'digestive', mouthGroup, [0, 0.06, 0.28], 0.34);

    // =========================================================================
    // 5. CIRCULATORY SYSTEM (Heart, Major Vessels, Spleen)
    // =========================================================================
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0.022, 1.185, 0.032);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.35,
      roughness: 0.36,
      metalness: 0.1
    });

    const ventricleGeo = new THREE.SphereGeometry(0.052, 24, 20);
    const vPos = ventricleGeo.attributes.position;
    for (let i = 0; i < vPos.count; i++) {
      const x = vPos.getX(i), y = vPos.getY(i), z = vPos.getZ(i);
      const taper = y < 0 ? 1.0 + y * 9.5 : 1.0;
      vPos.setXYZ(i, x * Math.max(0.32, taper) * 0.92, y * 1.25, z * Math.max(0.4, taper) * 0.85);
    }
    ventricleGeo.computeVertexNormals();
    const ventricleMesh = new THREE.Mesh(ventricleGeo, heartMat);
    ventricleMesh.rotation.set(0.12, 0.1, 0.32);
    heartGroup.add(ventricleMesh);

    const leftAtrium = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 14), heartMat);
    leftAtrium.position.set(0.02, 0.042, -0.012);
    heartGroup.add(leftAtrium);

    const rightAtrium = new THREE.Mesh(new THREE.SphereGeometry(0.030, 16, 14), heartMat);
    rightAtrium.position.set(-0.024, 0.038, 0.005);
    heartGroup.add(rightAtrium);

    const arteryMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.28,
      roughness: 0.35
    });
    const veinMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.28,
      roughness: 0.35
    });

    const aortaArchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.03, 0.0),
      new THREE.Vector3(-0.008, 0.088, 0.005),
      new THREE.Vector3(0.025, 0.096, -0.015),
      new THREE.Vector3(0.018, 0.03, -0.038)
    ]);
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(aortaArchCurve, 18, 0.013, 10, false), arteryMat));

    const svc = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.075, 12), veinMat);
    svc.position.set(-0.028, 0.072, -0.004);
    heartGroup.add(svc);
    registerOrgan('heart', 'circulatory', heartGroup, [0.06, 0.08, 0.30], 0.42);

    // Clickable Organ: MAJOR ARTERIES & VEINS
    const vesselsGroup = new THREE.Group();
    const bloodArteryPaths = [];
    const bloodVeinPaths = [];

    [-1, 1].forEach((side) => {
      const aLeg = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.018, 1.24, -0.015),
        new THREE.Vector3(0.01, 1.02, -0.03),
        new THREE.Vector3(side * 0.03, 0.78, -0.02),
        new THREE.Vector3(side * 0.088, 0.52, -0.005),
        new THREE.Vector3(side * 0.082, 0.16, -0.005)
      ]);
      const vLeg = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.072, 0.16, 0.005),
        new THREE.Vector3(side * 0.078, 0.52, 0.005),
        new THREE.Vector3(-0.018 + side * 0.02, 0.78, -0.012),
        new THREE.Vector3(-0.015, 1.04, -0.018),
        new THREE.Vector3(-0.006, 1.22, 0.022)
      ]);
      const aArm = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.018, 1.27, 0.015),
        new THREE.Vector3(side * 0.13, 1.35, 0.01),
        new THREE.Vector3(side * 0.235, 1.18, 0.0),
        new THREE.Vector3(side * 0.27, 0.86, 0.02)
      ]);
      const aCarotid = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.015, 1.28, 0.015),
        new THREE.Vector3(side * 0.024, 1.44, 0.012),
        new THREE.Vector3(side * 0.026, 1.58, 0.0)
      ]);

      vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(aLeg, 24, 0.0068, 8, false), arteryMat));
      vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(vLeg, 24, 0.0068, 8, false), veinMat));
      vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(aArm, 18, 0.0048, 7, false), arteryMat));
      vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(aCarotid, 14, 0.0048, 7, false), arteryMat));

      bloodArteryPaths.push(aLeg, aArm, aCarotid);
      bloodVeinPaths.push(vLeg);
    });
    registerOrgan('aorta_vessels', 'circulatory', vesselsGroup, [0, 0, -0.08], 0.95);

    // Spleen
    const spleenGroup = new THREE.Group();
    spleenGroup.position.set(0.118, 0.99, -0.028);
    const spleenMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      emissive: 0x4c0519,
      emissiveIntensity: 0.25,
      roughness: 0.4
    });
    const spleenMesh = new THREE.Mesh(new THREE.SphereGeometry(0.036, 18, 14), spleenMat);
    spleenMesh.scale.set(0.65, 1.25, 0.95);
    spleenMesh.rotation.set(0.2, 0.3, -0.35);
    spleenGroup.add(spleenMesh);
    registerOrgan('spleen', 'circulatory', spleenGroup, [0.34, 0.04, -0.05], 0.42);

    // =========================================================================
    // 6. RESPIRATORY SYSTEM (Trachea, Lungs, Diaphragm)
    // =========================================================================
    const tracheaGroup = new THREE.Group();
    const tracheaMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.18,
      roughness: 0.45
    });
    const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.16, 14), tracheaMat);
    trachea.position.set(0, 1.38, 0.015);
    tracheaGroup.add(trachea);

    for (let r = 0; r < 7; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0022, 6, 16), tracheaMat);
      ring.position.set(0, 1.315 + r * 0.019, 0.015);
      ring.rotation.x = Math.PI / 2;
      tracheaGroup.add(ring);
    }
    [-1, 1].forEach((side) => {
      const bronchus = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.007, 0.075, 10), tracheaMat);
      bronchus.position.set(side * 0.032, 1.285, 0.013);
      bronchus.rotation.z = side * 0.85;
      tracheaGroup.add(bronchus);
    });
    registerOrgan('trachea', 'respiratory', tracheaGroup, [0, 0.16, 0.16], 0.45);

    const lungsGroup = new THREE.Group();
    lungsGroup.position.set(0, 1.19, 0.005);
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
      roughness: 0.55,
      transparent: true,
      opacity: 0.82
    });

    function buildLung(side) {
      const geo = new THREE.SphereGeometry(0.088, 26, 22);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const topTaper = y > 0 ? 1.0 - y * 4.5 : 1.0 + y * 1.4;
        x *= Math.max(0.35, topTaper) * (side === 1 ? 0.72 : 0.80);
        z *= Math.max(0.45, topTaper) * 0.82;
        y *= 1.48;
        if (y < -0.095) y = -0.095 + (y + 0.095) * 0.25;
        if (side === 1 && x < 0 && y < 0.02) x += 0.024;
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, lungMat);
      mesh.position.set(side * 0.078, 0, 0);
      return mesh;
    }
    lungsGroup.add(buildLung(-1));
    lungsGroup.add(buildLung(1));
    registerOrgan('lungs', 'respiratory', lungsGroup, [0, 0.08, 0.16], 0.58);

    const diaphragmGroup = new THREE.Group();
    diaphragmGroup.position.set(0, 1.055, 0.005);
    const diaphragmMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.28,
      roughness: 0.5,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide
    });
    const domeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.138, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.42),
      diaphragmMat
    );
    domeMesh.scale.set(1.02, 0.36, 0.65);
    domeMesh.position.set(0, -0.028, 0);
    diaphragmGroup.add(domeMesh);
    registerOrgan('diaphragm', 'respiratory', diaphragmGroup, [0, -0.02, 0.22], 0.55);

    // =========================================================================
    // 7. DIGESTIVE SYSTEM (Esophagus, Liver, Gallbladder, Stomach, Pancreas, Intestines)
    // =========================================================================
    const esoGroup = new THREE.Group();
    const esoMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, emissive: 0x9a3412, emissiveIntensity: 0.14, roughness: 0.5 });
    const esophagus = new THREE.Mesh(new THREE.CylinderGeometry(0.0095, 0.0095, 0.36, 10), esoMat);
    esophagus.position.set(0.008, 1.24, -0.015);
    esoGroup.add(esophagus);
    registerOrgan('esophagus', 'digestive', esoGroup, [0.06, 0.12, -0.10], 0.55);

    const liverGroup = new THREE.Group();
    liverGroup.position.set(-0.062, 0.995, 0.028);
    const liverMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      emissive: 0x431407,
      emissiveIntensity: 0.22,
      roughness: 0.38,
      metalness: 0.08
    });
    const liverGeo = new THREE.SphereGeometry(0.068, 24, 18);
    const lPos = liverGeo.attributes.position;
    for (let i = 0; i < lPos.count; i++) {
      let x = lPos.getX(i), y = lPos.getY(i), z = lPos.getZ(i);
      const wedge = x > 0 ? 1.0 - x * 6.5 : 1.0;
      lPos.setXYZ(i, x * 1.38, y * Math.max(0.28, wedge) * 0.82, z * Math.max(0.4, wedge) * 0.82);
    }
    liverGeo.computeVertexNormals();
    const liverMesh = new THREE.Mesh(liverGeo, liverMat);
    liverMesh.rotation.set(0.08, -0.15, 0.16);
    liverGroup.add(liverMesh);
    registerOrgan('liver', 'digestive', liverGroup, [-0.28, 0.02, 0.14], 0.48);

    // Clickable Organ: GALLBLADDER (independent from liver)
    const gbGroup = new THREE.Group();
    gbGroup.position.set(-0.077, 0.953, 0.048);
    const gbMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      emissiveIntensity: 0.35,
      roughness: 0.35
    });
    const gallbladder = new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 12), gbMat);
    gallbladder.scale.set(0.78, 1.28, 0.88);
    gbGroup.add(gallbladder);
    registerOrgan('gallbladder', 'digestive', gbGroup, [-0.24, -0.06, 0.24], 0.38);

    const stomachGroup = new THREE.Group();
    stomachGroup.position.set(0.055, 0.975, 0.028);
    const stomachMat = new THREE.MeshStandardMaterial({
      color: 0xfb923c,
      emissive: 0x9a3412,
      emissiveIntensity: 0.2,
      roughness: 0.42
    });
    const stomachCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.032, 0.065, -0.02),
      new THREE.Vector3(0.022, 0.042, 0.012),
      new THREE.Vector3(0.032, -0.018, 0.02),
      new THREE.Vector3(-0.012, -0.052, 0.008),
      new THREE.Vector3(-0.045, -0.035, -0.008)
    ]);
    stomachGroup.add(new THREE.Mesh(new THREE.TubeGeometry(stomachCurve, 22, 0.027, 14, false), stomachMat));
    const fundus = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 14), stomachMat);
    fundus.position.set(0.018, 0.028, 0.01);
    stomachGroup.add(fundus);
    const bodyStom = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 14), stomachMat);
    bodyStom.position.set(0.016, -0.025, 0.014);
    stomachGroup.add(bodyStom);
    registerOrgan('stomach', 'digestive', stomachGroup, [0.24, 0.02, 0.18], 0.45);

    const pancreasGroup = new THREE.Group();
    pancreasGroup.position.set(0.012, 0.935, -0.015);
    const pancreasMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0x854d0e,
      emissiveIntensity: 0.28,
      roughness: 0.5
    });
    const pancCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.042, -0.012, 0.005),
      new THREE.Vector3(0.0, 0.004, 0.01),
      new THREE.Vector3(0.055, 0.018, -0.005),
      new THREE.Vector3(0.088, 0.025, -0.018)
    ]);
    pancreasGroup.add(new THREE.Mesh(new THREE.TubeGeometry(pancCurve, 18, 0.015, 10, false), pancreasMat));
    registerOrgan('pancreas', 'digestive', pancreasGroup, [0.06, -0.05, -0.18], 0.42);

    const smallIntGroup = new THREE.Group();
    smallIntGroup.position.set(0, 0.81, 0.022);
    const smallIntMat = new THREE.MeshStandardMaterial({
      color: 0xfda4af,
      emissive: 0x9f1239,
      emissiveIntensity: 0.18,
      roughness: 0.48
    });
    const siPts = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      siPts.push(
        new THREE.Vector3(
          Math.sin(t * Math.PI * 10) * (0.068 - Math.abs(t - 0.5) * 0.025),
          0.068 - t * 0.135,
          Math.cos(t * Math.PI * 20) * 0.016 + 0.008
        )
      );
    }
    smallIntGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(siPts), 85, 0.0135, 10, false), smallIntMat));
    registerOrgan('small_intestine', 'digestive', smallIntGroup, [0, -0.08, 0.24], 0.50);

    const largeIntGroup = new THREE.Group();
    largeIntGroup.position.set(0, 0.82, 0.015);
    const largeIntMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
      roughness: 0.52
    });
    const colonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.095, -0.085, 0.005),
      new THREE.Vector3(-0.102, 0.0, 0.002),
      new THREE.Vector3(-0.092, 0.088, 0.012),
      new THREE.Vector3(0.0, 0.082, 0.024),
      new THREE.Vector3(0.092, 0.092, 0.008),
      new THREE.Vector3(0.102, 0.0, -0.002),
      new THREE.Vector3(0.085, -0.082, 0.0),
      new THREE.Vector3(0.025, -0.105, -0.012),
      new THREE.Vector3(0.0, -0.135, -0.018)
    ]);
    largeIntGroup.add(new THREE.Mesh(new THREE.TubeGeometry(colonCurve, 48, 0.021, 12, false), largeIntMat));
    registerOrgan('large_intestine', 'digestive', largeIntGroup, [0, -0.14, 0.10], 0.55);

    // =========================================================================
    // 8. URINARY SYSTEM (Kidneys, Ureters, Bladder)
    // =========================================================================
    const kidneysGroup = new THREE.Group();
    kidneysGroup.position.set(0, 0.925, -0.042);
    const kidneyMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      emissive: 0x854d0e,
      emissiveIntensity: 0.25,
      roughness: 0.38
    });

    [-1, 1].forEach((side) => {
      const kGeo = new THREE.SphereGeometry(0.028, 18, 14);
      kGeo.scale(0.75, 1.38, 0.65);
      const kMesh = new THREE.Mesh(kGeo, kidneyMat);
      const yOff = side === -1 ? -0.018 : 0.008;
      kMesh.position.set(side * 0.072, yOff, 0);
      kMesh.rotation.z = -side * 0.18;
      kidneysGroup.add(kMesh);

      const ureterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.058, yOff - 0.01, 0.005),
        new THREE.Vector3(side * 0.045, -0.12, 0.022),
        new THREE.Vector3(side * 0.022, -0.225, 0.065)
      ]);
      const ureterMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
      kidneysGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ureterCurve, 14, 0.0032, 6, false), ureterMat));
    });
    registerOrgan('kidneys', 'urinary', kidneysGroup, [0, 0, -0.26], 0.50);

    const bladderGroup = new THREE.Group();
    bladderGroup.position.set(0, 0.685, 0.032);
    const bladderMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xa16207,
      emissiveIntensity: 0.28,
      roughness: 0.42
    });
    const bladderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.032, 18, 14), bladderMat);
    bladderMesh.scale.set(1.05, 0.88, 0.88);
    bladderGroup.add(bladderMesh);
    registerOrgan('bladder', 'urinary', bladderGroup, [0, -0.24, 0.16], 0.42);

    // =========================================================================
    // 8B. ENDOCRINE SYSTEM (Pituitary, Thyroid, Adrenals)
    // =========================================================================
    const endoMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x0f766e,
      emissiveIntensity: 0.38,
      roughness: 0.36
    });

    // Pituitary Gland
    const pituitaryGroup = new THREE.Group();
    pituitaryGroup.position.set(0, 1.585, 0.012);
    pituitaryGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.011, 14, 12), endoMat));
    registerOrgan('pituitary', 'endocrine', pituitaryGroup, [0, 0.24, 0.16], 0.34);

    // Thyroid Gland (butterfly-shaped around lower trachea)
    const thyroidGroup = new THREE.Group();
    thyroidGroup.position.set(0, 1.405, 0.028);
    [-1, 1].forEach((side) => {
      const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 12), endoMat);
      lobe.position.set(side * 0.016, 0, -0.002);
      lobe.scale.set(0.75, 1.45, 0.72);
      lobe.rotation.z = -side * 0.18;
      thyroidGroup.add(lobe);
    });
    const isthmus = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.008), endoMat);
    isthmus.position.set(0, -0.004, 0.004);
    thyroidGroup.add(isthmus);
    registerOrgan('thyroid', 'endocrine', thyroidGroup, [0, 0.14, 0.24], 0.38);

    // Adrenal Glands (triangular caps perched atop both kidneys)
    const adrenalsGroup = new THREE.Group();
    adrenalsGroup.position.set(0, 0.968, -0.042);
    const adrenalMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x115e59,
      emissiveIntensity: 0.35,
      roughness: 0.4
    });
    [-1, 1].forEach((side) => {
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.024, 4), adrenalMat);
      cap.position.set(side * 0.070, side === -1 ? -0.014 : 0.012, 0);
      cap.scale.set(1.0, 0.85, 0.65);
      adrenalsGroup.add(cap);
    });
    registerOrgan('adrenals', 'endocrine', adrenalsGroup, [0, 0.06, -0.26], 0.46);

    // =========================================================================
    // 8C. LYMPHATIC & IMMUNE SYSTEM (Thymus, Lymph Nodes & Vessels)
    // =========================================================================
    const lymphMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.35,
      roughness: 0.4
    });

    // Thymus Gland (behind upper sternum, above heart)
    const thymusGroup = new THREE.Group();
    thymusGroup.position.set(0, 1.275, 0.056);
    [-1, 1].forEach((side) => {
      const tLobe = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 12), lymphMat);
      tLobe.position.set(side * 0.014, 0, 0);
      tLobe.scale.set(0.85, 1.45, 0.55);
      thymusGroup.add(tLobe);
    });
    registerOrgan('thymus', 'lymphatic', thymusGroup, [0, 0.10, 0.28], 0.40);

    // Lymph Nodes & Vessels (cervical, axillary, thoracic, inguinal clusters)
    const lymphNodesGroup = new THREE.Group();
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x166534,
      emissiveIntensity: 0.42,
      roughness: 0.35
    });
    const nodePositions = [
      // Neck (cervical)
      [-0.042, 1.45, 0.012], [0.042, 1.45, 0.012],
      [-0.046, 1.41, 0.010], [0.046, 1.41, 0.010],
      // Armpits (axillary)
      [-0.175, 1.27, 0.008], [0.175, 1.27, 0.008],
      [-0.165, 1.23, 0.012], [0.165, 1.23, 0.012],
      // Groin (inguinal)
      [-0.082, 0.69, 0.055], [0.082, 0.69, 0.055],
      [-0.070, 0.66, 0.058], [0.070, 0.66, 0.058]
    ];
    nodePositions.forEach((p) => {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.0105, 10, 8), nodeMat);
      n.position.set(p[0], p[1], p[2]);
      n.scale.set(0.85, 1.25, 0.85);
      lymphNodesGroup.add(n);
    });
    [-1, 1].forEach((side) => {
      const lVessel = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.044, 1.45, 0.01),
        new THREE.Vector3(side * 0.11, 1.32, 0.01),
        new THREE.Vector3(side * 0.17, 1.25, 0.01),
        new THREE.Vector3(side * 0.09, 0.98, 0.02),
        new THREE.Vector3(side * 0.076, 0.68, 0.055)
      ]);
      lymphNodesGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lVessel, 20, 0.0028, 6, false), lymphMat));
    });
    registerOrgan('lymph_nodes', 'lymphatic', lymphNodesGroup, [0, 0, 0.18], 0.85);

    // =========================================================================
    // 8D. REPRODUCTIVE SYSTEM (Dynamically switches between Male & Female)
    // =========================================================================
    const reproMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0x9d174d,
      emissiveIntensity: 0.32,
      roughness: 0.4
    });
    const reproAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xbe185d,
      emissiveIntensity: 0.35,
      roughness: 0.38
    });

    // FEMALE: Uterus & Fallopian Tubes
    const uterusGroup = new THREE.Group();
    uterusGroup.position.set(0, 0.71, -0.006);
    const uterusBody = new THREE.Mesh(new THREE.SphereGeometry(0.028, 18, 14), reproMat);
    uterusBody.scale.set(0.95, 1.32, 0.75);
    uterusGroup.add(uterusBody);

    [-1, 1].forEach((side) => {
      const tubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.018, 0.022, 0),
        new THREE.Vector3(side * 0.052, 0.032, -0.004),
        new THREE.Vector3(side * 0.072, 0.012, -0.008)
      ]);
      uterusGroup.add(new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 12, 0.0045, 7, false), reproMat));
    });
    registerOrgan('uterus', 'reproductive', uterusGroup, [0, -0.18, 0.22], 0.42);

    // FEMALE: Ovaries
    const ovariesGroup = new THREE.Group();
    ovariesGroup.position.set(0, 0.715, -0.012);
    [-1, 1].forEach((side) => {
      const ov = new THREE.Mesh(new THREE.SphereGeometry(0.015, 14, 12), reproAccentMat);
      ov.position.set(side * 0.072, 0, 0);
      ov.scale.set(1.25, 0.85, 0.85);
      ovariesGroup.add(ov);
    });
    registerOrgan('ovaries', 'reproductive', ovariesGroup, [0, -0.14, 0.28], 0.42);

    // MALE: Prostate & Vas Deferens
    const prostateGroup = new THREE.Group();
    prostateGroup.position.set(0, 0.650, 0.026);
    const prostMesh = new THREE.Mesh(new THREE.SphereGeometry(0.021, 16, 12), reproMat);
    prostMesh.scale.set(1.12, 0.88, 0.92);
    prostateGroup.add(prostMesh);
    [-1, 1].forEach((side) => {
      const vasCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.018, -0.055, 0.016),
        new THREE.Vector3(side * 0.042, 0.035, 0.015),
        new THREE.Vector3(side * 0.018, 0.018, -0.012),
        new THREE.Vector3(side * 0.008, 0.0, -0.005)
      ]);
      prostateGroup.add(new THREE.Mesh(new THREE.TubeGeometry(vasCurve, 14, 0.0035, 6, false), reproAccentMat));
    });
    registerOrgan('prostate', 'reproductive', prostateGroup, [0, -0.22, 0.22], 0.40);

    // MALE: Testes
    const testesGroup = new THREE.Group();
    testesGroup.position.set(0, 0.592, 0.042);
    [-1, 1].forEach((side) => {
      const tst = new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 12), reproAccentMat);
      tst.position.set(side * 0.020, side === 1 ? -0.004 : 0, 0);
      tst.scale.set(0.85, 1.25, 0.92);
      testesGroup.add(tst);
    });
    registerOrgan('testes', 'reproductive', testesGroup, [0, -0.28, 0.24], 0.40);

    // Default sex = 'male' (hide female reproductive organs initially)
    uterusGroup.visible = false;
    ovariesGroup.visible = false;

    // =========================================================================
    // 8E. INTEGUMENTARY SYSTEM (Clickable Outer Skin Coat)
    // =========================================================================
    const skinCoatGroup = new THREE.Group();
    const skinCoatMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0x9d174d,
      emissiveIntensity: 0.16,
      roughness: 0.55,
      transparent: true,
      opacity: 0.34,
      depthWrite: false
    });
    const coatTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.72, 24),
      skinCoatMat
    );
    coatTorso.position.set(0, 1.03, 0);
    coatTorso.scale.set(1.06, 1.0, 0.68);
    skinCoatGroup.add(coatTorso);
    registerOrgan('skin', 'integumentary', skinCoatGroup, [0, 0, 0.38], 1.15);

    // =========================================================================
    // 9. ANIMATED FLOW PARTICLES (Blood Cells & Neural Sparks)
    // =========================================================================
    const flowGroup = new THREE.Group();
    flowGroup.name = 'FlowParticles';
    root.add(flowGroup);

    const bloodParticles = [];
    const redCellGeo = new THREE.SphereGeometry(0.0065, 8, 6);
    const redCellMat = new THREE.MeshBasicMaterial({ color: 0xff4d6d });
    const blueCellMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

    bloodArteryPaths.forEach((curve) => {
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(redCellGeo, redCellMat);
        flowGroup.add(m);
        bloodParticles.push({ mesh: m, curve, t: i / 6, speed: 0.24 + Math.random() * 0.08, type: 'artery' });
      }
    });
    bloodVeinPaths.forEach((curve) => {
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(redCellGeo, blueCellMat);
        flowGroup.add(m);
        bloodParticles.push({ mesh: m, curve, t: i / 6, speed: 0.20 + Math.random() * 0.06, type: 'vein' });
      }
    });

    const nerveParticles = [];
    const sparkGeo = new THREE.SphereGeometry(0.006, 8, 6);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xe879f9 });
    nervePaths.forEach((curve) => {
      for (let i = 0; i < 4; i++) {
        const m = new THREE.Mesh(sparkGeo, sparkMat);
        flowGroup.add(m);
        nerveParticles.push({ mesh: m, curve, t: i / 4, speed: 0.48 + Math.random() * 0.15 });
      }
    });

    // =========================================================================
    // 10. MRI / CT CROSS-SECTION CLIPPING PLANE & SCANNER RING
    // =========================================================================
    const mriPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.1);
    root.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.material.clippingPlanes = [mriPlane];
        obj.material.clipShadows = true;
      }
    });

    const mriRingGroup = new THREE.Group();
    const mriRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.24, 0.258, 64),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78
      })
    );
    mriRingMesh.rotation.x = -Math.PI / 2;
    mriRingGroup.add(mriRingMesh);
    const mriDiskMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.24, 64),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.11,
        depthWrite: false
      })
    );
    mriDiskMesh.rotation.x = -Math.PI / 2;
    mriRingGroup.add(mriDiskMesh);
    mriRingGroup.visible = false;
    root.add(mriRingGroup);

    return {
      root,
      bodyShellGroup,
      systemGroups,
      organs,
      clickableMeshes,
      materials: { skinMat, muscleMat, boneMat },
      flowGroup,
      bloodParticles,
      nerveParticles,
      setExplode(amount) {
        Object.values(organs).forEach((org) => {
          org.group.position.copy(org.basePos).addScaledVector(org.explodeOffset, amount);
        });
      },
      setSkinOpacity(val) {
        skinMat.opacity = val;
        bodyShellGroup.visible = val > 0.01;
      },
      setSex(sex) {
        const isFemale = sex === 'female';
        maleShellGroup.visible = !isFemale;
        femaleShellGroup.visible = isFemale;
        pelvisGroup.scale.set(isFemale ? 1.12 : 1.0, 1.0, 1.0);
        uterusGroup.visible = isFemale;
        ovariesGroup.visible = isFemale;
        prostateGroup.visible = !isFemale;
        testesGroup.visible = !isFemale;
      },
      setMriSlice(percent) {
        // percent: 1.0 = full body visible, 0.0 = sliced down to feet
        if (percent >= 0.99) {
          mriPlane.constant = 2.5;
          mriRingGroup.visible = false;
        } else {
          const y = -0.10 + percent * 1.88;
          mriPlane.constant = y;
          mriRingGroup.position.y = y;
          mriRingGroup.visible = true;
        }
      },
      setPathology(affectedOrganIds, tintHex) {
        const affected = new Set(affectedOrganIds || []);
        Object.values(organs).forEach((org) => {
          const isAffected = affected.has(org.id) && tintHex !== null && tintHex !== undefined;
          org.meshes.forEach((m) => {
            if (!m.material || !m.userData.baseColor) return;
            if (isAffected) {
              m.material.color.setHex(tintHex);
              m.userData.pathologyTint = tintHex;
            } else {
              m.material.color.copy(m.userData.baseColor);
              m.userData.pathologyTint = null;
            }
          });
        });
      },
      setXRayMode(enabled) {
        if (enabled) {
          skinMat.color.setHex(0x22d3ee);
          skinMat.emissive.setHex(0x06b6d4);
          skinMat.emissiveIntensity = 0.65;
          skinMat.wireframe = true;
          boneMat.emissive.setHex(0x38bdf8);
          boneMat.emissiveIntensity = 0.35;
        } else {
          skinMat.color.setHex(0x38bdf8);
          skinMat.emissive.setHex(0x0c4a6e);
          skinMat.emissiveIntensity = 0.22;
          skinMat.wireframe = false;
          boneMat.emissive.setHex(0x1e293b);
          boneMat.emissiveIntensity = 0.08;
        }
      },
      getOrganWorldCenter(organId) {
        const org = organs[organId];
        if (!org) return new THREE.Vector3(0, 1.0, 0);
        const box = new THREE.Box3().setFromObject(org.group);
        const center = new THREE.Vector3();
        box.getCenter(center);
        return center;
      }
    };
  }

  global.AnatomaBuilder = { buildHumanBody };
})(window);
