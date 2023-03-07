import * as amqp from 'amqplib'
import { createProduct, updateProductById, deleteProductById } from './product.service'
const queue = 'product'
const queue2 = 'product_update'
const queue3 = 'product_delete'


export async function subscriber(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await  connection.createChannel()

    await channel.assertQueue(queue)

    channel.consume(queue, (message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Mensaje recibido de la cola: ${queue}`)
        content.product._id = content.product.id
        const create = createProduct(content.product)
        console.log(create)
        channel.ack(message)
    })
}

subscriber().catch((error)=>{
    console.log(error)
    process.exit(1)
})

export default async function subscriber2(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await  connection.createChannel()

    await channel.assertQueue(queue2)

    channel.consume(queue2, (message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Mensaje recibido de la cola: ${queue2}`)
        const updateProduct = updateProductById(content.productId,content.product)
        console.log(updateProduct)
        channel.ack(message)
    })
}

subscriber2().catch((error)=>{
    console.log(error)
    process.exit(1)
})

export async function subscriber3(){
    const connection = await amqp.connect('amqp://localhost')
    const channel = await  connection.createChannel()

    await channel.assertQueue(queue3)

    channel.consume(queue3, (message: any) => {
        const content = JSON.parse(message.content.toString())

        console.log(`Mensaje recibido de la cola: ${queue3}`)
        const deleteProduct = deleteProductById(content.productId)
        console.log(deleteProduct)
        channel.ack(message)
    })
}

subscriber3().catch((error)=>{
    console.log(error)
    process.exit(1)
})

