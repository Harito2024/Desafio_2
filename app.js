const fs = require('fs').promises


class ProductManager {

    static lastId = 0

    constructor(path) {
        this.products = [],
        this.path = path
    }

    async addProduct(newObjet) {

        let { title, description, price, thumbnail, code, stock } = newObjet

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Faltan campos')
            return
        }
        const codeFound = this.products.find((id) => id.code === code)
        if (codeFound) {
            console.log('Codigo de Producto repetido')
            return
        }

        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)
        console.log(newProduct)

        /*Guardo el newObjet en el archivo*/
        await this.saveFilesMio(this.products)

    }
    getProduct() {
        console.log(this.products)
    }
    async getProductById(id) {

        try {
            const arrayProducts = await this.readFilesMio()
            const idFound = arrayProducts.find(item => item.id === id)
            if (!idFound) {
                console.log('No se ecuentra el producto con ese id')
            } else {
                console.log('Producto encontrado')
                return idFound
            }
        } catch (error) {
            console.log('Error en lectura de  archivo', error)
        }
    }
    

    //--------------------Nuevos Metodos----------------//
    async readFilesMio() {
        try {
            const res = await fs.readFile(this.path, 'utf-8')
            const arrayDeProductos = JSON.parse(res)
            return arrayDeProductos
        } catch (error) {
            console.log('Error al leer el archivo', error)
        }
    }

    async saveFilesMio(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
        } catch (error) {
            console.log('Error al guardar el archivo', error)
        }
    }

    async upDateProduct(id, productUpdate){
        try {
            const arrayProducts = await this.readFilesMio()

            const index = arrayProducts.findIndex(item => item.id === id)
            if(index !== -1){
                arrayProducts.splice(index, 1, productUpdate)
                await this.saveFilesMio(arrayProducts)
            }else{
                console.log('NO se encontro el producto a actualizar')
            }

        } catch (error) {
            console.log('Error, no se pudo actualizar el producto', error)
        }
    }

    async deleteProduct(id){
        try {
            const arrayProducts = await this.readFilesMio()
            const deleteUpDate = arrayProducts.filter(item => item.id != id)
            await this.saveFilesMio(deleteUpDate)

        } catch (error) {
            console.log('No se puede pudo borrar el producto')
        }
    }
}

//Test
const manager = new ProductManager('./productos.json')
manager.getProduct()


const product1 = {

    title: 'Produto Prueba1',
    description: 'Este es un Producto de Prueba1',
    price: 200,
    thumbnail: 'Sin Imagen',
    code: 'abc123',
    stock: 25
}
manager.addProduct(product1)

const product2 = {
    title: 'Produto Prueba2',
    description: 'Este es un Producto de Prueba2',
    price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
manager.addProduct(product2)

const product3 = {
    title: 'Produto Prueba3',
    description: 'Este es un Producto de Prueba 3 con error de campo al cual le falta el precio',
    //price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
manager.addProduct(product3)

const product4 = {
    title: 'Produto Prueba4',
    description: 'Este es un Producto de Prueba4 con codigo repetido',
    price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
manager.addProduct(product4)

async function testBuscadoPorId(id){
    const encontrado = await manager.getProductById(id)
    console.log(encontrado)
}

testBuscadoPorId(2)

const product5 = {
    id: 1,
    title: 'Produto Prueba5',
    descripcion: 'Este es un Producto de Prueba para actualizar el producto 1',
    price: 200,
    thumbnail: 'Sin Imagen',
    code: 'abc123',
    stock: 25
}

async function testActualizar(id){
    await manager.upDateProduct(id, product5)
    console.log(product5)
}


//testActualizar(1)

async function testBorrar(id){
    await manager.deleteProduct(id)
}

//testBorrar(1)
