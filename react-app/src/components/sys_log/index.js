import style from './index.module.css'

const logStyle = {
  ERROR: style.errorLog,
  LOG: style.defaultLog,
  SUCCESS: style.successLog
}
export default function SysLog ({ commands, isConnected }) {
  return (
    <div className={style.main}>
      <label style={{ color: isConnected ? 'green' : 'red' }}>
        Web socket {isConnected ? 'connected' : 'disconnected'}
      </label>
      <label>{commands?.map(composeLogItem)}</label>
    </div>
  )
}
function composeLogItem ({ command }, index) {
  return <li key={index}>{command}</li>
}
