import { createContext, useContext, useState } from 'react'

const BatchContext = createContext(null)

export function SecretaryWorkflowProvider({ children }) {
  const batch = useState(null)
  return <BatchContext.Provider value={batch}>{children}</BatchContext.Provider>
}

export function useSecretaryBatch() {
  return useContext(BatchContext)
}
