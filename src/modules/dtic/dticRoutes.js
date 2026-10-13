import existing from './generated/routes.json'
import infrastructure from './infrastructure/generated/routes.json'
export default [...existing, ...infrastructure]
