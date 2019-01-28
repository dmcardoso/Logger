// Update with your config settings.

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: './database/logger.sqlite'
    },
    useNullAsDefault: true,
    pool: {min: 0, max: 7}
};
