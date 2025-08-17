export function up(knex) {
  return knex.schema.createTable('audit_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('action', 100).notNullable(); // create, read, update, delete, login, logout
    table.string('resource_type', 100).notNullable(); // user, record, document, etc.
    table.integer('resource_id'); // ID of the affected resource
    table.string('resource_identifier', 255); // Human-readable identifier
    table.json('old_values'); // Previous values before change
    table.json('new_values'); // New values after change
    table.string('ip_address', 45); // IPv4 or IPv6
    table.string('user_agent', 500);
    table.string('session_id', 255);
    table.json('metadata'); // Additional context information
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['user_id']);
    table.index(['action']);
    table.index(['resource_type']);
    table.index(['resource_id']);
    table.index(['created_at']);
    table.index(['ip_address']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('audit_logs');
}
