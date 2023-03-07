const amqp = require('amqplib')
const queue = 'order'

async function publisher() {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hello world!'
        }

        const sent = await channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),
            {
                // persistent: true
            }
        )

        sent
            ? console.log(`Sent message to "${queue}" queue`, message)
            : console.log(`Fails sending message to "${queue}" queue`, message)
    
}

publisher().catch((error) => {
    console.error(error)
    process.exit(1)
})


