import style from './index.module.css'

const logStyle = {
  ERROR: style.errorLog,
  LOG: style.defaultLog,
  SUCCESS: style.successLog
}
export default function SysLog ({ logs }) {
  const composeLogItem = ({ message, type }, index) => (
    <li key={index} className={logStyle[type]}>
      {message}
    </li>
  )
  return <div className={style.main}>{logs.map(composeLogItem)}</div>
}
