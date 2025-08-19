export function up(knex) {
  return knex.schema.createTable('records', (table) => {
    table.increments('id').primary();
    table.string('record_number', 100).unique().notNullable();
    table.string('type', 50).notNullable(); // birth, death, marriage, divorce, adoption
    table.string('status', 50).defaultTo('pending'); // pending, approved, rejected, completed
    table.integer('registrar_id').unsigned().references('id').inTable('users');
    table.integer('institution_id').unsigned().references('id').inTable('institutions');
    table.string('submission_date').notNullable();
    table.string('event_date').notNullable();
    table.string('location', 255);
    table.json('data'); // Event-specific data (varies by type)
    table.json('documents'); // Array of document references
    table.json('verification_data'); // Data from verification processes
    table.json('ai_analysis'); // Results from AI analysis
    table.string('notes', 1000);
    table.string('rejection_reason', 500);
    table.integer('reviewed_by').unsigned().references('id').inTable('users');
    table.timestamp('reviewed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['type']);
    table.index(['status']);
    table.index(['registrar_id']);
    table.index(['institution_id']);
    table.index(['event_date']);
    table.index(['record_number']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('records');
}
