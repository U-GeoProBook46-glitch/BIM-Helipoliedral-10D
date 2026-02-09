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
  const [precisionLines, setPrecisionLines] = useState(true);
  const [stagedObjects, setStagedObjects] = useState<StagedObject[]>([]);
  const [instances, setInstances] = useState<AssemblyInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
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
    setLogs(prev => [msg, ...prev].slice(0, 50));
  }, []);

  const generateDefaultDfD = (name: string): DisassemblyData => ({
    connectionType: 'MECHANICAL_BOLT',
    accessibilityLevel: 1.0,
    disassemblyTool: 'Chave Allen 5mm',
    recyclabilityIndex: 0.98,
    lifecyclePhase: 'OPERATION',
    steps: [`Posicione o atuador no centroide de ${name}`, "Desbloqueie fixadores", "Retire componente", "Logística reversa"]
  });

  const addPoint = useCallback((point: THREE.Vector3) => {
    if (!currentDomain) {
      setShowDomainModal(true);
      return;
    }
    if (isClosed) return;
    const snapped = precisionLines ? snapToPrecisionLines(point, activeRadius) : point;
    const newPoints = [...points, snapped];
    addLog(`PT_CRYSTAL: [${snapped.x.toFixed(2)} ${snapped.y.toFixed(2)} ${snapped.z.toFixed(2)}]`);
    if (isClosedLoop(newPoints, 2.0)) {
      setIsClosed(true);
      setShowWorkflowModal(true);
      setStatus("FACE CRYSTALLIZED");
    } else {
      setPoints(newPoints);
    }
  }, [points, isClosed, precisionLines, activeRadius, currentDomain, addLog]);

  const saveToISOStock = useCallback((domain: ISODomain, subFolder: string) => {
    const allFaces = [...stagedFaces, points].filter(f => f.length > 2);
    if (allFaces.length === 0) return;
    const consolidatedPoints = allFaces.flat();
    
    // Calcula polarInstructions para desenho manual
    const polarPoints: CoordinatePolar[] = consolidatedPoints.map(p => {
      const pData = toPolar(p);
      return { theta: pData.theta, phi: pData.phi, radius: pData.r / activeRadius };
    });

    const newObj: StagedObject = {
      id: `ISO-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: `UNIT-${allFaces.length}F`,
      points: consolidatedPoints.map(p => [p.x, p.y, p.z]),
      polarInstructions: polarPoints,
      layer, domain, subFolder,
      description: `ISO ${domain} Active Topology`,
      recoveryScore: analyzeDisassembly(consolidatedPoints),
      timestamp: Date.now(),
      unit: subFolder === 'm' ? 'm' : 'mm',
      revolutionAngle,
      isLathe: mode === AppMode.Lathe,
      dfd: generateDefaultDfD(`UNIT-${allFaces.length}F`)
    };
    setStagedObjects(prev => [newObj, ...prev]);
    setStagedFaces([]); setPoints([]); setIsClosed(false); setShowWorkflowModal(false);
    setStatus(`MATERIALIZED TO ${domain}`);
  }, [stagedFaces, points, layer, activeRadius, revolutionAngle, mode]);

  return {
    appState: { mode, layer, points, stagedFaces, isClosed, precisionLines, stagedObjects, instances, selectedInstanceId, activeRadius, showWorkflowModal, showDomainModal, currentDomain, revolutionAngle, navTarget, logs },
    uiState: { status, currentManifestation, currentRenderMode },
    handlers: { 
      setMode, setLayer, addPoint, saveToISOStock,
      undo: () => setPoints(p => p.slice(0, -1)),
      clear: () => { setPoints([]); setStagedFaces([]); setInstances([]); },
      setPrecisionLines, setSelectedInstanceId, setShowWorkflowModal, setShowDomainModal, setCurrentDomain,
      addObject: (obj: StagedObject) => { 
        setStagedObjects(prev => [obj, ...prev]); 
        if (obj.revolutionAngle !== undefined) setRevolutionAngle(obj.revolutionAngle);
        addLog(`KERNEL_SYNC: ${obj.id}`); 
        if (obj.ghostMode) addLog(`[SISTEMA]: Geometria Sintetizada via Comando de Voz detectada.`);
      },
      setRevolutionAngle,
      setNavTarget: (p: THREE.Vector3) => setNavTarget(p.clone()),
      deployToAssembly: (id: string) => {
        const blueprint = stagedObjects.find(o => o.id === id);
        if (blueprint) {
          const instanceId = uuidv4().slice(0, 8);
          setInstances(prev => [...prev, { id: instanceId, blueprintId: id, position: navTarget.clone(), rotation: 0, layer, renderMode: currentRenderMode, manifestation: currentManifestation, dfd: blueprint.dfd || generateDefaultDfD(blueprint.name) }]);
          setSelectedInstanceId(instanceId);
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