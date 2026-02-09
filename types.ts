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

export interface CoordinatePolar {
  theta: number;
  phi: number;
  radius: number;
}

export interface DisassemblyData {
  connectionType: ConnectionType;
  accessibilityLevel: number; // 0.0 to 1.0
  disassemblyTool: string;
  recyclabilityIndex: number;
  lifecyclePhase: LifecyclePhase;
  steps: string[];
}

export type ISODomain = 'BIM' | 'AUTO' | 'CHIP';

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
  revolutionAngle?: number;
  dfd?: DisassemblyData;
}

export interface AssemblyInstance {
  id: string;
  blueprintId: string;
  position: Vector3;
  rotation: number;
  layer: number;
  renderMode: RenderMode;
  manifestation: Manifestation;
  scale?: number;
  dfd: DisassemblyData;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'json' | 'geometry_proposal';
  proposalData?: Partial<StagedObject>;
  timestamp: number;
}
