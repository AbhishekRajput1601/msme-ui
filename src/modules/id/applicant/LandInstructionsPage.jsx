import LandReferencePage from './reference/LandReferencePage'
export default function LandInstructionsPage({ undeveloped = false }) { return <LandReferencePage name={undeveloped ? 'idInstructionUL' : 'idInstruction'} /> }
