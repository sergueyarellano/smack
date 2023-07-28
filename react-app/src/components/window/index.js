import styles from './index.module.css'

export default function Window ({ children, isVisible = true, title, position = 'bottomLeft' }) {
  return (
    <div className={`${isVisible ? styles.main : styles.notVisible} ${styles[position]}`}>
      <label className={`${styles.windowTitle}`}>{title}</label>
      {children}
    </div>

  )
}
