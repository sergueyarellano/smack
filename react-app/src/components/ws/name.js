import style from './name.module.css'
export default function InputName ({ setMe }) {
  return (
    <form
      className={style.form}
      onSubmit={(e) => {
        e.preventDefault()
        const value = e.target[0].value
        console.log(e.target[0].value)
        if (value) {
          setMe(value)
        }
      }}
    >
      <label className='material-symbols-outlined'>badge</label>
      <input
        className={style.input}
        type='text'
        placeholder='yo name ;)'
      />
    </form>
  )
}
