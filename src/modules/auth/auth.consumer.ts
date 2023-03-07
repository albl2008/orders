import * as amqp from 'amqplib'
import { registerUser } from '../user/user.service'
const queue = 'user'

export default async function subscriber(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await  connection.createChannel()

    await channel.assertQueue(queue)

    channel.consume(queue, (message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Mensaje recibido de la cola: ${queue}`)
        console.log(content)
        const register = registerUser(content)
        console.log(register)


        channel.ack(message)
    })
}

subscriber().catch((error)=>{
    console.log(error)
    process.exit(1)
})

