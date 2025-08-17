export function up(knex) {
  return knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.string('filename', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('file_path', 500).notNullable();
    table.string('file_type', 100).notNullable();
    table.integer('file_size').notNullable(); // in bytes
    table.string('mime_type', 100);
    table.integer('record_id').unsigned().references('id').inTable('records');
    table.integer('uploaded_by').unsigned().references('id').inTable('users');
    table.string('document_type', 100); // birth_certificate, death_certificate, etc.
    table.json('ocr_data'); // OCR extracted text
    table.json('ai_analysis'); // AI analysis results
    table.boolean('is_verified').defaultTo(false);
    table.string('verification_status', 50).defaultTo('pending');
    table.json('metadata'); // Additional document metadata
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['record_id']);
    table.index(['uploaded_by']);
    table.index(['document_type']);
    table.index(['is_verified']);
    table.index(['file_type']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('documents');
}
