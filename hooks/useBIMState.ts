import { useState, useCallback, useMemo } from 'react';
import { Vector3 } from 'three';
import { v4 as uuidv4 } from 'uuid';
import { AppMode, Manifestation, RenderMode, StagedObject, AssemblyInstance, ISODomain } from '../types';
import { snapToPrecisionLines } from '../utils/math/polar';
import { analyzeDisassembly } from '../utils/math/analysis';

export const useBIMState = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Lathe);
  const [layer, setLayer] = useState<number>(32.5);
  const [points, setPoints] = useState<Vector3[]>([]);
  const [stagedFaces, setStagedFaces] = useState<Vector3[][]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [precisionLines, setPrecisionLines] = useState(true);
  const [stagedObjects, setStagedObjects] = useState<StagedObject[]>([]);
  const [instances, setInstances] = useState<AssemblyInstance[]>([]);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);
  const [status, setStatus] = useState("IDLE | WAITING COMMAND");
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<ISODomain | null>(null);
  const [currentManifestation, setCurrentManifestation] = useState<Manifestation>(Manifestation.Wireframe);
  const [currentRenderMode, setCurrentRenderMode] = useState<RenderMode>(RenderMode.Euclidian);

  const activeRadius = useMemo(() => layer * 2.5, [layer]);

  const addPoint = useCallback((point: Vector3) => {
    if (!currentDomain) {
      setShowDomainModal(true);
      return;
    }
    if (isClosed) return;
    const snapped = precisionLines ? snapToPrecisionLines(point, activeRadius) : point;
    
    if (points.length > 2 && snapped.distanceTo(points[0]) < 2) {
      setIsClosed(true);
      setShowWorkflowModal(true);
      setStatus("TOPOLOGY CRYSTALLIZED | FACE CLOSED");
      return;
    }
    setPoints(prev => [...prev, snapped]);
  }, [points, isClosed, precisionLines, activeRadius, currentDomain]);

  const continueDrawing = useCallback(() => {
    if (points.length > 2) {
      setStagedFaces(prev => [...prev, [...points]]);
      setPoints([]);
      setIsClosed(false);
      setShowWorkflowModal(false);
      setStatus("DRAWING CONTINUITY | CACHED FACE");
    }
  }, [points]);

  const saveToISOStock = useCallback((domain: ISODomain, subFolder: string) => {
    const allFaces = [...stagedFaces, points].filter(f => f.length > 2);
    if (allFaces.length === 0) return;

    const consolidatedPoints = allFaces.flat();
    const newObj: StagedObject = {
      id: `ISO-${uuidv4().slice(0, 8).toUpperCase()}`,
      name: `UNIT-${allFaces.length}F`,
      points: consolidatedPoints.map(p => [p.x, p.y, p.z]),
      layer,
      domain,
      subFolder,
      description: `ISO ${domain} Active Topology`,
      recoveryScore: analyzeDisassembly(consolidatedPoints),
      timestamp: Date.now(),
      unit: subFolder === 'm' ? 'm' : subFolder === 'Micrometer' ? 'μm' : 'mm'
    };

    setStagedObjects(prev => [newObj, ...prev]);
    setStagedFaces([]);
    setPoints([]);
    setIsClosed(false);
    setShowWorkflowModal(false);
    setStatus(`MATERIALIZED TO ${domain}/${subFolder}`);
  }, [stagedFaces, points, layer]);

  const instantiate = useCallback((id: string, pos: Vector3) => {
    setInstances(prev => [...prev, { blueprintId: id, position: pos, rotation: 0, layer, renderMode: currentRenderMode, manifestation: currentManifestation }]);
  }, [layer, currentRenderMode, currentManifestation]);

  return {
    appState: { mode, layer, points, stagedFaces, isClosed, precisionLines, stagedObjects, instances, selectedBlueprintId, activeRadius, showWorkflowModal, showDomainModal, currentDomain },
    uiState: { status, currentManifestation, currentRenderMode },
    handlers: { 
      setMode, setLayer, addPoint, continueDrawing, saveToISOStock, 
      undo: () => setPoints(p => p.slice(0, -1)), 
      clear: () => { setPoints([]); setStagedFaces([]); setIsClosed(false); setShowWorkflowModal(false); },
      setPrecisionLines, setSelectedBlueprintId, instantiate, setShowWorkflowModal, setShowDomainModal, setCurrentDomain,
      addObject: (obj: StagedObject) => setStagedObjects(prev => [obj, ...prev])
    },
    // @google/genai fix: Align handler names with component prop expectations
    uiHandlers: { setManifestation: setCurrentManifestation, setRenderMode: setCurrentRenderMode }
  };
};