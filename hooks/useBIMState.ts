import { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { AppMode, Manifestation, RenderMode, StagedObject, AssemblyInstance, ISODomain, DisassemblyData, CoordinatePolar } from '../types';
import { snapToPrecisionLines, toPolar, toVec3 } from '../utils/math/polar';
import { analyzeDisassembly } from '../utils/math/analysis';
import { isClosedLoop } from '../utils/math/topology';

export const useBIMState = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Lathe);
  const [layer, setLayer] = useState<number>(32.5);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [stagedFaces, setStagedFaces] = useState<THREE.Vector3[][]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [isStabilizing, setIsStabilizing] = useState(false);
  const [precisionLines, setPrecisionLines] = useState(true);
  const [stagedObjects, setStagedObjects] = useState<StagedObject[]>([]);
  const [instances, setInstances] = useState<AssemblyInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [activeAIObjectId, setActiveAIObjectId] = useState<string | null>(null);
  const [status, setStatus] = useState("IDLE | WAITING COMMAND");
  const [logs, setLogs] = useState<string[]>([]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<ISODomain | null>(null);
  const [currentManifestation, setCurrentManifestation] = useState<Manifestation>(Manifestation.Wireframe);
  const [currentRenderMode, setCurrentRenderMode] = useState<RenderMode>(RenderMode.Euclidian);
  const [revolutionAngle, setRevolutionAngle] = useState<number>(360);
  const [navTarget, setNavTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const activeRadius = useMemo(() => layer * 2.5, [layer]);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString([], {hour12: false})}] ${msg}`, ...prev].slice(0, 50));
  }, []);

  const generateDefaultDfD = (name: string): DisassemblyData => ({
    connectionType: 'MECHANICAL_BOLT',
    accessibilityLevel: 1.0,
    disassemblyTool: 'Chave Allen 5mm',
    recyclabilityIndex: 0.98,
    lifecyclePhase: 'OPERATION',
    steps: [`Fixar centroide de ${name}`, "Alinhar eixos de Ramanujan", "Validar paridade 10D"]
  });

  const addPoint = useCallback((point: THREE.Vector3) => {
    if (!currentDomain) { setShowDomainModal(true); return; }
    if (isClosed || isStabilizing) return;
    const snapped = precisionLines ? snapToPrecisionLines(point, activeRadius) : point;
    const newPoints = [...points, snapped];
    addLog(`PT_CRYSTAL: [${snapped.x.toFixed(2)} ${snapped.y.toFixed(2)}]`);
    if (isClosedLoop(newPoints, 2.0)) {
      setIsClosed(true);
      setShowWorkflowModal(true);
      setStatus("FACE CRYSTALLIZED | AWAITING COMMIT");
    } else {
      setPoints(newPoints);
    }
  }, [points, isClosed, isStabilizing, precisionLines, activeRadius, currentDomain, addLog]);

  const materializeToRepository = useCallback((domain: ISODomain, subFolder: string) => {
    const neuroGhost = stagedObjects.find(o => o.id === activeAIObjectId || (o.ghostMode && o.origin === 'NEURO_CORE'));
    
    let newObj: StagedObject;

    if (neuroGhost) {
      newObj = { ...neuroGhost, ghostMode: false, domain, subFolder, timestamp: Date.now() };
      setStagedObjects(prev => prev.map(o => o.id === newObj.id ? newObj : o));
    } else {
      const allFaces = [...stagedFaces, points].filter(f => f.length > 2);
      if (allFaces.length === 0) return;
      const consolidatedPoints = allFaces.flat();
      const objId = `ISO-${uuidv4().slice(0, 8).toUpperCase()}`;
      newObj = {
        id: objId, name: `UNIT-${objId}`,
        points: consolidatedPoints.map(p => [p.x, p.y, p.z]),
        polarInstructions: consolidatedPoints.map(p => {
          const d = toPolar(p);
          return { theta: d.theta, phi: d.phi, radius: d.r / activeRadius };
        }),
        layer, domain, subFolder, origin: 'MANUAL',
        description: `Commit: ${domain} Helipoliedral Topology`,
        recoveryScore: analyzeDisassembly(consolidatedPoints),
        timestamp: Date.now(), unit: 'm', revolutionAngle, isLathe: mode === AppMode.Lathe,
        ghostMode: false, dfd: generateDefaultDfD(`UNIT-${objId}`)
      };
      setStagedObjects(prev => [newObj, ...prev]);
    }

    const instanceId = uuidv4().slice(0, 8);
    setInstances(prev => [...prev, {
      id: instanceId, blueprintId: newObj.id, position: navTarget.clone(),
      rotation: 0, layer, renderMode: currentRenderMode,
      manifestation: currentManifestation, dfd: newObj.dfd || generateDefaultDfD(newObj.name)
    }]);

    setStagedFaces([]); setPoints([]); setIsClosed(false); 
    setIsStabilizing(false); setActiveAIObjectId(null);
    setShowWorkflowModal(false);
    addLog(`MATERIALIZED: ${newObj.id} Crystalized in Layer L${layer.toFixed(1)}`);
    setStatus(`READY | ${newObj.id} STORED`);
  }, [activeAIObjectId, stagedObjects, stagedFaces, points, layer, activeRadius, revolutionAngle, mode, navTarget, currentRenderMode, currentManifestation, addLog]);

  const addObject = useCallback((obj: StagedObject) => {
    setStagedObjects(prev => [obj, ...prev]);
    if (obj.revolutionAngle !== undefined) setRevolutionAngle(obj.revolutionAngle);
    if (obj.ghostMode) {
      // Handshake Atômico de IA: stagedObject -> mode -> stabilizing
      setActiveAIObjectId(obj.id);
      setIsStabilizing(true);
      setMode(AppMode.Lathe);
      setShowWorkflowModal(true);
      setStatus("NEURO_CORE READY | AWAITING STABILIZATION");
      addLog(`[SISTEMA]: Geometria Neuro-Sintetizada Estabilizada em ${obj.id}.`);
      addLog(`[SISTEMA]: Contexto de Cristalização Ativo.`);
    }
  }, [addLog]);

  return {
    appState: { mode, layer, points, stagedFaces, isClosed, isStabilizing, precisionLines, stagedObjects, instances, selectedInstanceId, activeRadius, showWorkflowModal, showDomainModal, currentDomain, revolutionAngle, navTarget, logs },
    uiState: { status, currentManifestation, currentRenderMode },
    handlers: { 
      setMode, setLayer, addPoint, saveToISOStock: materializeToRepository,
      undo: () => setPoints(p => p.slice(0, -1)),
      clear: () => { setPoints([]); setStagedFaces([]); setInstances([]); setStagedObjects([]); setIsStabilizing(false); setIsClosed(false); setActiveAIObjectId(null); },
      setPrecisionLines, setSelectedInstanceId, setShowWorkflowModal, setShowDomainModal, setCurrentDomain,
      addObject, setRevolutionAngle, setNavTarget: (p: THREE.Vector3) => setNavTarget(p.clone()),
      deployToAssembly: (id: string) => {
        const bp = stagedObjects.find(o => o.id === id);
        if (bp) {
          const instId = uuidv4().slice(0, 8);
          setInstances(prev => [...prev, { id: instId, blueprintId: id, position: navTarget.clone(), rotation: 0, layer, renderMode: currentRenderMode, manifestation: currentManifestation, dfd: bp.dfd || generateDefaultDfD(bp.name) }]);
          setSelectedInstanceId(instId);
          addLog(`DEPLOY: Instance ${instId} of ${id} positioned.`);
        }
      },
      continueDrawing: () => {
        if (points.length > 2) {
          setStagedFaces(prev => [...prev, [...points]]);
          setPoints([]); setIsClosed(false); setShowWorkflowModal(false);
        }
      }
    },
    uiHandlers: { setManifestation: setCurrentManifestation, setRenderMode: setCurrentRenderMode }
  };
};