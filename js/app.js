/**
 * Anatoma 3D — Main Interactive Controller (Modern App + Full EN/HE Bilingual RTL)
 */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const I18n = global.AnatomaI18n;
    I18n.applyDocumentDirection();

    if (typeof THREE === 'undefined') {
      const mount = document.getElementById('viewport');
      if (mount) {
        mount.innerHTML =
          '<div class="fallback-error"><h2>3D Engine Could Not Load</h2><p>Three.js CDN could not be reached. Please check your internet connection and reload.</p></div>';
      }
      return;
    }

    const viewport = document.getElementById('viewport');
    const labelsSvg = document.getElementById('labels-svg');
    const labelsLayer = document.getElementById('labels-layer');
    const hoverTooltip = document.getElementById('hover-tooltip');

    // =========================================================================
    // 1. THREE.JS SCENE, CAMERA, RENDERER, LIGHTING & ORBIT CONTROLS
    // =========================================================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070c17, 0.12);

    const camera = new THREE.PerspectiveCamera(
      38,
      viewport.clientWidth / viewport.clientHeight,
      0.05,
      30
    );
    // Perfect front full-body framing (head to toe, comfortably zoomed between top toolbar & bottom vitals dock)
    const defaultCamTarget = new THREE.Vector3(0, 0.78, 0);
    function getFullBodyCamPos() {
      const aspect = Math.max(0.5, viewport.clientWidth / Math.max(1, viewport.clientHeight));
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      // Fit full body height (~1.86m) with comfortable padding for top toolbar + bottom ECG dock
      const distForHeight = 2.18 / (2 * Math.tan(vFovRad / 2));
      // Also ensure arms width (~0.75m) fits comfortably on narrower screens
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);
      const distForWidth = 0.95 / (2 * Math.tan(hFovRad / 2));
      const z = Math.max(distForHeight, distForWidth);
      return new THREE.Vector3(0, 0.80, z);
    }
    const defaultCamPos = getFullBodyCamPos();
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.localClippingEnabled = true;
    viewport.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.copy(defaultCamTarget);
    controls.minDistance = 0.35;
    controls.maxDistance = 4.2;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.9;

    // Clean modern studio lighting
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2.5, 3.2, 2.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-2.5, 2.0, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf43f5e, 0.38, 5);
    fillLight.position.set(0.6, 1.0, 1.4);
    scene.add(fillLight);

    // Minimalist modern studio pedestal
    const pedestalGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.42, 0.445, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.42
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.14;
    pedestalGroup.add(ringMesh);

    const innerDisk = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 72),
      new THREE.MeshBasicMaterial({
        color: 0x0c4a6e,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide
      })
    );
    innerDisk.rotation.x = -Math.PI / 2;
    innerDisk.position.y = -0.142;
    pedestalGroup.add(innerDisk);

    let grid = new THREE.GridHelper(4.5, 24, 0x1e3a5f, 0x0d1b32);
    grid.position.y = -0.145;
    pedestalGroup.add(grid);
    scene.add(pedestalGroup);

    // =========================================================================
    // 2. BUILD 3D HUMAN BODY & PHYSIOLOGY SIMULATION
    // =========================================================================
    const body = global.AnatomaBuilder.buildHumanBody(THREE);
    scene.add(body.root);

    const sim = new global.PhysiologySimulation(body, document.getElementById('ecg-canvas'));
    const audio = new global.AnatomaAudio();
    sim.onHeartbeat = () => audio.playHeartbeat();

    // App State
    let selectedOrganId = 'heart';
    let encyclopediaView = { type: 'organ', id: 'heart' }; // 'organ' | 'system'
    let hoveredOrganId = null;
    let showLabels = false;
    let camAnim = null;

    // =========================================================================
    // 3. SMOOTH CAMERA FOCUS & ORGAN HIGHLIGHTING
    // =========================================================================
    function animateCameraTo(pos, lookAt) {
      camAnim = {
        startPos: camera.position.clone(),
        startLook: controls.target.clone(),
        endPos: pos.clone(),
        endLook: lookAt.clone(),
        t: 0
      };
    }

    function focusOrgan(organId) {
      const org = body.organs[organId];
      if (!org) return;
      const center = body.getOrganWorldCenter(organId);
      const backOrgans = new Set(['spine', 'spinal_cord', 'kidneys', 'latissimus', 'glutes', 'calves']);
      const isBack = backOrgans.has(organId);
      const offset = new THREE.Vector3(isBack ? 0.14 : 0.10, 0.06, isBack ? -org.focusDist : org.focusDist);
      animateCameraTo(center.clone().add(offset), center);
    }

    function resetCamera() {
      animateCameraTo(getFullBodyCamPos(), defaultCamTarget);
    }

    function updateOrganHighlights(pulseTime) {
      const pulse = 0.5 + 0.5 * Math.sin(pulseTime * 5.0);
      Object.values(body.organs).forEach((org) => {
        const isSelected = org.id === selectedOrganId && game.mode === 'explore';
        const isHovered = org.id === hoveredOrganId;
        org.meshes.forEach((m) => {
          if (!m.material || !m.material.emissive) return;
          if (isSelected) {
            m.material.emissive.setHex(0x38bdf8);
            m.material.emissiveIntensity = 0.42 + pulse * 0.28;
          } else if (isHovered) {
            m.material.emissive.setHex(0xfef08a);
            m.material.emissiveIntensity = 0.45;
          } else {
            m.material.emissive.copy(m.userData.baseEmissive);
            m.material.emissiveIntensity = m.userData.baseEmissiveIntensity;
          }
        });
      });
    }

    // =========================================================================
    // 4. GAME ENGINE
    // =========================================================================
    const game = new global.AnatomaGame({
      onUIUpdate: () => {
        renderGamePanel();
        updateHeaderStats();
      },
      onPresetChange: (presetId) => {
        setSimPreset(presetId);
      },
      onFocusOrgan: (organId) => {
        selectedOrganId = organId;
        focusOrgan(organId);
      },
      onHighlightSystem: (systemId) => {
        setSystemVisible(systemId, true);
        const btn = document.querySelector(`.sys-group[data-system="${systemId}"] .sys-toggle`);
        if (btn) {
          btn.classList.add('hint-pulse');
          setTimeout(() => btn.classList.remove('hint-pulse'), 2500);
        }
      }
    });

    // =========================================================================
    // 5. RAYCASTING (HOVER & CLICK DETECTION)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    function getVisibleClickableMeshes() {
      return body.clickableMeshes.filter((m) => {
        let obj = m;
        while (obj) {
          if (!obj.visible) return false;
          obj = obj.parent;
        }
        return true;
      });
    }

    function pickOrgan(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getVisibleClickableMeshes(), false);
      if (hits.length > 0) {
        return hits[0].object.userData.organId || null;
      }
      return null;
    }

    renderer.domElement.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      camAnim = null;
    });

    renderer.domElement.addEventListener('pointermove', (e) => {
      const hitId = pickOrgan(e.clientX, e.clientY);
      hoveredOrganId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';

      if (hitId) {
        const org = I18n.getOrgan(hitId);
        const sys = I18n.getSystem(org.system);
        const hideName =
          (game.mode === 'locate' && !game.locateAnswered) ||
          (game.mode === 'doctor' && game.doctorStage === 'find');

        hoverTooltip.innerHTML = hideName
          ? `<span class="tt-dot" style="background:${sys.color}"></span><strong>${I18n.t('inspectOrgan')}</strong><span class="tt-sub">${I18n.t('clickToSelect')}</span>`
          : `<span class="tt-dot" style="background:${sys.color}"></span><strong>${org.name}</strong><span class="tt-sub">${sys.shortName}</span>`;
        const rect = viewport.getBoundingClientRect();
        hoverTooltip.style.left = `${e.clientX - rect.left + 14}px`;
        hoverTooltip.style.top = `${e.clientY - rect.top - 10}px`;
        hoverTooltip.classList.add('visible');
      } else {
        hoverTooltip.classList.remove('visible');
      }
    });

    renderer.domElement.addEventListener('pointerleave', () => {
      hoveredOrganId = null;
      hoverTooltip.classList.remove('visible');
    });

    renderer.domElement.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      const hitId = pickOrgan(e.clientX, e.clientY);
      if (!hitId) return;

      if (game.mode === 'explore') {
        selectOrganInEncyclopedia(hitId, true);
      } else {
        game.handleOrganClick(hitId);
      }
    });

    // =========================================================================
    // 6. OUTER-MARGIN CALLOUT LABELS WITH SVG LEADER LINES (NO BODY OVERLAP!)
    // =========================================================================
    const labelEls = {};
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const leaderSvgEls = {}; // id -> { line, dot }

    function shortLabelName(name) {
      // Keep floating callout labels crisp & readable (strip long parentheticals)
      return name.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    }

    function buildFloatingLabels() {
      labelsLayer.innerHTML = '';
      labelsSvg.innerHTML = '';

      I18n.getAllOrgans().forEach((org) => {
        const sys = I18n.getSystem(org.system);
        const el = document.createElement('button');
        el.className = 'organ-pin';
        el.innerHTML = `<span class="pin-dot" style="background:${sys.color}"></span><span class="pin-text">${shortLabelName(org.name)}</span>`;
        el.title = org.name;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (game.mode === 'explore') {
            selectOrganInEncyclopedia(org.id, true);
          }
        });
        el.addEventListener('pointerenter', () => {
          hoveredOrganId = org.id;
        });
        el.addEventListener('pointerleave', () => {
          if (hoveredOrganId === org.id) hoveredOrganId = null;
        });
        labelsLayer.appendChild(el);
        labelEls[org.id] = el;

        // Create SVG leader polyline + organ anchor dot
        const line = document.createElementNS(SVG_NS, 'polyline');
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', sys.color);
        line.setAttribute('class', 'leader-line');
        labelsSvg.appendChild(line);

        const dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('r', '3.2');
        dot.setAttribute('fill', sys.color);
        dot.setAttribute('class', 'leader-dot');
        labelsSvg.appendChild(dot);

        leaderSvgEls[org.id] = { line, dot };
      });
    }

    const projVec = new THREE.Vector3();
    const bodyCenterProj = new THREE.Vector3();

    function distributeColumnY(items, minY, maxY) {
      if (!items.length) return;
      items.sort((a, b) => a.ay - b.ay);
      const count = items.length;
      const available = Math.max(40, maxY - minY);
      const gap = Math.min(27, available / Math.max(1, count));

      // Initialize desired Y clamped inside safe vertical band
      items.forEach((it) => {
        it.ly = Math.max(minY, Math.min(maxY, it.ay));
      });

      // Forward pass: push overlapping labels downward
      for (let i = 1; i < count; i++) {
        if (items[i].ly - items[i - 1].ly < gap) {
          items[i].ly = items[i - 1].ly + gap;
        }
      }

      // If bottom overflows, pull upward cleanly
      const overflow = items[count - 1].ly - maxY;
      if (overflow > 0) {
        items[count - 1].ly = maxY;
        for (let i = count - 2; i >= 0; i--) {
          if (items[i + 1].ly - items[i].ly < gap) {
            items[i].ly = items[i + 1].ly - gap;
          }
        }
      }
      // Final clamp to top bound
      if (items[0].ly < minY) {
        items[0].ly = minY;
        for (let i = 1; i < count; i++) {
          if (items[i].ly - items[i - 1].ly < gap) {
            items[i].ly = items[i - 1].ly + gap;
          }
        }
      }
    }

    function updateFloatingLabels() {
      const hideForGame =
        (game.mode === 'locate' && !game.locateAnswered) ||
        (game.mode === 'doctor' && game.doctorStage === 'find');

      const visible = showLabels && !hideForGame;
      labelsLayer.style.display = visible ? 'block' : 'none';
      labelsSvg.style.display = visible ? 'block' : 'none';
      if (!visible) return;

      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      labelsSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      // Project body's center X to divide left/right callout columns cleanly
      bodyCenterProj.set(0, 0.85, 0).project(camera);
      const bodyCenterX = (bodyCenterProj.x * 0.5 + 0.5) * w;

      const leftItems = [];
      const rightItems = [];
      let centerToggle = 0;

      Object.values(body.organs).forEach((org) => {
        const el = labelEls[org.id];
        const svgObj = leaderSvgEls[org.id];
        if (!el || !svgObj) return;

        const sysVisible = body.systemGroups[org.system].visible && org.group.visible;
        if (!sysVisible) {
          el.style.display = 'none';
          svgObj.line.style.display = 'none';
          svgObj.dot.style.display = 'none';
          return;
        }

        const center = body.getOrganWorldCenter(org.id);
        projVec.copy(center).project(camera);
        if (projVec.z > 1 || projVec.z < -1) {
          el.style.display = 'none';
          svgObj.line.style.display = 'none';
          svgObj.dot.style.display = 'none';
          return;
        }

        const ax = (projVec.x * 0.5 + 0.5) * w;
        const ay = (-projVec.y * 0.5 + 0.5) * h;

        if (ax < -20 || ax > w + 20 || ay < -20 || ay > h + 20) {
          el.style.display = 'none';
          svgObj.line.style.display = 'none';
          svgObj.dot.style.display = 'none';
          return;
        }

        const item = { id: org.id, ax, ay, ly: ay, el, svgObj };
        if (Math.abs(ax - bodyCenterX) < 10) {
          // Alternate centerline organs left/right so both margins stay balanced
          if (centerToggle % 2 === 0) leftItems.push(item);
          else rightItems.push(item);
          centerToggle += 1;
        } else if (ax < bodyCenterX) {
          leftItems.push(item);
        } else {
          rightItems.push(item);
        }
      });

      const topSafeY = 64;
      const bottomSafeY = h - 142;
      distributeColumnY(leftItems, topSafeY, bottomSafeY);
      distributeColumnY(rightItems, topSafeY, bottomSafeY);

      // Outer column anchor edges (well outside the 3D body!)
      const halfSpread = Math.min(w * 0.34, Math.max(150, w * 0.28));
      const leftInnerEdgeX = Math.max(125, Math.min(w * 0.32, bodyCenterX - halfSpread));
      const rightInnerEdgeX = Math.min(w - 125, Math.max(w * 0.68, bodyCenterX + halfSpread));

      function placeColumn(items, isLeft) {
        items.forEach((it) => {
          const isHighlight = it.id === selectedOrganId || it.id === hoveredOrganId;
          it.el.style.display = 'flex';
          it.el.classList.toggle('active', it.id === selectedOrganId);
          it.el.classList.toggle('hovered', it.id === hoveredOrganId);
          it.el.classList.toggle('pin-left', isLeft);
          it.el.classList.toggle('pin-right', !isLeft);

          const lx = isLeft ? leftInnerEdgeX : rightInnerEdgeX;
          it.el.style.transform = isLeft
            ? `translate(-100%, -50%) translate(${lx.toFixed(1)}px, ${it.ly.toFixed(1)}px)`
            : `translate(0%, -50%) translate(${lx.toFixed(1)}px, ${it.ly.toFixed(1)}px)`;

          // Sleek elbow leader line from label edge -> elbow -> organ anchor dot
          const elbowX = isLeft ? lx + 14 : lx - 14;
          it.svgObj.line.style.display = 'block';
          it.svgObj.dot.style.display = 'block';
          it.svgObj.line.setAttribute(
            'points',
            `${lx.toFixed(1)},${it.ly.toFixed(1)} ${elbowX.toFixed(1)},${it.ly.toFixed(1)} ${it.ax.toFixed(1)},${it.ay.toFixed(1)}`
          );
          it.svgObj.line.classList.toggle('active', isHighlight);
          it.svgObj.dot.setAttribute('cx', it.ax.toFixed(1));
          it.svgObj.dot.setAttribute('cy', it.ay.toFixed(1));
          it.svgObj.dot.setAttribute('r', isHighlight ? '4.5' : '2.8');
          it.svgObj.dot.classList.toggle('active', isHighlight);
        });
      }

      placeColumn(leftItems, true);
      placeColumn(rightItems, false);
    }

    // =========================================================================
    // 7. LEFT SIDEBAR: EXPANDABLE BODY SYSTEMS ACCORDION & PHYSIOLOGY PRESETS
    // =========================================================================
    const systemsListEl = document.getElementById('systems-list');
    const expandedSystems = new Set();

    function setSystemVisible(sysId, isVisible) {
      if (!body.systemGroups[sysId]) return;
      body.systemGroups[sysId].visible = isVisible;
      const btn = systemsListEl.querySelector(`.sys-eye-btn[data-system="${sysId}"]`);
      const grp = systemsListEl.querySelector(`.sys-group[data-system="${sysId}"]`);
      if (btn) {
        btn.classList.toggle('active', isVisible);
        btn.textContent = isVisible ? I18n.t('on') : I18n.t('off');
      }
      if (grp) {
        grp.classList.toggle('sys-on', isVisible);
      }
    }

    function renderSystemsList() {
      systemsListEl.innerHTML = '';
      I18n.getAllSystems().forEach((sys) => {
        const isVis = body.systemGroups[sys.id].visible;
        const isOpen = expandedSystems.has(sys.id);
        const childOrgans = (sys.keyOrgans || []).map((oid) => I18n.getOrgan(oid)).filter(Boolean);

        const groupEl = document.createElement('div');
        groupEl.className = `sys-group ${isVis ? 'sys-on' : ''} ${isOpen ? 'open' : ''}`;
        groupEl.dataset.system = sys.id;

        const childrenHtml = childOrgans
          .map((o) => {
            const activeCls = o.id === selectedOrganId ? 'active' : '';
            const foundMark = game.discovered.has(o.id) ? '<span class="child-found">✓</span>' : '';
            return `
              <button class="sys-child-btn ${activeCls}" data-child-organ="${o.id}">
                <span class="child-dot" style="background:${sys.color}"></span>
                <span class="child-name">${o.name}</span>
                ${foundMark}
              </button>
            `;
          })
          .join('');

        groupEl.innerHTML = `
          <div class="sys-row">
            <button class="sys-toggle" data-expand="${sys.id}" aria-expanded="${isOpen}">
              <span class="sys-chevron">${isOpen ? '▾' : '▸'}</span>
              <span class="sys-color" style="background:${sys.color}"></span>
              <span class="sys-icon">${sys.icon}</span>
              <span class="sys-name">${sys.shortName}</span>
              <span class="sys-count">${childOrgans.length}</span>
            </button>
            <button class="sys-eye-btn ${isVis ? 'active' : ''}" data-system="${sys.id}" title="Toggle 3D layer">
              ${isVis ? I18n.t('on') : I18n.t('off')}
            </button>
            <button class="sys-info-btn" data-system="${sys.id}" title="${sys.name}">?</button>
          </div>
          <div class="sys-children">${childrenHtml}</div>
        `;
        systemsListEl.appendChild(groupEl);
      });
    }

    systemsListEl.addEventListener('click', (e) => {
      const expandBtn = e.target.closest('[data-expand]');
      if (expandBtn) {
        const sysId = expandBtn.dataset.expand;
        if (expandedSystems.has(sysId)) expandedSystems.delete(sysId);
        else expandedSystems.add(sysId);
        renderSystemsList();
        return;
      }
      const eyeBtn = e.target.closest('.sys-eye-btn');
      if (eyeBtn) {
        const sysId = eyeBtn.dataset.system;
        setSystemVisible(sysId, !body.systemGroups[sysId].visible);
        return;
      }
      const infoBtn = e.target.closest('.sys-info-btn');
      if (infoBtn) {
        showSystemInEncyclopedia(infoBtn.dataset.system);
        return;
      }
      const childBtn = e.target.closest('[data-child-organ]');
      if (childBtn) {
        const orgId = childBtn.dataset.childOrgan;
        if (game.mode !== 'explore') switchMode('explore');
        selectOrganInEncyclopedia(orgId, true);
        renderSystemsList();
      }
    });

    document.getElementById('btn-show-all-sys').addEventListener('click', () => {
      I18n.getAllSystems().forEach((s) => setSystemVisible(s.id, true));
    });

    document.getElementById('btn-organs-only').addEventListener('click', () => {
      I18n.getAllSystems().forEach((s) => {
        setSystemVisible(s.id, s.id !== 'muscular' && s.id !== 'skeletal' && s.id !== 'integumentary');
      });
    });

    // Physiology Presets
    const presetsGrid = document.getElementById('presets-grid');
    const presetDescEl = document.getElementById('preset-desc');

    function setSimPreset(presetId) {
      sim.setPreset(presetId);
      const p = I18n.getPreset(presetId);
      if (presetDescEl && p) presetDescEl.textContent = p.description;
      presetsGrid.querySelectorAll('.preset-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.preset === presetId);
      });
    }

    function renderPresets() {
      presetsGrid.innerHTML = '';
      I18n.getAllPresets().forEach((p) => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn' + (p.id === sim.presetId ? ' active' : '');
        btn.dataset.preset = p.id;
        btn.innerHTML = `<span class="preset-ico">${p.icon}</span><span>${p.name}</span>`;
        btn.addEventListener('click', () => setSimPreset(p.id));
        presetsGrid.appendChild(btn);
      });
      const cur = I18n.getPreset(sim.presetId);
      if (presetDescEl && cur) presetDescEl.textContent = cur.description;
    }

    // Sliders & Viewport Toolbar Controls
    const explodeSlider = document.getElementById('explode-slider');
    const explodeVal = document.getElementById('explode-val');
    explodeSlider.addEventListener('input', () => {
      const v = parseFloat(explodeSlider.value);
      body.setExplode(v);
      explodeVal.textContent = `${Math.round(v * 100)}%`;
    });

    const skinSlider = document.getElementById('skin-slider');
    const skinVal = document.getElementById('skin-val');
    skinSlider.addEventListener('input', () => {
      const v = parseFloat(skinSlider.value);
      body.setSkinOpacity(v);
      skinVal.textContent = `${Math.round((v / 0.4) * 100)}%`;
    });

    const mriSlider = document.getElementById('mri-slider');
    const mriVal = document.getElementById('mri-val');
    mriSlider.addEventListener('input', () => {
      const v = parseFloat(mriSlider.value);
      body.setMriSlice(v);
      mriVal.textContent = `${Math.round(v * 100)}%`;
    });

    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', () => {
      const next = !audio.isEnabled();
      audio.setEnabled(next);
      btnSound.classList.toggle('active', next);
      const ico = btnSound.querySelector('span');
      if (ico) ico.textContent = next ? '🔊' : '🔇';
    });

    const btnXRay = document.getElementById('btn-xray');
    let xrayOn = false;
    btnXRay.addEventListener('click', () => {
      xrayOn = !xrayOn;
      body.setXRayMode(xrayOn);
      btnXRay.classList.toggle('active', xrayOn);
    });

    const btnLabels = document.getElementById('btn-labels');
    btnLabels.addEventListener('click', () => {
      showLabels = !showLabels;
      btnLabels.classList.toggle('active', showLabels);
    });

    const btnRotate = document.getElementById('btn-rotate');
    btnRotate.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnRotate.classList.toggle('active', controls.autoRotate);
    });

    const btnFlows = document.getElementById('btn-flows');
    let flowsOn = true;
    btnFlows.addEventListener('click', () => {
      flowsOn = !flowsOn;
      sim.setShowFlows(flowsOn);
      btnFlows.classList.toggle('active', flowsOn);
    });

    document.getElementById('btn-reset-cam').addEventListener('click', resetCamera);

    // =========================================================================
    // 8. RIGHT PANEL: ENCYCLOPEDIA & GAME MODES
    // =========================================================================
    const encyclopediaBody = document.getElementById('encyclopedia-content');
    const gamePanel = document.getElementById('game-panel');

    function selectOrganInEncyclopedia(organId, shouldFocus = false) {
      const org = I18n.getOrgan(organId);
      if (!org) return;
      if (org.sex && org.sex !== currentSex) {
        currentSex = org.sex;
        body.setSex(currentSex);
        const reproSys = global.ANATOMA_DATA.SYSTEMS.reproductive;
        if (reproSys) reproSys.keyOrgans = currentSex === 'female' ? reproSys.femaleOrgans : reproSys.maleOrgans;
        document.querySelectorAll('.sex-btn').forEach((b) => {
          b.classList.toggle('active', b.dataset.sex === currentSex);
        });
      }
      selectedOrganId = organId;
      encyclopediaView = { type: 'organ', id: organId };
      game.markDiscovered(organId);
      updateHeaderStats();

      setSystemVisible(org.system, true);
      if (shouldFocus) focusOrgan(organId);
      renderSystemsList();

      const sys = I18n.getSystem(org.system);
      const connectionsHtml = org.connections
        .map((cid) => {
          const cOrg = I18n.getOrgan(cid);
          return cOrg ? `<button class="link-chip" data-organ="${cid}">${cOrg.name}</button>` : '';
        })
        .join('');

      encyclopediaBody.innerHTML = `
        <div class="enc-header">
          <div class="enc-header-top">
            <span class="sys-badge" style="border-color:${sys.color}; color:${sys.color}">
              ${sys.icon} ${sys.name}
            </span>
            <button class="btn-tts" id="btn-tts-speak">🔊 ${I18n.t('readAloud')}</button>
          </div>
          <h2 class="enc-title">${org.name}</h2>
          <div class="enc-latin">${org.latin}</div>
        </div>

        <div class="enc-meta-grid">
          <div class="meta-box">
            <span class="meta-label">${I18n.t('location')}</span>
            <span class="meta-val">${org.location}</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">${I18n.t('sizeWeight')}</span>
            <span class="meta-val">${org.weight}</span>
          </div>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('overview')}</h3>
          <p>${org.summary}</p>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('howItWorks')}</h3>
          <p>${org.howItWorks}</p>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('keyFunctions')}</h3>
          <ul class="enc-list">
            ${org.functions.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('connectedOrgans')}</h3>
          <div class="chip-row">${connectionsHtml}</div>
        </div>

        <div class="enc-callout fun-fact">
          <div class="callout-title">💡 ${I18n.t('didYouKnow')}</div>
          <p>${org.funFact}</p>
        </div>

        <div class="enc-callout health-tip">
          <div class="callout-title">🌿 ${I18n.t('healthTip')}</div>
          <p>${org.healthTip}</p>
        </div>
      `;

      audio.stopSpeech();
      const ttsBtn = document.getElementById('btn-tts-speak');
      if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
          if (audio.speaking) {
            audio.stopSpeech();
            ttsBtn.textContent = `🔊 ${I18n.t('readAloud')}`;
            ttsBtn.classList.remove('speaking');
          } else {
            const speechText = `${org.name}. ${org.summary} ${org.howItWorks}`;
            ttsBtn.textContent = `⏹ ${I18n.t('stopReading')}`;
            ttsBtn.classList.add('speaking');
            audio.speak(speechText, I18n.getLang(), () => {
              ttsBtn.textContent = `🔊 ${I18n.t('readAloud')}`;
              ttsBtn.classList.remove('speaking');
            });
          }
        });
      }

      encyclopediaBody.querySelectorAll('.link-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          selectOrganInEncyclopedia(chip.dataset.organ, true);
        });
      });
    }

    function showSystemInEncyclopedia(sysId) {
      const sys = I18n.getSystem(sysId);
      if (!sys) return;
      encyclopediaView = { type: 'system', id: sysId };
      if (game.mode !== 'explore') switchMode('explore');

      const organsHtml = sys.keyOrgans
        .map((oid) => {
          const o = I18n.getOrgan(oid);
          return o ? `<button class="link-chip" data-organ="${oid}">${o.name}</button>` : '';
        })
        .join('');

      encyclopediaBody.innerHTML = `
        <div class="enc-header">
          <div class="enc-header-top">
            <span class="sys-badge" style="border-color:${sys.color}; color:${sys.color}">
              ${sys.icon} ${I18n.t('bodySystemGuide')}
            </span>
            <button class="btn-tts" id="btn-tts-speak">🔊 ${I18n.t('readAloud')}</button>
          </div>
          <h2 class="enc-title">${sys.name}</h2>
          <div class="enc-latin">${sys.tagline}</div>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('whatItDoes')}</h3>
          <p>${sys.overview}</p>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('howSystemWorks')}</h3>
          <p>${sys.howItWorks}</p>
        </div>

        <div class="enc-section">
          <h3>${I18n.t('mainOrgansInSys')}</h3>
          <div class="chip-row">${organsHtml}</div>
        </div>

        <div class="enc-callout fun-fact">
          <div class="callout-title">💡 ${I18n.t('amazingFact')}</div>
          <p>${sys.funFact}</p>
        </div>
      `;

      audio.stopSpeech();
      const ttsBtn = document.getElementById('btn-tts-speak');
      if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
          if (audio.speaking) {
            audio.stopSpeech();
            ttsBtn.textContent = `🔊 ${I18n.t('readAloud')}`;
            ttsBtn.classList.remove('speaking');
          } else {
            const speechText = `${sys.name}. ${sys.overview} ${sys.howItWorks}`;
            ttsBtn.textContent = `⏹ ${I18n.t('stopReading')}`;
            ttsBtn.classList.add('speaking');
            audio.speak(speechText, I18n.getLang(), () => {
              ttsBtn.textContent = `🔊 ${I18n.t('readAloud')}`;
              ttsBtn.classList.remove('speaking');
            });
          }
        });
      }

      encyclopediaBody.querySelectorAll('.link-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          selectOrganInEncyclopedia(chip.dataset.organ, true);
        });
      });
    }

    function renderGamePanel() {
      const isExplore = game.mode === 'explore';
      encyclopediaBody.style.display = isExplore ? 'block' : 'none';
      gamePanel.style.display = isExplore ? 'none' : 'block';
      if (isExplore) return;

      let html = '';

      if (game.mode === 'locate') {
        const ch = game.getCurrentLocate();
        html = `
          <div class="game-card">
            <div class="game-badge">🎯 ${I18n.t('locateBadge', { n: game.locateIndex + 1 })}</div>
            <h3 class="game-prompt">${ch.clue}</h3>
            <p class="game-instruction">${I18n.t('locateInst')}</p>
            ${
              game.locateHintShown
                ? `<div class="hint-box"><strong>${I18n.t('hintLabel')}</strong> ${ch.hint}</div>`
                : `<button class="btn-secondary" id="btn-game-hint">💡 ${I18n.t('showHint')}</button>`
            }
          </div>
        `;
      } else if (game.mode === 'doctor') {
        const sc = game.getCurrentDoctor();
        html = `
          <div class="game-card doctor-card">
            <div class="game-badge emergency">🩺 ${I18n.t('doctorBadge', { n: game.doctorIndex + 1 })}</div>
            <h3 class="game-title">${sc.title}</h3>
            <p class="game-prompt">${sc.story}</p>
            ${
              game.doctorStage === 'find'
                ? `<div class="game-actions-row">
                     <span class="step-pill">${I18n.t('step1')}</span>
                     <button class="btn-secondary" id="btn-game-hint">💡 ${I18n.t('clinicalHint')}</button>
                   </div>`
                : ''
            }
            ${
              game.doctorStage === 'followup'
                ? `<div class="followup-box">
                     <div class="step-pill">${I18n.t('step2')}</div>
                     <p class="fq-text">${sc.followUp.question}</p>
                     <div class="quiz-options">
                       ${sc.followUp.options
                         .map((opt, idx) => `<button class="quiz-opt" data-doc-opt="${idx}">${opt}</button>`)
                         .join('')}
                     </div>
                   </div>`
                : ''
            }
          </div>
        `;
      } else if (game.mode === 'quiz') {
        const item = game.getCurrentQuiz();
        html = `
          <div class="game-card">
            <div class="game-badge quiz-badge">🧠 ${I18n.t('quizBadge', { n: game.quizIndex + 1 })}</div>
            <h3 class="game-prompt">${item.q}</h3>
            <div class="quiz-options">
              ${item.options
                .map((opt, idx) => {
                  let cls = 'quiz-opt';
                  if (game.quizAnswered && idx === item.answer) cls += ' correct';
                  return `<button class="${cls}" data-quiz-opt="${idx}" ${game.quizAnswered ? 'disabled' : ''}>${opt}</button>`;
                })
                .join('')}
            </div>
          </div>
        `;
      }

      if (game.feedback) {
        html += `
          <div class="feedback-box ${game.feedback.type}">
            <div class="fb-title">${game.feedback.title}</div>
            <p>${game.feedback.text}</p>
          </div>
        `;
      }

      const showNext =
        (game.mode === 'locate' && game.locateAnswered) ||
        (game.mode === 'doctor' && game.doctorStage === 'done') ||
        (game.mode === 'quiz' && game.quizAnswered);

      if (showNext) {
        html += `<button class="btn-primary full-width" id="btn-game-next">${I18n.t('nextChallenge')}</button>`;
      }

      gamePanel.innerHTML = html;

      const hintBtn = document.getElementById('btn-game-hint');
      if (hintBtn) hintBtn.addEventListener('click', () => game.requestHint());

      const nextBtn = document.getElementById('btn-game-next');
      if (nextBtn) nextBtn.addEventListener('click', () => game.nextChallenge());

      gamePanel.querySelectorAll('[data-doc-opt]').forEach((btn) => {
        btn.addEventListener('click', () => game.answerDoctorFollowUp(parseInt(btn.dataset.docOpt, 10)));
      });

      gamePanel.querySelectorAll('[data-quiz-opt]').forEach((btn) => {
        btn.addEventListener('click', () => game.answerQuiz(parseInt(btn.dataset.quizOpt, 10)));
      });
    }

    function updateHeaderStats() {
      document.getElementById('stat-xp').textContent = I18n.t('xpStat', { score: game.score });
      document.getElementById('stat-streak').textContent = `🔥 ${game.streak}`;
      const prog = game.getDiscoveryProgress();
      document.getElementById('stat-discovered').textContent = `🏆 ${I18n.t('organsStat', prog)}`;
    }

    function switchMode(mode) {
      document.querySelectorAll('.mode-tab').forEach((t) => {
        t.classList.toggle('active', t.dataset.mode === mode);
      });
      game.setMode(mode);
      if (mode === 'explore') {
        if (encyclopediaView.type === 'system') showSystemInEncyclopedia(encyclopediaView.id);
        else selectOrganInEncyclopedia(selectedOrganId, false);
      } else {
        resetCamera();
      }
    }

    document.querySelectorAll('.mode-tab').forEach((tab) => {
      tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    // =========================================================================
    // 9. SEARCHABLE ENCYCLOPEDIA DIRECTORY MODAL
    // =========================================================================
    const modal = document.getElementById('directory-modal');
    const dirSearch = document.getElementById('dir-search');
    const dirGrid = document.getElementById('dir-grid');

    function renderDirectory(filter = '') {
      const q = filter.trim().toLowerCase();
      let html = '';

      const matchingSys = I18n.getAllSystems().filter(
        (s) => !q || s.name.toLowerCase().includes(q) || s.overview.toLowerCase().includes(q)
      );
      if (matchingSys.length) {
        html += `<div class="dir-section-title">${I18n.t('dirSystemsCount', { n: matchingSys.length })}</div><div class="dir-cards">`;
        matchingSys.forEach((s) => {
          html += `
            <button class="dir-card" data-dir-sys="${s.id}">
              <div class="dir-card-head">
                <span class="dir-ico">${s.icon}</span>
                <strong style="color:${s.color}">${s.name}</strong>
              </div>
              <p>${s.tagline}</p>
            </button>
          `;
        });
        html += `</div>`;
      }

      const matchingOrg = I18n.getAllOrgans().filter((o) => {
        const sys = I18n.getSystem(o.system);
        return (
          !q ||
          o.name.toLowerCase().includes(q) ||
          o.latin.toLowerCase().includes(q) ||
          o.summary.toLowerCase().includes(q) ||
          sys.name.toLowerCase().includes(q)
        );
      });
      if (matchingOrg.length) {
        html += `<div class="dir-section-title">${I18n.t('dirOrgansCount', { n: matchingOrg.length })}</div><div class="dir-cards">`;
        matchingOrg.forEach((o) => {
          const sys = I18n.getSystem(o.system);
          const isFound = game.discovered.has(o.id);
          html += `
            <button class="dir-card" data-dir-org="${o.id}">
              <div class="dir-card-head">
                <span class="tt-dot" style="background:${sys.color}"></span>
                <strong>${o.name}</strong>
                ${isFound ? '<span class="found-tag">✓</span>' : ''}
              </div>
              <span class="dir-sub">${o.latin} · ${sys.shortName}</span>
              <p>${o.summary.slice(0, 95)}...</p>
            </button>
          `;
        });
        html += `</div>`;
      }

      if (!html) {
        html = `<div class="dir-empty">${I18n.t('dirEmpty', { q: filter })}</div>`;
      }

      dirGrid.innerHTML = html;

      dirGrid.querySelectorAll('[data-dir-org]').forEach((btn) => {
        btn.addEventListener('click', () => {
          modal.classList.remove('open');
          switchMode('explore');
          selectOrganInEncyclopedia(btn.dataset.dirOrg, true);
        });
      });

      dirGrid.querySelectorAll('[data-dir-sys]').forEach((btn) => {
        btn.addEventListener('click', () => {
          modal.classList.remove('open');
          showSystemInEncyclopedia(btn.dataset.dirSys);
        });
      });
    }

    document.getElementById('btn-open-directory').addEventListener('click', () => {
      dirSearch.value = '';
      renderDirectory('');
      modal.classList.add('open');
      setTimeout(() => dirSearch.focus(), 50);
    });
    document.getElementById('btn-close-directory').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    dirSearch.addEventListener('input', () => renderDirectory(dirSearch.value));

    // =========================================================================
    // 10. LANGUAGE SWITCHER (ENGLISH / HEBREW)
    // =========================================================================
    function applyLanguage() {
      const lang = I18n.getLang();
      I18n.applyDocumentDirection();

      // Update active toggle buttons
      document.querySelectorAll('.lang-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });

      // Translate static DOM labels
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = I18n.t(el.dataset.i18n);
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.placeholder = I18n.t(el.dataset.i18nPlaceholder);
      });
      document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        el.title = I18n.t(el.dataset.i18nTitle);
      });

      // Re-render dynamic panels
      renderSystemsList();
      renderPresets();
      renderToursList();
      renderPathologyLab();
      updateTourBanner();
      updateDrawerTitle();
      buildFloatingLabels();
      updateHeaderStats();

      if (masteryModal && masteryModal.classList.contains('open')) {
        renderMasteryModal();
      }

      if (game.mode === 'explore') {
        if (encyclopediaView.type === 'system') showSystemInEncyclopedia(encyclopediaView.id);
        else selectOrganInEncyclopedia(selectedOrganId, false);
      } else {
        renderGamePanel();
      }

      if (modal.classList.contains('open')) {
        renderDirectory(dirSearch.value);
      }
    }

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        I18n.setLang(btn.dataset.lang);
        applyLanguage();
      });
    });

    // =========================================================================
    // 10B. THEME SWITCHER (MIDNIGHT, CLINICAL LIGHT, BIO EMERALD, WARM ATLAS)
    // =========================================================================
    const SCENE_THEMES = {
      midnight: {
        fog: 0x070c17,
        ring: 0x38bdf8,
        disk: 0x0c4a6e,
        gridA: 0x1e3a5f,
        gridB: 0x0d1b32,
        rim: 0x38bdf8,
        hemiSky: 0xdbeafe,
        hemiGnd: 0x0f172a
      },
      light: {
        fog: 0xeef3f9,
        ring: 0x0284c7,
        disk: 0xbae6fd,
        gridA: 0xcbd5e1,
        gridB: 0xe2e8f0,
        rim: 0x0ea5e9,
        hemiSky: 0xffffff,
        hemiGnd: 0x94a3b8
      },
      emerald: {
        fog: 0x05110e,
        ring: 0x34d399,
        disk: 0x064e3b,
        gridA: 0x134e4a,
        gridB: 0x082620,
        rim: 0x34d399,
        hemiSky: 0xd1fae5,
        hemiGnd: 0x052e16
      },
      warm: {
        fog: 0xf5efe6,
        ring: 0xd97706,
        disk: 0xfde68a,
        gridA: 0xd6c7b2,
        gridB: 0xe8dfd1,
        rim: 0xf59e0b,
        hemiSky: 0xfffbeb,
        hemiGnd: 0xa89f91
      }
    };

    function applyTheme(themeId) {
      const id = SCENE_THEMES[themeId] ? themeId : 'midnight';
      document.documentElement.dataset.theme = id;
      try { localStorage.setItem('anatoma_theme', id); } catch (e) {}

      document.querySelectorAll('.theme-dot').forEach((b) => {
        b.classList.toggle('active', b.dataset.themePick === id);
      });

      const cfg = SCENE_THEMES[id];
      scene.fog.color.setHex(cfg.fog);
      ringMat.color.setHex(cfg.ring);
      innerDisk.material.color.setHex(cfg.disk);
      rimLight.color.setHex(cfg.rim);
      hemiLight.color.setHex(cfg.hemiSky);
      hemiLight.groundColor.setHex(cfg.hemiGnd);

      // Rebuild floor grid with theme colors
      pedestalGroup.remove(grid);
      grid.geometry.dispose();
      grid = new THREE.GridHelper(4.5, 24, cfg.gridA, cfg.gridB);
      grid.position.y = -0.145;
      pedestalGroup.add(grid);

      sim.setTheme(id);
    }

    document.querySelectorAll('.theme-dot').forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.themePick));
    });

    let savedTheme = 'midnight';
    try {
      const t = localStorage.getItem('anatoma_theme');
      if (t && SCENE_THEMES[t]) savedTheme = t;
    } catch (e) {}
    applyTheme(savedTheme);

    // =========================================================================
    // 10C. MALE / FEMALE BODY SWITCHER
    // =========================================================================
    let currentSex = 'male';
    function applySex(sex) {
      currentSex = sex === 'female' ? 'female' : 'male';
      try { localStorage.setItem('anatoma_sex', currentSex); } catch (e) {}

      body.setSex(currentSex);

      // Update Reproductive System's active organ list for the chosen sex
      const reproSys = global.ANATOMA_DATA.SYSTEMS.reproductive;
      if (reproSys) {
        reproSys.keyOrgans = currentSex === 'female' ? reproSys.femaleOrgans : reproSys.maleOrgans;
      }

      document.querySelectorAll('.sex-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.sex === currentSex);
      });

      // If currently inspecting a sex-specific organ from the other sex, smoothly switch to the matching one
      const curOrg = I18n.getOrgan(selectedOrganId);
      if (curOrg && curOrg.sex && curOrg.sex !== currentSex) {
        selectOrganInEncyclopedia(currentSex === 'female' ? 'uterus' : 'prostate', false);
      } else {
        renderSystemsList();
        if (encyclopediaView.type === 'system' && encyclopediaView.id === 'reproductive') {
          showSystemInEncyclopedia('reproductive');
        }
      }
    }

    document.querySelectorAll('.sex-btn').forEach((btn) => {
      btn.addEventListener('click', () => applySex(btn.dataset.sex));
    });

    let savedSex = 'male';
    try {
      const s = localStorage.getItem('anatoma_sex');
      if (s === 'male' || s === 'female') savedSex = s;
    } catch (e) {}
    applySex(savedSex);

    // =========================================================================
    // 10D. GUIDED 3D BODY TOURS
    // =========================================================================
    const FEATURES = global.AnatomaFeatures;
    const toursListEl = document.getElementById('tours-list');
    const tourBanner = document.getElementById('tour-banner');
    const tourTitleEl = document.getElementById('tour-title');
    const tourStepPill = document.getElementById('tour-step-pill');
    const tourNoteEl = document.getElementById('tour-note');
    const btnTourAuto = document.getElementById('btn-tour-autoplay');
    const btnTourVoice = document.getElementById('btn-tour-voice');

    let activeTourId = null;
    let tourStepIdx = 0;
    let tourTimer = null;
    let tourVoiceOn = false;

    function speakCurrentTourStep() {
      if (!activeTourId || !tourVoiceOn) return;
      const lang = I18n.getLang();
      const tour = FEATURES.TOURS[activeTourId];
      const step = tour.steps[tourStepIdx];
      const org = I18n.getOrgan(step.organId);
      const text = `${org ? org.name + '. ' : ''}${step.note[lang]}`;
      audio.speak(text, lang);
    }

    function renderToursList() {
      const lang = I18n.getLang();
      toursListEl.innerHTML = '';
      Object.values(FEATURES.TOURS).forEach((tour) => {
        const btn = document.createElement('button');
        btn.className = 'tour-btn' + (tour.id === activeTourId ? ' active' : '');
        btn.innerHTML = `<span>${tour.icon}</span><span class="tour-btn-title">${tour.title[lang]}</span><span class="tour-btn-steps">${tour.steps.length}</span>`;
        btn.addEventListener('click', () => startTour(tour.id));
        toursListEl.appendChild(btn);
      });
    }

    function updateTourBanner() {
      if (!activeTourId) {
        tourBanner.style.display = 'none';
        return;
      }
      const lang = I18n.getLang();
      const tour = FEATURES.TOURS[activeTourId];
      const step = tour.steps[tourStepIdx];
      tourBanner.style.display = 'block';
      tourTitleEl.textContent = `${tour.icon} ${tour.title[lang]}`;
      tourStepPill.textContent = I18n.t('tourStepOf', { cur: tourStepIdx + 1, tot: tour.steps.length });
      tourNoteEl.textContent = step.note[lang];
      btnTourAuto.textContent = tourTimer ? I18n.t('tourPause') : I18n.t('tourPlay');
      if (btnTourVoice) {
        btnTourVoice.textContent = tourVoiceOn ? I18n.t('tourVoiceOn') : I18n.t('tourVoice');
        btnTourVoice.classList.toggle('active-voice', tourVoiceOn);
      }
    }

    function goTourStep(idx) {
      if (!activeTourId) return;
      const tour = FEATURES.TOURS[activeTourId];
      tourStepIdx = (idx + tour.steps.length) % tour.steps.length;
      const step = tour.steps[tourStepIdx];
      if (game.mode !== 'explore') switchMode('explore');
      selectOrganInEncyclopedia(step.organId, true);
      updateTourBanner();
      if (tourVoiceOn) speakCurrentTourStep();
    }

    function startTour(tourId) {
      stopTourAutoplay();
      activeTourId = tourId;
      tourStepIdx = 0;
      renderToursList();
      goTourStep(0);
    }

    function stopTourAutoplay() {
      if (tourTimer) {
        clearInterval(tourTimer);
        tourTimer = null;
      }
    }

    function exitTour() {
      stopTourAutoplay();
      audio.stopSpeech();
      tourVoiceOn = false;
      activeTourId = null;
      tourBanner.style.display = 'none';
      renderToursList();
      resetCamera();
    }

    document.getElementById('btn-tour-prev').addEventListener('click', () => goTourStep(tourStepIdx - 1));
    document.getElementById('btn-tour-next').addEventListener('click', () => goTourStep(tourStepIdx + 1));
    document.getElementById('btn-tour-exit').addEventListener('click', exitTour);
    if (btnTourVoice) {
      btnTourVoice.addEventListener('click', () => {
        tourVoiceOn = !tourVoiceOn;
        if (tourVoiceOn) speakCurrentTourStep();
        else audio.stopSpeech();
        updateTourBanner();
      });
    }
    btnTourAuto.addEventListener('click', () => {
      if (tourTimer) {
        stopTourAutoplay();
      } else {
        tourTimer = setInterval(() => goTourStep(tourStepIdx + 1), tourVoiceOn ? 6800 : 5200);
      }
      updateTourBanner();
    });

    // =========================================================================
    // 10E. PATHOLOGY & HEALTH LAB (With Voice Narration)
    // =========================================================================
    const pathologyGrid = document.getElementById('pathology-grid');
    const pathologyDescEl = document.getElementById('pathology-desc');
    const btnPathologyTts = document.getElementById('btn-pathology-tts');
    let currentPathologyId = 'healthy';
    let pathologySpeaking = false;

    function resetPathologyTtsBtn() {
      pathologySpeaking = false;
      if (btnPathologyTts) {
        btnPathologyTts.innerHTML = `🔊 <span>${I18n.t('readAloud')}</span>`;
        btnPathologyTts.classList.remove('speaking');
      }
    }

    function applyPathology(pathId) {
      const p = FEATURES.PATHOLOGIES[pathId] || FEATURES.PATHOLOGIES.healthy;
      currentPathologyId = p.id;
      const lang = I18n.getLang();

      audio.stopSpeech();
      resetPathologyTtsBtn();

      // Ensure affected organ systems are visible so user sees the 3D effect immediately
      p.affectedOrgans.forEach((oid) => {
        const org = I18n.getOrgan(oid);
        if (org) setSystemVisible(org.system, true);
      });

      body.setPathology(p.affectedOrgans, p.tintHex);
      sim.setPathologyMods(p.vitalMods);
      pathologyDescEl.textContent = p.description[lang];

      // Smoothly focus primary affected organ (or full-body view when back to Healthy)
      if (p.affectedOrgans.length > 0) {
        focusOrgan(p.affectedOrgans[0]);
      } else {
        resetCamera();
      }

      pathologyGrid.querySelectorAll('.preset-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.path === p.id);
      });
    }

    if (btnPathologyTts) {
      btnPathologyTts.addEventListener('click', () => {
        if (pathologySpeaking) {
          audio.stopSpeech();
          resetPathologyTtsBtn();
          return;
        }
        const p = FEATURES.PATHOLOGIES[currentPathologyId];
        if (!p) return;
        const lang = I18n.getLang();
        const text = `${p.name[lang]}. ${p.description[lang]}`;
        pathologySpeaking = true;
        btnPathologyTts.innerHTML = `⏹ <span>${I18n.t('stopReading')}</span>`;
        btnPathologyTts.classList.add('speaking');
        audio.speak(text, lang, resetPathologyTtsBtn);
      });
    }

    function renderPathologyLab() {
      const lang = I18n.getLang();
      pathologyGrid.innerHTML = '';
      Object.values(FEATURES.PATHOLOGIES).forEach((p) => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn' + (p.id === currentPathologyId ? ' active' : '');
        btn.dataset.path = p.id;
        btn.innerHTML = `<span class="preset-ico">${p.icon}</span><span>${p.name[lang]}</span>`;
        btn.addEventListener('click', () => applyPathology(p.id));
        pathologyGrid.appendChild(btn);
      });
      const cur = FEATURES.PATHOLOGIES[currentPathologyId];
      if (cur) pathologyDescEl.textContent = cur.description[lang];
      resetPathologyTtsBtn();
    }

    // =========================================================================
    // 10F. MASTERY & SYSTEM MEDALS MODAL
    // =========================================================================
    const masteryModal = document.getElementById('mastery-modal');
    const masteryBody = document.getElementById('mastery-body');

    function renderMasteryModal() {
      const prog = game.getDiscoveryProgress();
      const pct = Math.round((prog.count / Math.max(1, prog.total)) * 100);
      const rankName = I18n.t(FEATURES.getRankKey(pct));

      const medalsHtml = I18n.getAllSystems()
        .map((sys) => {
          const organList =
            sys.id === 'reproductive'
              ? [...(sys.maleOrgans || []), ...(sys.femaleOrgans || [])]
              : sys.keyOrgans || [];
          const unique = Array.from(new Set(organList));
          const foundCount = unique.filter((id) => game.discovered.has(id)).length;
          const complete = foundCount === unique.length && unique.length > 0;
          return `
            <div class="medal-card ${complete ? 'unlocked' : ''}">
              <div class="medal-icon">${complete ? '🏅' : sys.icon}</div>
              <div class="medal-info">
                <strong>${sys.shortName}</strong>
                <span>${foundCount} / ${unique.length}</span>
              </div>
              <div class="medal-bar">
                <div class="medal-fill" style="width:${Math.round((foundCount / Math.max(1, unique.length)) * 100)}%; background:${sys.color}"></div>
              </div>
            </div>
          `;
        })
        .join('');

      masteryBody.innerHTML = `
        <div class="mastery-summary">
          <div class="m-stat">
            <span>${I18n.t('rankLabel')}</span>
            <strong class="m-rank">${rankName}</strong>
          </div>
          <div class="m-stat">
            <span>${I18n.t('discoveredLabel')}</span>
            <strong>${prog.count} / ${prog.total} (${pct}%)</strong>
          </div>
          <div class="m-stat">
            <span>${I18n.t('totalXpLabel')}</span>
            <strong class="m-xp">${I18n.t('xpStat', { score: game.score })}</strong>
          </div>
          <div class="m-stat">
            <span>${I18n.t('bestStreakLabel')}</span>
            <strong>🔥 ${game.bestStreak}</strong>
          </div>
        </div>

        <div class="mastery-progress-bar">
          <div class="mastery-progress-fill" style="width:${pct}%"></div>
        </div>

        <div class="dir-section-title">${I18n.t('systemMedals')}</div>
        <div class="medals-grid">${medalsHtml}</div>

        <div class="mastery-footer">
          <button class="btn-secondary danger-btn" id="btn-reset-progress">🗑 ${I18n.t('resetProgress')}</button>
        </div>
      `;

      const resetBtn = document.getElementById('btn-reset-progress');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (global.confirm(I18n.t('resetConfirm'))) {
            game.resetProgress();
            renderSystemsList();
            renderMasteryModal();
          }
        });
      }
    }

    document.getElementById('stat-discovered').addEventListener('click', () => {
      renderMasteryModal();
      masteryModal.classList.add('open');
    });
    document.getElementById('btn-close-mastery').addEventListener('click', () => {
      masteryModal.classList.remove('open');
    });
    masteryModal.addEventListener('click', (e) => {
      if (e.target === masteryModal) masteryModal.classList.remove('open');
    });

    // =========================================================================
    // 10G. DYNAMIC BOTTOM TOPIC DOCK & COLLAPSIBLE SIDEBAR DRAWER
    // =========================================================================
    const workspaceEl = document.querySelector('.workspace');
    const drawerTitleEl = document.getElementById('drawer-active-label');
    const TOPIC_TITLE_KEYS = {
      systems: 'bodySystems',
      dissect: 'dissection3d',
      tours: 'guidedTours',
      lab: 'pathologyLab',
      physio: 'livingSim'
    };
    let activeTopic = 'systems';

    function updateDrawerTitle() {
      if (drawerTitleEl && activeTopic && TOPIC_TITLE_KEYS[activeTopic]) {
        drawerTitleEl.textContent = I18n.t(TOPIC_TITLE_KEYS[activeTopic]);
      }
    }

    function selectTopic(topicId) {
      // Clicking the already-open topic collapses the drawer for a wider 3D view!
      if (activeTopic === topicId && !workspaceEl.classList.contains('drawer-collapsed')) {
        collapseDrawer();
        return;
      }
      activeTopic = topicId;
      workspaceEl.classList.remove('drawer-collapsed');

      document.querySelectorAll('.topic-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.dataset.topic === topicId);
      });
      document.querySelectorAll('.dock-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.dock === topicId);
      });
      updateDrawerTitle();
      setTimeout(onResize, 240);
    }

    function collapseDrawer() {
      workspaceEl.classList.add('drawer-collapsed');
      document.querySelectorAll('.dock-item').forEach((btn) => btn.classList.remove('active'));
      setTimeout(onResize, 240);
    }

    document.querySelectorAll('.dock-item').forEach((btn) => {
      btn.addEventListener('click', () => selectTopic(btn.dataset.dock));
    });

    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', collapseDrawer);
    }

    // =========================================================================
    // 11. ANIMATION LOOP & LIVE VITALS HUD
    // =========================================================================
    const elBpm = document.getElementById('vital-bpm');
    const elResp = document.getElementById('vital-resp');
    const elSpo2 = document.getElementById('vital-spo2');
    const elBp = document.getElementById('vital-bp');
    const elBrain = document.getElementById('vital-brain');

    const clock = new THREE.Clock();
    let hudTimer = 0;

    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;

      if (camAnim) {
        camAnim.t = Math.min(1, camAnim.t + dt * 2.4);
        const ease = 1 - Math.pow(1 - camAnim.t, 3);
        camera.position.lerpVectors(camAnim.startPos, camAnim.endPos, ease);
        controls.target.lerpVectors(camAnim.startLook, camAnim.endLook, ease);
        if (camAnim.t >= 1) camAnim = null;
      }

      controls.update();
      sim.update(dt);
      updateOrganHighlights(elapsed);
      updateFloatingLabels();

      hudTimer += dt;
      if (hudTimer >= 0.16) {
        hudTimer = 0;
        const v = sim.getVitals();
        elBpm.textContent = v.bpm;
        elResp.textContent = v.respRate;
        elSpo2.textContent = `${v.spo2}%`;
        elBp.textContent = v.bp;
        elBrain.textContent = v.brainActivity;
      }

      renderer.render(scene, camera);
    }

    function onResize() {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Boot UI in saved/default language and start loop
    applyLanguage();
    animate();
  });
})(window);
