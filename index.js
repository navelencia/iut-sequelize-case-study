// On destruct la libraire sequelize pour recuperer la classe et l'objet DataTypes
const { Sequelize, DataTypes } = require('sequelize');

// On initialise sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// On definit deux models, des tables in fine avec des attributs
const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING
    }
  }, {
});

const Order = sequelize.define('Order', {
    customer: {
      type: DataTypes.STRING
    }
  }, {
});

// On cree deux relations, une pour plusieurs produits vers une commande, une pour une commande vers plusieurs produits
Product.belongsTo(Order);
Order.hasMany(Product);

// La mega fonction pour pouvoir executer du code asynchrone facilement
async function run () {
    try {
        // Verifions notre acces a la base
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Appliquons le model de donnees a la base (force: true efface tout sur son passage)
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");

        // Creons une commande qui contiendra plusieurs produits
        const firstOrder = await Order.create({ customer: 'Tres gros client' });
        await Product.create({ name: 'Papier A4', sku: '67981', OrderId: firstOrder.id });
        await Product.create({ name: 'Vaccin 5G', sku: '66666', OrderId: firstOrder.id });
        await Product.create({ name: 'iPhone 16 maxi best of', sku: '2313', OrderId: firstOrder.id });

        // Demandons toutes les commandes disponibles en BDD, et loggons les proprement
        const orders = await Order.findAll({ include: { model: Product } });
        console.log(JSON.stringify(orders, undefined, 2));
    } catch (error) {
        console.error('Error', error);
    }
};

// Lancons la fonction async
run();