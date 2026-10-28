exports.up = (pgm) => {
  pgm.addColumn('tasks', {
    deleted_at: { type: 'timestamp', notNull: false, default: null },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('tasks', 'deleted_at');
};
