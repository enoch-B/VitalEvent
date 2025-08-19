export function up(knex) {
  return knex.schema.createTable('institutions', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('type', 100).notNullable(); // hospital, court, religious_institution, etc.
    table.string('code', 100).unique().notNullable();
    table.string('address', 500);
    table.string('city', 100);
    table.string('state', 100);
    table.string('country', 100).defaultTo('Ethiopia');
    table.string('phone', 20);
    table.string('email', 255);
    table.string('website', 255);
    table.string('contact_person', 255);
    table.string('contact_phone', 20);
    table.string('contact_email', 255);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.json('metadata'); // Additional institution-specific data
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['type']);
    table.index(['code']);
    table.index(['city']);
    table.index(['is_active']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('institutions');
}
