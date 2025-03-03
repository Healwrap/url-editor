import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  const message = `background:${req.body.id}`
  console.log(message)
  res.send({
    message
  })
}

export default handler
