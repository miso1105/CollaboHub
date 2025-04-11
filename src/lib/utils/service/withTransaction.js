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
        console.error('트랜잭션 실패:', error);
        throw error;
    } finally {
        connection.release();
    }
};