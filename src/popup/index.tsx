import styles from "./popup.module.scss"

const App = () => {
  return (
    <div className={styles.popupContainer}>
      <h1 className={styles.title}>欢迎使用免登调试插件</h1>
      <p className={styles.description}>请通过页面右下角的按钮打开调试工具</p>
      <img
        className={styles.image}
        src="https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/3733ea8d8f3309653baec7eb4a34b4cd.png"
        alt=""
      />
    </div>
  )
}

export default App
