const getConnection = require('../../../config/db');

exports.withTransaction = async (callback) => {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error; 
    } finally {
        connection.release();
    }
};