(function (angular, Sequelize, sequelize) {
    var app = angular.module('app'),
        Product,
        Client,
        Invoice,
        InvoiceProducts,
        Settings;

    Product = sequelize.define('Product', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        shortTitle: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true,
                isFloat: true
            }
        },
        position: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });

    Client = sequelize.define('Client', {
        title: { type: Sequelize.STRING, allowNull: false, unique: true }
    });

    Invoice = sequelize.define('Invoice', {
        date: { type: Sequelize.DATE, allowNull: false },
        timestamp: { type: Sequelize.INTEGER, allowNull: false }
    });

    InvoiceProducts = sequelize.define('invoiceProducts', {
        count: { type: Sequelize.INTEGER, defaultValue: 0 },
        price: { type: Sequelize.FLOAT, defaultValue: 0 }
    });

    Settings = sequelize.define('Settings', {
        title: { type: Sequelize.STRING, defaultValue: '' },
        invoiceEditPeriod: { type: Sequelize.INTEGER, defaultValue: 0 },
        copiesDefault: { type: Sequelize.INTEGER, defaultValue: 2 }
    });

    Invoice.belongsToMany(Product, { through: InvoiceProducts });
    Invoice.belongsTo(Client);
    Product.belongsToMany(Invoice, { through: InvoiceProducts });

    app.factory('Client', function ProductFactory() {
        return Client;
    });

    app.factory('Product', function ProductFactory() {
        return Product;
    });

    app.factory('Invoice', function ProductFactory() {
        return Invoice;
    });

    app.factory('Settings', function SettingsFactory() {
        return Settings;
    });

    sequelize.sync();

})(angular, Sequelize, sequelize);