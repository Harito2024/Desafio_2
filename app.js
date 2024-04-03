const fs = require('fs').promises


class ProductManager {

    static lastId = 0

    constructor(path) {
        this.products = [],
            this.path = path
    }

    async addProduct(newObjet) {

        let { title, descripcion, price, thumbnail, code, stock } = newObjet

        if (!title || !descripcion || !price || !thumbnail || !code || !stock) {
            console.log('Faltan campos')
            return
        }
        const codeEncotrado = this.products.find((id) => id.code === code)
        if (codeEncotrado) {
            console.log('Codigo de Producto repetido')
            return
        }

        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            descripcion,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)
        console.log(newProduct)

        /*Guardo el newObjet en el archivo*/
        await this.guardarArchivo(this.products)

    }
    getProduct() {
        console.log(this.products)
    }
    async getProductById(id) {

        try {
            const arrayDeProductos = await this.leerArchivo()
            const encontrado = arrayDeProductos.find(item => item.id === id)
            if (!encontrado) {
                console.log('No se ecuentra el producto con ese id')
            } else {
                console.log('Producto encotrado')
                return encontrado
            }
        } catch (error) {
            console.log('Error en lectura de  archivo', error)
        }

        
    }

    //--------------------Nuevos Metodos----------------//
    async leerArchivo() {
        try {
            const res = await fs.readFile(this.path, 'utf-8')
            const arrayDeProductos = JSON.parse(res)
            return arrayDeProductos
        } catch (error) {
            console.log('Error al leer el archivo', error)
        }
    }

    async guardarArchivo(arrayDeProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayDeProductos, null, 2))
        } catch (error) {
            console.log('Error al guardar el archivo', error)
        }
    }

    async upDateProduct(id, productUpdate){
        try {
            const arrayProductos = await this.leerArchivo()

            const index = arrayProductos.findIndex(item => item.id === id)
            if(index !== -1){
                arrayProductos.splice(index, 1, productUpdate)
                await this.guardarArchivo(arrayProductos)
            }else{
                console.log('NO se encontro el producto a actualizar')
            }

        } catch (error) {
            console.log('Error, no se pudo actualizar el producto', error)
        }
    }

    async deleteProduct(id){
        try {
            const arrayProductos = await this.leerArchivo()
            const borrarActualizar = arrayProductos.filter(item => item.id != id)
            await this.guardarArchivo(borrarActualizar)

        } catch (error) {
            console.log('No se puede pudo borrar el producto')
        }
    }
}

//Test
const manager = new ProductManager('./productos.json')
//manager.getProduct()


const product1 = {

    title: 'Produto Prueba1',
    descripcion: 'Este es un Producto de Prueba1',
    price: 200,
    thumbnail: 'Sin Imagen',
    code: 'abc123',
    stock: 25
}
//manager.addProduct(product1)

const product2 = {
    title: 'Produto Prueba2',
    descripcion: 'Este es un Producto de Prueba2',
    price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
//manager.addProduct(product2)

const product3 = {
    title: 'Produto Prueba3',
    descripcion: 'Este es un Producto de Prueba 3 con error de campo al cual le falta el precio',
    //price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
//manager.addProduct(product3)

const product4 = {
    title: 'Produto Prueba4',
    descripcion: 'Este es un Producto de Prueba4 con codigo repetido',
    price: 300,
    thumbnail: 'Sin Imagen',
    code: 'abc124',
    stock: 35
}
//manager.addProduct(product4)

async function testBuscadoPorId(id){
    const encontrado = await manager.getProductById(id)
    console.log(encontrado)
}

//testBuscadoPorId(3)

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
