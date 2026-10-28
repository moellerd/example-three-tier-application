exports.up = (pgm) => {
  pgm.createTable('challenges', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(500)', notNull: true },
    completed: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('challenges');
};
