exports.up = (pgm) => {
  pgm.createTable('challenges', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(500)', notNull: true },
    description: { type: 'text', notNull: true },
    difficulty: { type: 'varchar(50)', notNull: true, default: 'medium' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('challenges');
};
