export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('role', 50).notNullable().defaultTo('registrar');
    table.string('index_number', 100).unique();
    table.string('phone_number', 20);
    table.string('institution_name', 255);
    table.string('institution_id', 100);
    table.string('department', 100);
    table.string('position', 100);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('last_login');
    table.timestamp('password_changed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['institution_id']);
    table.index(['is_active']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
