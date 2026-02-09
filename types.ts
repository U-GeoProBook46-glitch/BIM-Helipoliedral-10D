import { Vector3 } from 'three';

export enum AppMode {
  Lathe = 'Lathe',
  Assembly = 'Assembly'
}

export enum RenderMode {
  Euclidian = 'Euclidian',
  Ramanujan = 'Ramanujan'
}

export enum Manifestation {
  Wireframe = 'Wireframe',
  Surface = 'Surface',
  Volume = 'Volume'
}

export type ConnectionType = 'MECHANICAL_BOLT' | 'GRAVITY_FIT' | 'CHEMICAL_GLUE' | 'WELDED';
export type LifecyclePhase = 'ASSEMBLY' | 'OPERATION' | 'END_OF_LIFE';

export interface DisassemblyData {
  connectionType: ConnectionType;
  accessibilityLevel: number; // 0.0 to 1.0
  disassemblyTool: string;
  recyclabilityIndex: number;
  lifecyclePhase: LifecyclePhase;
  steps: string[];
}

export type ISODomain = 'BIM' | 'AUTO' | 'CHIP';

export interface CoordinatePolar {
  theta: number;
  phi: number;
}

export interface StagedObject {
  id: string;
  name: string;
  points: [number, number, number][];
  layer: number;
  domain: ISODomain;
  subFolder: string;
  description: string;
  recoveryScore: number;
  timestamp: number;
  unit: string;
  dfd?: DisassemblyData;
}

export interface AssemblyInstance {
  id: string; // Unique for instance
  blueprintId: string;
  position: Vector3;
  rotation: number;
  layer: number;
  renderMode: RenderMode;
  manifestation: Manifestation;
  scale?: number;
  dfd: DisassemblyData;
}

export interface BIMState {
  mode: AppMode;
  layer: number;
  points: Vector3[];
  stagedFaces: Vector3[][];
  isClosed: boolean;
  precisionLines: boolean;
  stagedObjects: StagedObject[];
  instances: AssemblyInstance[];
  selectedInstanceId: string | null;
  status: string;
  showWorkflowModal: boolean;
  showDomainModal: boolean;
  currentDomain: ISODomain | null;
  currentManifestation: Manifestation;
  currentRenderMode: RenderMode;
  revolutionAngle: number;
  navTarget: Vector3;
}