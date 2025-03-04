// import { StyleProvider } from "@ant-design/cssinjs";
// import { ConfigProvider } from "antd";
// import cssText from "data-text:~/contents/index.scss";
// import antdResetCssText from "data-text:antd/dist/reset.css";
// import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo";



// import Widget from "./components/widget";


// const HOST_ID = "csui"

// export const config: PlasmoCSConfig = {
//   all_frames: true
// }

// export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

// export const getStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = antdResetCssText + cssText
//   return style
// }

// const EngageOverlay = () => {
//   return (
//     <ConfigProvider>
//       <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
//         <Widget container={document.getElementById(HOST_ID).shadowRoot} />
//       </StyleProvider>
//     </ConfigProvider>
//   )
// }
